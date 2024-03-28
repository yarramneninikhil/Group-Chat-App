const jwt = require("jsonwebtoken");
const sequelize = require("../db/database");
const Group = require("../models/groupmodel");
const User = require("../models/userdetailsmodel");
const UserGroup = require("../models/usergroupmodel");
const Message = require("../models/messagemodel");

async function createGroup(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodetoken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const groupAvailable = await Group.findOne({
      where: {
        groupname: req.body.group,
      },
    });
    if (!groupAvailable) {
      const { gid } = await Group.create({
        groupname: req.body.group,
        createdby: req.body.name,
        userId: decodetoken.userId,
      });
      if (gid) {
        await UserGroup.create({
          userId: decodetoken.userId,
          groupId: gid,
          isAdmin: true,
        });
      }
      res
        .status(201)
        .json({ message: "Group created successfully", groupId: gid });
    } else {
      res.status(409).json({ message: "Group already exists" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

async function getUserGroups(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodetoken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const groups = await UserGroup.findAll({
      where: {
        userId: decodetoken.userId,
      },
    });
    if (groups) {
      const usergroups = [];
      for (const element of groups) {
        const gid = element.dataValues.groupId;
        console.log(gid);
        const findGroup = await Group.findOne({
          where: {
            gid: gid,
          },
        });
        usergroups.push(findGroup.dataValues);
      }
      res.status(200).json(usergroups);
    }
  } catch (err) {
    res.json({ Error: "Error in fetching groups" });
  }
}

async function getAllGroups(req, res) {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (err) {
    res.json(err);
  }
}

async function getGroupMessages(req, res) {
  try {
    const gid = req.params.gid;
    const GroupMessages = await Message.findAll({
      where: {
        groupId: gid,
      },
    });
    res.status(200).json(GroupMessages);
  } catch (err) {
    res.json({ Error: "Error in fetching group messages" });
  }
}

module.exports = {
  createGroup,
  getUserGroups,
  getAllGroups,
  getGroupMessages,
};
