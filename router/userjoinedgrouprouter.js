const express = require("express");
const {
  addUserToGroup,
  userJoinedThroughLink,
  findUser,
  deleteUserFromGroup,
  makeUserAdmin,
  getAllAdminsOfGroup,
} = require("../controllers/userjoinedgroupcontroller");
const UserJoinedGroupRouter = express.Router();

UserJoinedGroupRouter.post("/addusertogroup", addUserToGroup);
UserJoinedGroupRouter.get("/finduser/:num", findUser);
UserJoinedGroupRouter.post("/userjoinedvialink", userJoinedThroughLink);
UserJoinedGroupRouter.delete(
  "/deleteuserfromgroup/:id/:gid",
  deleteUserFromGroup
);
UserJoinedGroupRouter.post("/makeadmin", makeUserAdmin);
UserJoinedGroupRouter.get("/getalladmins/:gid", getAllAdminsOfGroup);
module.exports = UserJoinedGroupRouter;
