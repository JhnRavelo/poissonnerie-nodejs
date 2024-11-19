const express = require("express");
const {
  addAchat,
  getAchat,
  getDaysInAMonth,
} = require("../controllers/achatController");
const router = express.Router();

router.route("/").post(addAchat).get(getAchat);

router.post("/day", getDaysInAMonth);

module.exports = router;
