const express = require("express");
const GroupRouter = express.Router();
const {
  createGroup,
  getUserGroups,
  getAllGroups,
  getGroupMessages,
} = require("../controllers/groupcontroller");

GroupRouter.post("/creategroup", createGroup);
GroupRouter.get("/groups", getUserGroups);
GroupRouter.get("/allgroups", getAllGroups);
GroupRouter.get("/getgroupmessages/:gid", getGroupMessages);
module.exports = GroupRouter;
