const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "material_request_approved",
        "material_request_rejected",
        "project_created",
        "stock_reduced",
        "product_created",
        "product_updated",
        "user_registered",
        "order_created",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Untuk material request approval
    materialRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialRequest",
    },
    // Untuk project creation
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    // Untuk stock reduction
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    icon: {
      type: String,
      default: "📝",
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query yang lebih cepat
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
