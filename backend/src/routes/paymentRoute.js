const express = require('express')
const router = express.Router();
const snap = require("../config/midtrans");


router.post("/create-transaction", async (req, res) => {
    try {
      const { orderId, grossAmount, customer, items } = req.body;

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        item_details: items?.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.qty,
          name: item.name,
        })),
        customer_details: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      console.log(transaction);

      return res.status(201).json({ token: transaction.token });
    } catch (error) {
      console.error("Midtrans Error:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
});

module.exports = router;
