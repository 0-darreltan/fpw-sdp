const express = require("express");
const router = express.Router();
const {
  getCart,
  upsertItemInCart,
  deleteItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middlewares/authMiddleware");

// Get keranjang user yang login
router.get("/", authMiddleware, getCart);

// Tambah/Update item di keranjang
router.post("/", authMiddleware, upsertItemInCart);

// Hapus satu item dari keranjang
router.delete("/:productId", authMiddleware, deleteItemFromCart);

// Kosongkan keranjang
router.delete("/clear/all", authMiddleware, clearCart);

module.exports = router;
