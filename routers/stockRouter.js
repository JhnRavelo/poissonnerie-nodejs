const express = require("express");
const {
  addProduct,
  addStock,
  getStocks,
} = require("../controllers/stockController");
const router = express.Router();

router.route("/").post(addProduct).get(getStocks);
router.route("/oneKg").post(addStock);
router.route("/demiKg").post(addStock);

module.exports = router;
