// controllers/checkoutController.js

const { Checkout, Order, Cart, Product, RAB, User } = require("../models");
const snap = require("../config/midtrans"); // Impor konfigurasi snap Anda
const { generateOrderNumber } = require("../utils/orderUtils"); // Helper Anda

/**
 * ✅ [LANGKAH 1] Inisiasi Pembayaran
 * Membuat sesi checkout di DB, lalu membuat transaksi Midtrans,
 * dan mengembalikan token ke frontend.
 */
const initiatePayment = async (req, res) => {
  try {
    const { orderType, rabId, deliveryAddress, shippingCost = 0, discount = 0 } = req.body;
    const userId = req.user.id; // Dari authMiddleware

    // Ambil detail user untuk Midtrans
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    let checkoutItems = [];
    
    // 1. Kumpulkan item berdasarkan tipe order (logika Anda tetap sama)
    if (orderType === "MATERIAL_PURCHASE") {
      const cart = await Cart.findOne({ user: userId }).populate("items.productId");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty." });
      }
      checkoutItems = cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        priceAtCheckout: item.productId.price,
        quantity: item.quantity,
        unit: item.productId.unit,
      }));
    } else if (orderType === "PROJECT") {
        if (!rabId) return res.status(400).json({ success: false, message: "RAB ID is required for project orders." });
        const rab = await RAB.findById(rabId).populate("items.productId");
        if (!rab) return res.status(404).json({ success: false, message: "RAB not found." });
        checkoutItems = rab.items.map((item) => ({ /* ... logika snapshot Anda ... */ }));
    } else {
      return res.status(400).json({ success: false, message: "Invalid order type." });
    }

    // 2. Hitung total (logika Anda tetap sama)
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.priceAtCheckout * item.quantity, 0);
    const total = subtotal + shippingCost - discount;

    // 3. Buat dokumen Checkout di database Anda
    const checkout = new Checkout({
      user: userId,
      items: checkoutItems,
      orderType, rabId, subtotal, shippingCost, discount, total, deliveryAddress,
    });
    await checkout.save();

    // 4. Buat parameter untuk transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: checkout._id.toString(), // PENTING: Gunakan ID unik dari DB Anda
        gross_amount: checkout.total,
      },
      item_details: checkout.items.map((item) => ({
        id: item.productId.toString(),
        price: item.priceAtCheckout,
        quantity: item.quantity,
        name: item.productName,
      })),
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone, // Pastikan user punya field phone
      },
    };

    // 5. Buat transaksi Midtrans untuk mendapatkan token
    const transaction = await snap.createTransaction(parameter);

    // 6. Kirim token dan checkoutId kembali ke client
    res.status(201).json({
      success: true,
      message: "Payment token generated successfully.",
      data: {
        token: transaction.token,
        checkoutId: checkout._id,
      },
    });

  } catch (error) {
    console.error("Payment Initiation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * ✅ [LANGKAH 2] Handle Notifikasi Webhook dari Midtrans
 * Endpoint ini HANYA akan dipanggil oleh server Midtrans.
 */
const handleMidtransNotification = async (req, res) => {
    try {
        const notificationJson = req.body;

        const statusResponse = await snap.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id; // Ini adalah checkoutId kita
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Received notification for order ${orderId}: ${transactionStatus}`);

        // Cari sesi checkout yang sesuai
        const checkout = await Checkout.findById(orderId);
        if (!checkout) {
            return res.status(404).send("Checkout session not found.");
        }

        // Jangan proses jika sudah dibayar
        if (checkout.paymentStatus === 'paid') {
            return res.status(200).send("Webhook received, but checkout already processed.");
        }

        // Logika untuk menangani status pembayaran
        if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
            if (fraudStatus == 'accept') {
                // ---- INI ADALAH LOGIKA 'confirmPaymentAndCreateOrder' ANDA ----
                // 1. Update status checkout
                checkout.paymentStatus = 'paid';
                await checkout.save();

                // 2. Buat Order baru
                const order = new Order({
                    orderNumber: generateOrderNumber(checkout.orderType),
                    checkoutId: checkout._id,
                    customerId: checkout.user,
                    orderType: checkout.orderType,
                    rabId: checkout.rabId,
                    totalAmount: checkout.total,
                    status: 'payment_confirmed',
                });
                await order.save();

                // 3. Jika dari keranjang, kosongkan
                if (checkout.orderType === 'MATERIAL_PURCHASE') {
                    await Cart.findOneAndUpdate({ user: checkout.user }, { items: [] });
                }
                // ---- AKHIR LOGIKA PEMBUATAN ORDER ----
            }
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            checkout.paymentStatus = 'failed';
            await checkout.save();
        }

        // Kirim respons 200 OK ke Midtrans agar tidak mengirim notifikasi berulang
        res.status(200).send("Notification processed successfully.");

    } catch (error) {
        console.error("Midtrans Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
  initiatePayment,
  handleMidtransNotification,
};