const express = require("express");
const { uploadFile } = require("../controllers/multimediacontroller");

const MultiMediaRouter = express.Router();
MultiMediaRouter.post("/upload", uploadFile);
module.exports = MultiMediaRouter;
