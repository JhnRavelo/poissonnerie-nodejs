const express = require("express");
const { addAchat } = require("../controllers/achatController");
const router = express.Router();

router.route("/").post(addAchat);

module.exports = router;
