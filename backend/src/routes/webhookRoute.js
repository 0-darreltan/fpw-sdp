const express = require("express");
const router = express.Router();
const crypto = require("crypto");
require("dotenv").config();

router.post("/midtrans-notification", async (req, res) => {
  const body = req.body;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  // verifikasi signature
  const expected = crypto
    .createHash("sha512")
    .update(body.order_id + body.status_code + body.gross_amount + serverKey)
    .digest("hex");

  if (expected !== body.signature_key) {
    return res.status(403).send("Invalid signature");
  }

  // update status order di database
  console.log("Payment status:", body.transaction_status);

  return res.status(200).json({ message: "ok" });
});

module.exports = router;
