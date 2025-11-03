const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // store hashed password
    role: { type: String, enum: ['admin', 'customer', 'project_manager'], required: true },
    name: { type: String },
    email: { type: String, unique: true, index: true },
    phone: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
