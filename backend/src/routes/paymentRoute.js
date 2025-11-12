const express = require('express')
const router = express.Router();
const snap = require("../config/midtrans");


router.post("/create-transaction", async (req, res) => {
  try {
    const { orderId, grossAmount } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
