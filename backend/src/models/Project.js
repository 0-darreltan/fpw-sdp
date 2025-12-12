const mongoose = require('mongoose');

const ProgressHistorySchema = new mongoose.Schema({
  progress: { type: Number, default: 0 },
  materialUsed: { type: String },
  notes: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedByName: { type: String },
  updatedAt: { type: Date, default: Date.now }
}, { _id: true });

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String },
    location: { type: String },
    locationDetails: {
      street: { type: String },
      kelurahan: { type: String },
      kecamatan: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Indonesia" },
    },
    description: { type: String },
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number },
    progress: { type: Number, default: 0 },
    progressHistory: [ProgressHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
