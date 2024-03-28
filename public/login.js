const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let userObject = {
    email: document.querySelector("#email").value.trim(),
    password: document.querySelector("#password").value.trim(),
  };
  async function verifyUserDetails(obj) {
    try {
      const { status, data } = await axios.post(
        "http://localhost:3000/verifydetails",
        obj
      );
      if (status === 200) {
        localStorage.setItem("token", data);
        alert("User has logged successfully");
        window.location.href = "./creategroup.html";
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert(err.response.data);
      } else if (err.response && err.response.status === 401) {
        alert(err.response.data);
      } else {
        alert(err.response.data);
      }
    }
  }
  verifyUserDetails(userObject);
  form.reset();
});
