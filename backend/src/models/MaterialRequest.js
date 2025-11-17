const mongoose = require("mongoose");

const materialRequestSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    requestReason: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["low", "normal", "high", "critical"],
      default: "normal",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unit: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
        availableStock: {
          type: Number,
          default: 0,
        },
        stockStatus: {
          type: String,
          enum: ["sufficient", "insufficient", "out_of_stock"],
          default: "sufficient",
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending_approval", "approved", "rejected", "partially_approved", "fulfilled"],
      default: "pending_approval",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const MaterialRequest = mongoose.model("MaterialRequest", materialRequestSchema);

module.exports = MaterialRequest;
