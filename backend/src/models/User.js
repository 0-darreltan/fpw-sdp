const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // store hashed password
    role: {
      type: String,
      enum: ["admin", "project_manager", "customer"],
      default: "customer",
    },
    name: { type: String },
    email: { type: String, unique: true, index: true },
    access_token: { type: String },
    refresh_token: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
