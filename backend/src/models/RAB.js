const mongoose = require('mongoose');

const RABItemSchema = new mongoose.Schema({
  description: String,
  unit: String,
  qty: Number,
  unitPrice: Number
});

const RABSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    title: String,
    items: [RABItemSchema],
    totalEstimated: Number,
    status: { type: String, default: 'submitted' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RAB', RABSchema);
