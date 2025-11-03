const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String },
    location: { type: String },
    description: { type: String },
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
