const express = require("express");
const router = express.Router();
const {
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const { cekProjectManager, cekAdmin } = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getOrder);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, cekProjectManager, createOrder);
router.put("/:id", authMiddleware, cekProjectManager, updateOrder);
router.delete("/:id", authMiddleware, cekAdmin, deleteOrder);

module.exports = router;
