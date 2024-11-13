const express = require("express");
const { addProduct, addStock } = require("../controllers/stockController");
const router = express.Router();

router.route("/").post(addProduct);
router.route("/oneKg").post(addStock);
router.route("/demiKg").post(addStock);

module.exports = router;
