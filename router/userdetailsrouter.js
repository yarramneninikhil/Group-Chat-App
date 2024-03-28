const express = require("express");
const userRouter = express.Router();
const {
  postUserDetails,
  verifyUserDetails,
  fetchUser,
} = require("../controllers/userdetailscontroller");

userRouter.post("/signupdetails", postUserDetails);
userRouter.post("/verifydetails", verifyUserDetails);
userRouter.get("/finduser/:phone", fetchUser);
module.exports = userRouter;
