const groupList = document.querySelector(".group-names");

async function fetchAllGroups() {
  try {
    const groups = await axios.get("http://localhost:3000/allgroups");
    groups.data.forEach((element) => {
      const li = document.createElement("li");
      li.textContent = element.groupname;
      const joinbtn = document.createElement("button");
      joinbtn.textContent = "Join";
      joinbtn.addEventListener("click", async () => {
        try {
          const gid = element.gid;
          const gname = element.groupname;
          const token = localStorage.getItem("token");
          const [headers, payload, signature] = token.split(".");
          const res = JSON.parse(atob(payload));
          const updateUser = await axios.post(
            "http://localhost:3000/userjoinedvialink",
            {
              gid,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          window.location.href = `http://127.0.0.1:5500/public/index.html?name=${res.userName}&group=${gname}&gid=${gid}`;
        } catch (err) {
          console.log(err);
        }
      });
      li.appendChild(joinbtn);
      groupList.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

fetchAllGroups();
