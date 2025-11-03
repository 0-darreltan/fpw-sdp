const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: { type: Number },
  price: { type: Number },
  unit: { type: String }
});

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number },
    status: { type: String, default: 'pending' },
    deliveryAddress: { type: String }
  },
  { timestamps: true }
);

OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
