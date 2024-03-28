const form = document.querySelector("#groupForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    name: form.querySelector("#name").value.trim(),
    group: form.querySelector("#group").value.trim(),
  };
  try {
    const token = localStorage.getItem("token");
    const { status, data } = await axios.post(
      "http://localhost:3000/creategroup",
      obj,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    if (status === 201) {
      const url = `http://127.0.0.1:5500/public/index.html?name=${obj.name}&group=${obj.group}&gid=${data.groupId}`;
      window.location.href = url;
    }
  } catch (err) {
    if (err.response.status === 409) {
      alert(err.response.data.message);
    } else {
      alert(err.response.data);
    }
  }
  form.reset();
});
