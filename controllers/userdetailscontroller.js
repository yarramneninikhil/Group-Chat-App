const User = require("../models/userdetailsmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
async function postUserDetails(req, res) {
  try {
    let newUser;
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userExist) {
      throw createError(401, "user already Exists");
    } else {
      newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phonenum: req.body.number,
        password: await bcrypt.hash(req.body.password, 10),
      });
      res.status(200).json(newUser);
    }
  } catch (err) {
    if (err.status && err.message) {
      res.status(err.status).json(err.message);
    } else {
      res.status(500).json(err.message);
    }
  }
}

async function verifyUserDetails(req, res) {
  try {
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userExist) {
      const passwordCheck = await bcrypt.compare(
        req.body.password,
        userExist.dataValues.password
      );
      if (passwordCheck) {
        const payload = {
          userId: userExist.dataValues.id,
          userName: userExist.dataValues.name,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETKEY);
        res.status(200).json(token);
      } else {
        throw createError(401, "Password is incorrect");
      }
    } else {
      throw createError(404, "User Does Not Exists");
    }
  } catch (err) {
    if (err.status && err.message) {
      res.status(err.status).json(err.message);
    } else {
      res.status(500).json("Internal server Error");
    }
  }
}

async function fetchUser(req, res) {
  try {
    const number = req.params.phone;
    const user = await User.findOne({
      where: {
        phonenum: number,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.json({ Error: "Error in fetching user details" });
  }
}

module.exports = {
  postUserDetails,
  verifyUserDetails,
  fetchUser,
};
