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
    const { orderType, rabId, deliveryAddress, shippingCost, discount } =
      req.body;
    console.log("Initiate Payment Request Body:", req.body);
    const userId = req.user.id; // Dari authMiddleware

    // Ambil detail user untuk Midtrans
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let checkoutItems = [];

    // 1. Kumpulkan item berdasarkan tipe order (logika Anda tetap sama)
    if (orderType === "MATERIAL_PURCHASE") {
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.productId"
      );
      if (!cart || cart.items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty." });
      }
      checkoutItems = cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.name,
        priceAtCheckout: item.productId.price,
        quantity: item.quantity,
        unit: item.productId.unit,
      }));

      checkoutItems.push({
        productId: null,
        productName: "Biaya Pengiriman",
        priceAtCheckout: shippingCost,
        quantity: 1,
        unit: "service",
      });
    } else if (orderType === "PROJECT") {
      if (!rabId)
        return res.status(400).json({
          success: false,
          message: "RAB ID is required for project orders.",
        });

      // Ambil RAB dan populate produk agar kita dapat snapshot harga saat ini
      const rab = await RAB.findById(rabId).populate("items.productId");
      if (!rab)
        return res
          .status(404)
          .json({ success: false, message: "RAB not found." });

      // Validasi: RAB harus memiliki minimal 1 item
      if (!rab.items || rab.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "RAB must have at least 1 item to proceed with payment.",
        });
      }

      // Validasi: RAB harus sudah di-quote dengan harga
      const hasValidItems = rab.items.some(
        (item) =>
          item.unitPrice &&
          item.unitPrice > 0 &&
          ((item.qty && item.qty > 0) || (item.quantity && item.quantity > 0))
      );

      if (!hasValidItems) {
        return res.status(400).json({
          success: false,
          message:
            "RAB must have quoted items with valid prices and quantities.",
        });
      }

      // Buat snapshot tiap item dari RAB
      checkoutItems = rab.items
        .filter((item) => {
          // Filter hanya item yang memiliki harga dan quantity
          const qty = item.qty || item.quantity || 0;
          const price = item.unitPrice || 0;
          return qty > 0 && price > 0;
        })
        .map((item) => {
          const prod = item.productId;

          // Prioritas: gunakan data dari populated product, fallback ke data RAB item
          // Untuk RAB, productId bisa jadi null/undefined jika PM input manual
          const productId = prod?._id || item.productId || null;
          const productName =
            item.materialName || item.description || prod?.name || "RAB Item";
          const unitPrice = item.unitPrice || 0;
          const quantity = item.qty || item.quantity || 0;
          const unit = item.unit || prod?.unit || "pcs";

          return {
            productId: productId, // Bisa null untuk manual items
            productName: productName,
            priceAtCheckout: unitPrice,
            quantity: quantity,
            unit: unit,
          };
        });

      // Validasi: Harus ada minimal 1 item valid setelah filter
      if (checkoutItems.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No valid items found in RAB. Items must have price and quantity.",
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order type." });
    }

    // 2. Hitung total (logika Anda tetap sama)
    const subtotal = checkoutItems.reduce(
      (sum, item) => sum + item.priceAtCheckout * item.quantity,
      0
    );
    const total = subtotal - discount;

    // 3. Buat dokumen Checkout di database Anda
    const checkout = new Checkout({
      user: userId,
      items: checkoutItems,
      orderType,
      rabId,
      subtotal,
      shippingCost,
      discount,
      total,
      deliveryAddress,
    });
    await checkout.save();

    // 3.5 Buat Order langsung setelah checkout dibuat (status: pending)
    const order = new Order({
      orderNumber: await generateOrderNumber(orderType),
      checkoutId: checkout._id,
      customerId: userId,
      orderType: orderType,
      rabId: rabId || null,
      totalAmount: total,
      status: "payment_confirmed", // Status awal saat order dibuat
    });
    await order.save();

    // 4. Buat parameter untuk transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: checkout._id.toString(), // PENTING: Gunakan ID unik dari DB Anda
        gross_amount: checkout.total,
      },
      item_details: checkout.items.map((item, index) => ({
        id: item.productId ? item.productId.toString() : `item-${index}`, // Handle null productId
        price: item.priceAtCheckout,
        quantity: item.quantity,
        name: item.productName,
      })),
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone, // Pastikan user punya field phone
      },
      callbacks: {
        finish: process.env.FRONTEND_URL || "http://localhost:5173/customer",
      },
    };

    // 5. Buat transaksi Midtrans untuk mendapatkan token
    // Pastikan: Checkout sudah tersimpan di DB sehingga kita punya checkout._id untuk order_id
    try {
      const transaction = await snap.createTransaction(parameter);

      // 6. Save snap/midtrans token info into checkout for tracing
      try {
        checkout.midtrans = {
          token: transaction.token,
          transaction,
        };
        await checkout.save();
      } catch (err) {
        console.warn("Failed to persist midtrans info on checkout:", err);
      }

      // 7. Kirim token dan checkoutId kembali ke client
      return res.status(201).json({
        success: true,
        message: "Payment token generated successfully.",
        data: {
          token: transaction.token,
          checkoutId: checkout._id,
          orderId: order._id,
          orderNumber: order.orderNumber,
        },
      });
    } catch (snapErr) {
      // Jika Midtrans gagal, kita tetap mengembalikan checkoutId sehingga client/admin
      // dapat mencoba ulang pembuatan transaksi Midtrans menggunakan checkout yang telah tersimpan.
      console.error("Midtrans transaction error:", snapErr);
      return res.status(201).json({
        success: false,
        message:
          "Checkout saved but failed to create Midtrans transaction. You can retry.",
        data: {
          checkoutId: checkout._id,
          error: snapErr.message || snapErr,
        },
      });
    }
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ [LANGKAH 2] Handle Notifikasi Webhook dari Midtrans
 * Endpoint ini HANYA akan dipanggil oleh server Midtrans.
 */
