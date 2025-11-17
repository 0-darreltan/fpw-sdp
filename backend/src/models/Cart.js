const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID harus diisi"],
  },
  quantity: {
    type: Number,
    required: [true, "Jumlah harus diisi"],
    min: [1, "Jumlah minimal adalah 1"],
    default: 1,
  },
});

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Keranjang harus dimiliki oleh seorang pengguna"],
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


module.exports = mongoose.model("Cart", CartSchema);