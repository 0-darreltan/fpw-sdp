const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number },
    unit: { type: String },
    stock: { type: Number },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