const handleMidtransNotification = async (req, res) => {
  try {
    const notificationJson = req.body;

    const statusResponse = await snap.transaction.notification(
      notificationJson
    );
    const orderId = statusResponse.order_id; // Ini adalah checkoutId kita
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `Received notification for order ${orderId}: ${transactionStatus}`
    );

    // Cari sesi checkout yang sesuai
    const checkout = await Checkout.findById(orderId);
    if (!checkout) {
      return res.status(404).send("Checkout session not found.");
    }

    // Jangan proses jika sudah dibayar
    if (checkout.paymentStatus === "paid") {
      return res
        .status(200)
        .send("Webhook received, but checkout already processed.");
    }

    // Logika untuk menangani status pembayaran
    if (transactionStatus == "capture" || transactionStatus == "settlement") {
      if (fraudStatus == "accept") {
        // 1. Update status checkout
        checkout.paymentStatus = "paid";
        await checkout.save();

        // 2. Update Order yang sudah ada (jangan buat baru)
        const existingOrder = await Order.findOne({ checkoutId: checkout._id });
        if (existingOrder) {
          existingOrder.status = "payment_confirmed";
          await existingOrder.save();
        } else {
          // Fallback: jika order belum ada (seharusnya tidak terjadi)
          const order = new Order({
            orderNumber: Number(checkout.orderType),
            checkoutId: checkout._id,
            customerId: checkout.user,
            orderType: checkout.orderType,
            rabId: checkout.rabId,
            totalAmount: checkout.total,
            status: "payment_confirmed",
          });
          await order.save();
        }

        // 3. Jika dari keranjang, kosongkan
        if (checkout.orderType === "MATERIAL_PURCHASE") {
          await Cart.findOneAndUpdate({ user: checkout.user }, { items: [] });
        }
      }
    } else if (transactionStatus == "pending") {
      // Handle pending payment
      checkout.paymentStatus = "pending";
      await checkout.save();

      // Update order status to pending
      const existingOrder = await Order.findOne({ checkoutId: checkout._id });
      if (existingOrder) {
        existingOrder.status = "pending";
        await existingOrder.save();
      }
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      checkout.paymentStatus = "failed";
      await checkout.save();

      // Update order status jika ada
      const existingOrder = await Order.findOne({ checkoutId: checkout._id });
      if (existingOrder) {
        existingOrder.status = "cancelled";
        await existingOrder.save();
      }
    }

    // Kirim respons 200 OK ke Midtrans agar tidak mengirim notifikasi berulang
    return res.status(200).send("Notification processed successfully.");
  } catch (error) {
    console.error("Midtrans Webhook Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * ✅ Get Checkout History
 * Mengambil riwayat checkout user yang sudah login
 */
const getCheckoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const checkouts = await Checkout.find({ user: userId })
      .populate("rabId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: checkouts,
    });
  } catch (error) {
    console.error("Get Checkout History Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Update Checkout Status
 * Update status pembayaran checkout dari frontend setelah callback Midtrans
 */
const updateCheckoutStatus = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { status, transactionId } = req.body;
    const userId = req.user.id;

    // Validasi status yang diperbolehkan
    const allowedStatuses = ["pending", "paid", "failed", "expired"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    // Cari checkout milik user
    const checkout = await Checkout.findOne({
      _id: checkoutId,
      user: userId,
    });

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found or unauthorized.",
      });
    }

    // Jika status sudah paid, jangan update lagi (prevent double processing)
    if (checkout.paymentStatus === "paid" && status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot update paid checkout to other status.",
      });
    }

    // Update status
    checkout.paymentStatus = status;
    if (transactionId) {
      checkout.midtrans = {
        ...checkout.midtrans,
        transactionId,
      };
    }
    await checkout.save();

    // Jika status = paid, update order yang sudah ada
    if (status === "paid") {
      // Check jika order sudah ada
      const existingOrder = await Order.findOne({ checkoutId: checkout._id });

      if (existingOrder) {
        // Update status order yang sudah ada
        existingOrder.status = "payment_confirmed";
        await existingOrder.save();
      } else {
        // Fallback: buat order baru jika belum ada (seharusnya sudah dibuat saat checkout)
        const order = new Order({
          orderNumber: await generateOrderNumber(checkout.orderType),
          checkoutId: checkout._id,
          customerId: checkout.user,
          orderType: checkout.orderType,
          rabId: checkout.rabId,
          totalAmount: checkout.total,
          status: "payment_confirmed",
        });
        await order.save();
      }

      // Kosongkan cart jika MATERIAL_PURCHASE
      if (checkout.orderType === "MATERIAL_PURCHASE") {
        await Cart.findOneAndUpdate({ user: checkout.user }, { items: [] });
      }
    } else if (status === "pending") {
      // Update status order saat pembayaran pending
      const existingOrder = await Order.findOne({ checkoutId: checkout._id });
      if (existingOrder) {
        existingOrder.status = "pending";
        await existingOrder.save();
      }
    } else if (status === "failed" || status === "expired") {
      // Update status order jika pembayaran gagal
      const existingOrder = await Order.findOne({ checkoutId: checkout._id });
      if (existingOrder) {
        existingOrder.status = "cancelled";
        await existingOrder.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Checkout status updated successfully.",
      data: checkout,
    });
  } catch (error) {
    console.error("Update Checkout Status Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Update Delivery Status
 * Update status pengiriman checkout secara otomatis ke status berikutnya
 * belum dikirim → sedang dikirim → sudah sampai
 */
const updateDeliveryStatus = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    // Cari checkout
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found.",
      });
    }

    // Validasi: Hanya checkout yang sudah dibayar yang bisa diupdate delivery statusnya
    if (checkout.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Cannot update delivery status for unpaid checkout.",
      });
    }

    // Tentukan status berikutnya secara otomatis
    let newDeliveryStatus;
    let message;

    switch (checkout.delivery) {
      case "belum dikirim":
        newDeliveryStatus = "sedang dikirim";
        message = "Status delivery updated to 'sedang dikirim'.";
        break;
      case "sedang dikirim":
        newDeliveryStatus = "sudah sampai";
        message = "Status delivery updated to 'sudah sampai'.";
        break;
      case "sudah sampai":
        return res.status(400).json({
          success: false,
          message: "Delivery already completed. Cannot update further.",
        });
      default:
        newDeliveryStatus = "belum dikirim";
        message = "Status delivery reset to 'belum dikirim'.";
    }

    // Update status delivery
    checkout.delivery = newDeliveryStatus;
    await checkout.save();

    // Update order status jika barang sudah sampai
    const order = await Order.findOne({ checkoutId: checkout._id });
    if (order && newDeliveryStatus === "sudah sampai") {
      order.status = "delivered";
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: message,
      data: {
        checkoutId: checkout._id,
        previousStatus: checkout.delivery === "sudah sampai" ? "sedang dikirim" : checkout.delivery === "sedang dikirim" ? "belum dikirim" : null,
        currentStatus: newDeliveryStatus,
      },
    });
  } catch (error) {
    console.error("Update Delivery Status Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  initiatePayment,
  handleMidtransNotification,
  getCheckoutHistory,
  updateCheckoutStatus,
  updateDeliveryStatus,
};