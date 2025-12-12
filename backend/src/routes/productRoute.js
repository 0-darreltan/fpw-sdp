const express = require("express");
const router = express.Router();
const {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryReport,
  getLowStockReport,
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin } = require("../middlewares/roleMiddleware");

// Public routes - no authentication required for viewing products
router.get("/", getProduct);
router.get("/inventory-report", authMiddleware, cekAdmin, getInventoryReport);
router.get("/low-stock-report", authMiddleware, cekAdmin, getLowStockReport);
router.get("/:id", getProductById);

// Protected routes - require admin authentication
router.post("/", authMiddleware, cekAdmin, createProduct);
router.put("/:id", authMiddleware, cekAdmin, updateProduct);
router.delete("/:id", authMiddleware, cekAdmin, deleteProduct);

module.exports = router;
