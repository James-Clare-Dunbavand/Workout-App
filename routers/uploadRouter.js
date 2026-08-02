const express = require("express");
const { uploadImage } = require("../controlers/uploadControler.js");

const router = express.Router();

router.route("/image").post(uploadImage);

module.exports = router;
