const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const sequelize = require("./db/database");
const userRouter = require("./router/userdetailsrouter");
const GroupRouter = require("./router/grouprouter");
const UserJoinedGroupRouter = require("./router/userjoinedgrouprouter");
const Message = require("./models/messagemodel");
const MultiMediaRouter = require("./router/multimediarouter");
const ArcheivedMessage = require("./models/archeivedchatmodel");
const Sequelize = require("sequelize");
const cron = require("node-cron");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const io = socketio(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

io.on("connection", (socket) => {
  const name = socket.handshake.query.userName;
  const group = socket.handshake.query.groupName;
  const gid = socket.handshake.query.gid;
  const token = socket.handshake.query.token;
  socket.join(group);
  io.to(group).emit("userJoined", name);
  socket.on("groupMemberName", ({ name, groupName }) => {
    io.to(groupName).emit("groupMemberName", name);
  });
  socket.on("removeMemberFromGroup", ({ name, groupName }) => {
    io.to(groupName).emit("removeMemberFromGroup", name);
  });

  socket.on("messageToGroup", async ({ message, groupName, userName }) => {
    try {
      const storeMessages = await Message.create({
        content: message,
        senderName: userName,
        groupId: gid,
      });
      io.to(groupName).emit("messageToGroup", { userName, message });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("sendFile", async ({ url, groupName, userName, gid }) => {
    try {
      const storeMessages = await Message.create({
        content: url,
        senderName: userName,
        groupId: gid,
      });
      io.to(groupName).emit("sendFile", { userName, url });
    } catch (err) {
      console.log(err);
    }
  });
});

app.use(userRouter);
app.use(GroupRouter);
app.use(UserJoinedGroupRouter);
app.use(MultiMediaRouter);

async function moveOneDayMessages() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    const oneDayAgoMessages = await Message.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });
    for (let message of oneDayAgoMessages) {
      const createArchieve = await ArcheivedMessage.create({
        content: message.dataValues.content,
        senderName: message.dataValues.senderName,
        groupId: message.dataValues.groupId,
      });
    }
    console.log("messages moved to archievedChat");
  } catch (err) {
    console.log(err);
  }
}

async function deleteOneDayMessages() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    const deleteMessages = await Message.destroy({
      where: {
        createdAt: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });
    console.log("messages deleted");
  } catch (err) {
    console.log(err);
  }
}

cron.schedule("0 0 * * *", async () => {
  await moveOneDayMessages();
  await deleteOneDayMessages();
});

async function start() {
  try {
    const dbres = await sequelize.sync();
    console.log("db connected");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log("error in connecting database");
  }
}
start();
