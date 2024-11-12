const express = require("express");
const { addStock } = require("../controllers/stockController");
const router = express.Router();

router.route("/").post(addStock);

module.exports = router;
