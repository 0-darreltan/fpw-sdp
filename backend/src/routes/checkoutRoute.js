const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleMidtransNotification,
} = require("../controllers/checkoutController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route untuk klien/frontend untuk memulai pembayaran
// Klien harus login untuk melakukan ini
router.post("/initiate", authMiddleware, initiatePayment);

// Route untuk webhook dari Midtrans
// TIDAK memerlukan authMiddleware karena ini adalah komunikasi server-to-server
router.post("/notification", handleMidtransNotification);

module.exports = router;
