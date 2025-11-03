const mongoose = require('mongoose');

const ProposalItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  description: String,
  qty: Number,
  price: Number
});

const ProposalSchema = new mongoose.Schema(
  {
    rabId: { type: mongoose.Schema.Types.ObjectId, ref: 'RAB' },
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [ProposalItemSchema],
    total: Number,
    status: { type: String, default: 'draft' },
    sentAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', ProposalSchema);
