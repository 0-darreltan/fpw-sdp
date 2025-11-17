const mongoose = require("mongoose");
const { Schema } = mongoose;

// Item dengan snapshot data produk untuk menjaga integritas historis
const CheckoutItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true }, // Snapshot nama
  priceAtCheckout: { type: Number, required: true }, // Snapshot harga
  quantity: { type: Number, required: true },
  unit: { type: String },
});

// Skema alamat yang terstruktur
const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Indonesia" },
  },
  { _id: false }
);

const CheckoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CheckoutItemSchema],

    // ATRIBUT PEMBEDA UTAMA
    orderType: {
      type: String,
      enum: ["PROJECT", "MATERIAL_PURCHASE"], // Tipe Project atau Beli Material Biasa
      required: true,
    },

    // Hanya ada jika orderType adalah 'PROJECT'
    rabId: {
      type: Schema.Types.ObjectId,
      ref: "RAB",
      default: null,
    },

    // Rincian Kalkulasi
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Info Pengiriman & Pembayaran
    deliveryAddress: { type: AddressSchema, required: true },
    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Validasi kustom: Jika orderType adalah PROJECT, maka rabId wajib diisi.
CheckoutSchema.path("rabId").validate(function (value) {
  if (this.orderType === "PROJECT") {
    return value != null; // Wajib ada jika tipe-nya PROJECT
  }
  return true; // Boleh null jika tipe-nya bukan PROJECT
}, "RAB ID is required for PROJECT type orders.");

module.exports = mongoose.model("Checkout", CheckoutSchema);
