const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let userObject = {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    number: document.querySelector("#number").value.trim(),
    password: document.querySelector("#password").value.trim(),
  };
  async function sendUserDetails(obj) {
    try {
      const { status, data } = await axios.post(
        "http://localhost:3000/signupdetails",
        obj
      );
      if (status === 200) {
        alert("User has Registered successfully");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert(err.response.data);
      } else {
        alert(err.response.data);
      }
    }
  }
  sendUserDetails(userObject);
  form.reset();
});
