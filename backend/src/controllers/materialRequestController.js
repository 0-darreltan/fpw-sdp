const { MaterialRequest, Product, ActivityLog } = require("../models");
const Joi = require("joi");

// Validation schemas
const createMaterialRequestSchema = Joi.object({
  projectId: Joi.string().required(),
  projectName: Joi.string().required(),
  requestReason: Joi.string().required(),
  urgencyLevel: Joi.string()
    .valid("low", "normal", "high", "critical")
    .default("normal"),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().min(1).required(), // At least 1
        unit: Joi.string().required(),
        price: Joi.number().min(0).required(),
        subtotal: Joi.number().min(0).required(),
        notes: Joi.string().allow("").optional(),
      })
    )
    .min(1)
    .required(),
  total: Joi.number().min(0).required(),
});

const updateMaterialRequestSchema = Joi.object({
  status: Joi.string()
    .valid("pending_approval", "approved", "rejected", "partially_approved", "fulfilled")
    .optional(),
  adminNotes: Joi.string().allow("").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().min(0).required(),
        unit: Joi.string().required(),
        price: Joi.number().min(0).required(),
        subtotal: Joi.number().min(0).required(),
        notes: Joi.string().allow("").optional(),
        availableStock: Joi.number().min(0).optional(),
        stockStatus: Joi.string()
          .valid("sufficient", "insufficient", "out_of_stock")
          .optional(),
      })
    )
    .optional(),
});

// Get all material requests
const getMaterialRequests = async (req, res) => {
  try {
    const { status, urgencyLevel, projectId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    if (projectId) query.projectId = projectId;

    const requests = await MaterialRequest.find(query)
      .populate("projectId", "name location status")
      .populate("requesterId", "name email role")
      .populate("approvedBy", "name email")
      .populate("items.productId", "name price unit stock")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get material request by ID
const getMaterialRequestById = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id)
      .populate("projectId", "name location status")
      .populate("requesterId", "name email role")
      .populate("approvedBy", "name email")
      .populate("items.productId", "name price unit stock");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Material request not found" });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new material request
const createMaterialRequest = async (req, res) => {
  try {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("User from req.user:", req.user);
    
    const { error } = createMaterialRequestSchema.validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { items } = req.body;

    // Check stock availability for each item
    const itemsWithStockCheck = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productName} not found`);
        }

        const availableStock = product.stock || 0;
        let stockStatus = "sufficient";

        if (availableStock === 0) {
          stockStatus = "out_of_stock";
        } else if (availableStock < item.quantity) {
          stockStatus = "insufficient";
        }

        return {
          ...item,
          availableStock,
          stockStatus,
        };
      })
    );

    const materialRequest = new MaterialRequest({
      ...req.body,
      requesterId: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      items: itemsWithStockCheck,
    });

    await materialRequest.save();

    const populatedRequest = await MaterialRequest.findById(materialRequest._id)
      .populate("projectId", "name location status")
      .populate("requesterId", "name email role")
      .populate("items.productId", "name price unit stock");

    res.status(201).json({
      success: true,
      message: "Material request created successfully",
      data: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update material request (approve/reject by admin)
const updateMaterialRequest = async (req, res) => {
  try {
    const { error } = updateMaterialRequestSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const request = await MaterialRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Material request not found" });
    }

    // If status is being changed to approved, record who approved it
    if (req.body.status === "approved" || req.body.status === "partially_approved") {
      req.body.approvedBy = req.user._id;
      req.body.approvedAt = new Date();

      // Deduct stock for approved items
      const itemsToProcess = req.body.items && req.body.items.length > 0 
        ? req.body.items 
        : request.items;

      const stockChanges = [];

      for (const item of itemsToProcess) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.productName} not found`,
          });
        }

        // Check if there's enough stock
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.productName}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }

        const previousStock = product.stock;
        const newStock = previousStock - item.quantity;

        // Deduct stock
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });

        stockChanges.push({
          productName: item.productName,
          quantity: item.quantity,
          previousStock,
          newStock,
        });
      }

      // Create activity log for material request approval
      const activityDescription = stockChanges
        .map(
          (change) =>
            `${change.productName}: ${change.quantity} unit (Stok: ${change.previousStock} → ${change.newStock})`
        )
        .join(", ");

      await ActivityLog.create({
        type: "material_request_approved",
        title: `Permintaan Material Disetujui`,
        description: `Admin ${req.user.name} menyetujui permintaan material untuk proyek "${request.projectName}". Material yang disetujui: ${activityDescription}`,
        userId: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        materialRequestId: request._id,
        icon: "✅",
        metadata: {
          projectName: request.projectName,
          stockChanges,
          totalItems: stockChanges.length,
        },
      });
    } else if (req.body.status === "rejected") {
      // Create activity log for rejection
      await ActivityLog.create({
        type: "material_request_rejected",
        title: `Permintaan Material Ditolak`,
        description: `Admin ${req.user.name} menolak permintaan material untuk proyek "${request.projectName}". Alasan: ${req.body.adminNotes || "Tidak disebutkan"}`,
        userId: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        materialRequestId: request._id,
        icon: "❌",
        metadata: {
          projectName: request.projectName,
          adminNotes: req.body.adminNotes,
        },
      });
    }

    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("projectId", "name location status")
      .populate("requesterId", "name email role")
      .populate("approvedBy", "name email")
      .populate("items.productId", "name price unit stock");

    res.status(200).json({
      success: true,
      message: "Material request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete material request
const deleteMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Material request not found" });
    }

    // Only allow deletion if still pending
    if (request.status !== "pending_approval") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete request that has been processed",
      });
    }

    await MaterialRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Material request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMaterialRequests,
  getMaterialRequestById,
  createMaterialRequest,
  updateMaterialRequest,
  deleteMaterialRequest,
};
