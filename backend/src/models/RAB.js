const mongoose = require('mongoose');

const RABItemSchema = new mongoose.Schema({
  // Product reference (optional, untuk link ke product master)
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  
  // Fields untuk material request dari customer
  materialName: String,
  quantity: Number,
  
  // Fields untuk RAB quotation dari PM
  description: String,
  unit: String,
  qty: Number,
  unitPrice: Number
});

const RABSchema = new mongoose.Schema(
  {
    // Customer yang mengajukan request
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    
    // Project Manager yang menangani
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectManagerName: { type: String },
    
    // Project terkait (optional, bisa diisi nanti oleh PM)
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    
    // Request dari customer
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    estimatedBudget: { type: Number },
    expectedStartDate: { type: Date },
    
    // Response dari PM (RAB items)
    items: [RABItemSchema],
    totalEstimated: { type: Number, default: 0 },
    
    // Status workflow
    status: { 
      type: String, 
      enum: [
        'pending',           // Customer baru submit, menunggu PM review
        'reviewed',          // PM sudah review, sedang buat RAB
        'quoted',            // PM sudah kirim penawaran RAB
        'accepted',          // Customer terima penawaran
        'rejected',          // Customer tolak penawaran
        'rejected_by_pm',    // PM tolak permintaan RAB
        'revised'            // Customer minta revisi
      ],
      default: 'pending' 
    },
    
    // Notes
    customerNotes: { type: String },
    pmNotes: { type: String },
    
    // Timeline
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    quotedAt: { type: Date },
    respondedAt: { type: Date }
  },
  { timestamps: true }
);

// Index untuk query yang lebih cepat
RABSchema.index({ customerId: 1, status: 1 });
RABSchema.index({ projectManagerId: 1, status: 1 });
RABSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('RAB', RABSchema);
