const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    // Nomor order yang user-friendly dan unik
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // HUBUNGAN UTAMA
    checkoutId: {
      type: Schema.Types.ObjectId,
      ref: "Checkout",
      required: true,
      unique: true, // Satu sesi checkout hanya bisa menghasilkan satu order
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ATRIBUT PEMBEDA (Disalin dari Checkout untuk kemudahan query)
    orderType: {
      type: String,
      enum: ["PROJECT", "MATERIAL_PURCHASE"],
      required: true,
    },

    // Referensi ke RAB jika ini adalah order project
    rabId: {
      type: Schema.Types.ObjectId,
      ref: "RAB",
      default: null,
    },

    // Data denormalisasi dari Checkout untuk akses cepat
    totalAmount: { type: Number, required: true },

    // Status logistik dan pemenuhan pesanan
    status: {
      type: String,
      enum: [
        "payment_confirmed",
        "processing",
        "shipping",
        "completed",
        "cancelled",
      ],
      default: "payment_confirmed", // Status awal saat order dibuat
    },

    // Informasi pengiriman
    shippingProvider: { type: String },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

// Index untuk query yang efisien
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderType: 1 }); // Index pada atribut pembeda

module.exports = mongoose.model("Order", OrderSchema);
