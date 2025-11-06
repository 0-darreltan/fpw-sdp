const express = require("express");
const router = express.Router();
const {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin } = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, getProduct);
router.get("/:id", authMiddleware, getProductById);
router.post("/", authMiddleware, cekAdmin, createProduct);
router.put("/:id", authMiddleware, cekAdmin, updateProduct);
router.delete("/:id", authMiddleware, cekAdmin, deleteProduct);

module.exports = router;
