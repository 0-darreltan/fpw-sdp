const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleMidtransNotification,
  getCheckoutHistory,
  updateCheckoutStatus,
} = require("../controllers/checkoutController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route untuk klien/frontend untuk memulai pembayaran
// Klien harus login untuk melakukan ini
router.post("/initiate", authMiddleware, initiatePayment);

// Route untuk mendapatkan riwayat checkout user
router.get("/history", authMiddleware, getCheckoutHistory);

// Route untuk update status checkout dari frontend (setelah callback Midtrans)
router.patch("/status/:checkoutId", authMiddleware, updateCheckoutStatus);

// Route untuk webhook dari Midtrans
// TIDAK memerlukan authMiddleware karena ini adalah komunikasi server-to-server
router.post("/notification", handleMidtransNotification);

module.exports = router;
