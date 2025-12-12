const express = require("express");
const router = express.Router();
const {
  getOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getSalesReport,
  getMyOrders,
  getOutgoingInventoryReport,
  getCustomerLoyaltyReport,
  getProfitReport,
  getTrendAnalysisReport,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  cekProjectManager,
  cekAdmin,
} = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, getOrder);
router.get("/sales-report", authMiddleware, cekAdmin, getSalesReport);
router.get(
  "/outgoing-inventory",
  authMiddleware,
  cekAdmin,
  getOutgoingInventoryReport
);
router.get(
  "/customer-loyalty",
  authMiddleware,
  cekAdmin,
  getCustomerLoyaltyReport
);
router.get("/profit-report", authMiddleware, cekAdmin, getProfitReport);
router.get("/trend-analysis", authMiddleware, cekAdmin, getTrendAnalysisReport);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, cekProjectManager, createOrder);
router.put("/:id", authMiddleware, cekProjectManager, updateOrder);
router.delete("/:id", authMiddleware, cekAdmin, deleteOrder);

module.exports = router;
