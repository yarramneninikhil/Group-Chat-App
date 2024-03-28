const aws = require("aws-sdk");
const Message = require("../models/messagemodel");
require("dotenv").config();
async function uploadFile(req, res) {
  try {
    const fileContent = Buffer.from(req.files.file.data, "hex");
    const gid = req.body.gid;
    const name = req.body.name;
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESSKEY,
      secretAccessKey: process.env.AWS_SECRETKEY,
    });

    const params = {
      Bucket: "groupchatappmultimedia",
      Key: req.files.file.name,
      Body: fileContent,
      ACL: "public-read",
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Failed to upload file to S3" });
      }
      res.status(200).json({ success: true, url: data.Location });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  uploadFile,
};
