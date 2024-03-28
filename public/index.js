const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("name");
const groupName = urlParams.get("group");
const gid = urlParams.get("gid");
const socket = io("http://localhost:3000", {
  query: {
    userName,
    groupName,
    gid,
    token: localStorage.getItem("token"),
  },
});

const SearchUser = document.querySelector(".search");
const removeUser = document.querySelector(".remove");
const makeAdmin = document.querySelector(".make-admin");

function userJoinedChat(n) {
  const userMessage = document.querySelector(".users-join");
  const li = document.createElement("li");
  li.textContent = `${n} has joined the chat`;
  userMessage.appendChild(li);
}

socket.on("userJoined", (name) => {
  userJoinedChat(name);
});

function displayAdmins(name) {
  const groupAdmins = document.querySelector(".admins-list");
  const li = document.createElement("li");
  li.textContent = `${name} is the admin of the the group`;
  groupAdmins.appendChild(li);
}

async function getAllAdminsOfGroup(gid) {
  try {
    const adminsResponse = await axios.get(
      `http://localhost:3000/getalladmins/${gid}`
    );
    const admins = adminsResponse.data.map((name) => name);
    const isAdmin = admins.includes(userName);
    if (isAdmin) {
      SearchUser.classList.remove("hidden");
      removeUser.classList.remove("hidden");
      makeAdmin.classList.remove("hidden");
    } else {
      SearchUser.classList.add("hidden");
      removeUser.classList.add("hidden");
      makeAdmin.classList.add("hidden");
    }
    adminsResponse.data.forEach((element) => {
      displayAdmins(element);
    });
  } catch (err) {
    console.log(err);
  }
}

getAllAdminsOfGroup(gid);

async function getUserGroups() {
  try {
    const token = localStorage.getItem("token");
    const groups = await axios.get("http://localhost:3000/groups", {
      headers: {
        Authorization: `${token}`,
      },
    });
    groups.data.forEach((element) => {
      const groupsList = document.querySelector(".groups");
      const button = document.createElement("button");
      button.textContent = element.groupname;
      button.classList.add("groupbtn");
      button.addEventListener("click", () => {
        window.location.href = `http://127.0.0.1:5500/public/index.html?name=${userName}&group=${element.groupname}&gid=${element.gid}`;
      });
      groupsList.appendChild(button);
    });
  } catch (err) {
    console.log(err);
  }
}

getUserGroups();

function appendUsers(name) {
  const users = document.querySelector(".users-join");
  const li = document.createElement("li");
  li.textContent = `${name} joined the group`;
  users.appendChild(li);
}

function removeUsers(name) {
  const users = document.querySelector(".users-remove");
  const li = document.createElement("li");
  li.textContent = `${name} removed from the group`;
  users.appendChild(li);
}

async function findUserToJoin(e) {
  try {
    e.preventDefault();
    const number = SearchUser.querySelector("#number").value.trim();
    const FindUser = await axios.get(
      `http://localhost:3000/finduser/${number}`
    );
    if (FindUser.data) {
      const res = addUserToGroup(FindUser.data.id, gid);
      if (res) {
        const name = FindUser.data.name;
        socket.emit("groupMemberName", { name, groupName });
      }
    } else {
      alert("User not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function findUserToRemove(e) {
  try {
    e.preventDefault();
    const number = removeUser.querySelector("#rnumber").value.trim();
    const FindUser = await axios.get(
      `http://localhost:3000/finduser/${number}`
    );
    if (FindUser.data) {
      const res = removeUserFromGroup(FindUser.data.id, gid);
      if (res) {
        const name = FindUser.data.name;
        socket.emit("removeMemberFromGroup", { name, groupName });
      }
    } else {
      alert("User not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function removeUserFromGroup(id, gid) {
  try {
    const deleteUser = await axios.delete(
      `http://localhost:3000/deleteuserfromgroup/${id}/${gid}`
    );
    console.log(deleteUser.data);
  } catch (err) {
    console.log(err);
  }
}

socket.on("removeMemberFromGroup", (name) => {
  removeUsers(name);
});

socket.on("groupMemberName", (name) => {
  appendUsers(name);
});

async function addUserToGroup(userId, gid) {
  try {
    const addUser = await axios.post("http://localhost:3000/addusertogroup", {
      userId,
      gid,
    });
    return addUser.data;
  } catch (err) {
    return null;
  }
}

SearchUser.addEventListener("submit", async (e) => {
  findUserToJoin(e);
  SearchUser.reset();
});

removeUser.addEventListener("submit", (e) => {
  findUserToRemove(e);
  removeUser.reset();
});

makeAdmin.addEventListener("submit", (e) => {
  findUserToMakeAdmin(e);
  makeAdmin.reset();
});

async function findUserToMakeAdmin(e) {
  try {
    e.preventDefault();
    const number = makeAdmin.querySelector("#adminnumber").value.trim();
    const FindUser = await axios.get(
      `http://localhost:3000/finduser/${number}`
    );
    if (FindUser.data) {
      makeUserAdmin(FindUser.data.id, gid);
    } else {
      alert("User not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function makeUserAdmin(id, gid) {
  try {
    const admin = await axios.post("http://localhost:3000/makeadmin", {
      id,
      gid,
    });
    console.log(admin.data);
    getAllAdminsOfGroup(gid);
  } catch (err) {
    console.log(err);
  }
}

async function addMessages(name, mess) {
  const userMessage = document.querySelector(".user-message");
  const li = document.createElement("li");
  li.textContent = `${name} : ${mess}`;
  userMessage.appendChild(li);
}

const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = form.querySelector("#message").value;
  socket.emit("messageToGroup", { message, groupName, userName });
  form.reset();
});

socket.on("messageToGroup", ({ userName, message }) => {
  addMessages(userName, message);
});

function isUrl(str) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(str);
}
async function fetchMessages() {
  try {
    const allMessages = await axios.get(
      `http://localhost:3000/getgroupmessages/${gid}`
    );
    allMessages.data.forEach((element) => {
      const url = isUrl(element.content);
      if (url) {
        addMessageUrl(element.senderName, element.content);
      } else {
        addMessages(element.senderName, element.content);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

socket.on("connect", () => {
  fetchMessages();
});

const fileUpload = document.querySelector(".upload-file");
fileUpload.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const fileData = document.querySelector("#file");
    const file = fileData.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("gid", gid);
    formData.append("name", userName);
    const sendFile = await axios.post("http://localhost:3000/upload", formData);
    const url = sendFile.data.url;
    if (url) {
      socket.emit("sendFile", { url, groupName, userName, gid });
    }
  } catch (err) {
    console.log(err);
  }
  fileUpload.reset();
});

function addMessageUrl(userName, url) {
  const userMessage = document.querySelector(".user-message");
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.textContent = `${userName} : ${url}`;
  link.href = url;
  link.target = "_blank";
  li.appendChild(link);
  userMessage.appendChild(li);
}

socket.on("sendFile", ({ userName, url }) => {
  addMessageUrl(userName, url);
});
