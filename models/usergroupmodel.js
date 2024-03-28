const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const User = require("./userdetailsmodel");
const Group = require("./groupmodel");

const UserGroup = sequelize.define("usergroup", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  groupId: {
    type: Sequelize.INTEGER,
    references: {
      model: Group,
      key: "gid",
    },
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = UserGroup;
