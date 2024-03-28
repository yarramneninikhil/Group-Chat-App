const UserGroup = require("../models/usergroupmodel");
const Group = require("../models/groupmodel");
const jwt = require("jsonwebtoken");
const User = require("../models/userdetailsmodel");
const Sequelize = require("sequelize");
async function addUserToGroup(req, res) {
  try {
    const addUser = await UserGroup.create({
      userId: req.body.userId,
      groupId: Number(req.body.gid),
    });
    res.status(200).json(addUser);
  } catch (err) {
    res.json({ Error: "Error in adding user to group " });
  }
}

async function userJoinedThroughLink(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodetoken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const findUser = await UserGroup.findOne({
      where: {
        userId: decodetoken.userId,
        groupId: req.body.gid,
      },
    });
    if (!findUser) {
      const joinedUser = await UserGroup.create({
        userId: decodetoken.userId,
        groupId: req.body.gid,
      });
      res.status(200).json({ message: "User joined the group" });
    } else {
      res.status(200).json({ message: "User available the group" });
    }
  } catch (err) {
    res.json({ Error: "Error in joining the group" });
  }
}

async function findUser(req, res) {
  try {
    const number = req.params.num;
    const FindUser = await User.findOne({
      where: {
        phonenum: number,
      },
    });
    res.status(200).json(FindUser);
  } catch (err) {
    res.json(err);
  }
}

async function deleteUserFromGroup(req, res) {
  try {
    const id = req.params.id;
    const gid = req.params.gid;
    const deleteUser = await UserGroup.destroy({
      where: {
        userId: id,
        groupId: gid,
      },
    });
    res.status(200).json("user remove from the group");
  } catch (err) {
    res.json(err.message);
  }
}

async function makeUserAdmin(req, res) {
  try {
    const makeAdmin = await UserGroup.update(
      {
        isAdmin: true,
      },
      {
        where: {
          userId: req.body.id,
          groupId: req.body.gid,
        },
      }
    );
    res.status(200).json("This user is the admin of the group");
  } catch (err) {
    res.json(err.message);
  }
}

async function getAllAdminsOfGroup(req, res) {
  try {
    const gid = req.params.gid;
    const adminUsers = await UserGroup.findAll({
      where: {
        groupId: gid,
      },
    });
    const AdminNames = [];
    for (let { userId, isAdmin } of adminUsers) {
      if (isAdmin) {
        try {
          const { name } = await User.findOne({
            where: {
              id: userId,
            },
          });
          AdminNames.push(name);
        } catch (err) {
          console.log(err);
        }
      }
    }
    res.status(200).json(AdminNames);
  } catch (err) {
    res.json(err.message);
  }
}

module.exports = {
  addUserToGroup,
  userJoinedThroughLink,
  findUser,
  deleteUserFromGroup,
  makeUserAdmin,
  getAllAdminsOfGroup,
};
