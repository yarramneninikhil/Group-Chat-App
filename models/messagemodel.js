const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = require("./userdetailsmodel");
const Group = require("./groupmodel");
const Message = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  senderName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: "gid",
    },
  },
});

module.exports = Message;
