const mongoose = require("mongoose");
const { Schema } = mongoose;

// Item dengan snapshot data produk untuk menjaga integritas historis
const CheckoutItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: false }, // Not required for RAB manual items
  productName: { type: String, required: true }, // Snapshot nama
  priceAtCheckout: { type: Number, required: true }, // Snapshot harga
  quantity: { type: Number, required: true },
  unit: { type: String },
});

// Skema alamat yang terstruktur
const AddressSchema = new Schema(
  {
    houseNumber: { type: String },
    street: { type: String, required: true },
    rt: { type: String },
    rw: { type: String },
    kelurahan: { type: String },
    kecamatan: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Indonesia" },
  },
  { _id: false }
);

// Method untuk format alamat lengkap
AddressSchema.methods.getFullAddress = function () {
  const parts = [];

  if (this.houseNumber) parts.push(`No. ${this.houseNumber}`);
  parts.push(this.street);

  const rtRw = [];
  if (this.rt) rtRw.push(`RT ${this.rt}`);
  if (this.rw) rtRw.push(`RW ${this.rw}`);
  if (rtRw.length > 0) parts.push(rtRw.join("/"));

  if (this.kelurahan) parts.push(`Kel. ${this.kelurahan}`);
  if (this.kecamatan) parts.push(`Kec. ${this.kecamatan}`);
  parts.push(this.city);
  parts.push(this.province);
  if (this.postalCode) parts.push(this.postalCode);
  parts.push(this.country);

  return parts.join(", ");
};

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
    // Status delivery untuk material purchase
    delivery: {
      type: String,
      enum: ["belum dikirim", "sedang dikirim", "sudah sampai"],
      default: "belum dikirim",
    },
    // Optional storage for Midtrans/Snap transaction metadata
    midtrans: {
      token: { type: String },
      transaction: { type: Schema.Types.Mixed },
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

// Validasi kustom: Field delivery hanya relevan untuk MATERIAL_PURCHASE
CheckoutSchema.path("delivery").validate(function (value) {
  if (this.orderType === "PROJECT" && value !== "belum dikirim") {
    return false; // Untuk PROJECT, delivery harus default
  }
  return true;
}, "Delivery status is only applicable for MATERIAL_PURCHASE orders.");

module.exports = mongoose.model("Checkout", CheckoutSchema);
