const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = require("./userdetailsmodel");
const Group = sequelize.define("groups", {
  gid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  createdby: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = Group;
