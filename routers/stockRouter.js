const express = require("express");
const {
  addProduct,
  addStock,
  getStocks,
  deleteStock,
  updateStock,
} = require("../controllers/stockController");
const router = express.Router();

router.route("/").post(addProduct).get(getStocks).put(updateStock);
router.route("/oneKg").post(addStock);
router.route("/demiKg").post(addStock);
router.route("/Kg").post(addStock);
router.delete("/:id", deleteStock);

module.exports = router;
