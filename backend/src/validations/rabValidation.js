const Joi = require("joi");

// Schema untuk tiap item dalam RAB
const rabItemSchema = Joi.object({
  // Product reference (optional)
  productId: Joi.string().allow("", null).optional(),
  
  // Support both old and new field names - allow empty strings
  materialName: Joi.string().allow("", null).optional(),
  description: Joi.string().allow("", null).optional(),
  quantity: Joi.number().min(0).optional(),
  
  // Legacy fields
  unit: Joi.string().allow("", null).optional(),
  qty: Joi.number().min(0).optional(),
  unitPrice: Joi.number().min(0).optional(),
});

// Validasi untuk membuat RAB baru
const createRABSchema = Joi.object({
  customerId: Joi.string().required(),
  projectId: Joi.string().required(),
  title: Joi.string().min(2).required(),
  items: Joi.array().items(rabItemSchema).min(1).required(),
  status: Joi.string().valid("submitted", "approved", "rejected"),
});

// Validasi untuk mengupdate RAB
const updateRABSchema = Joi.object({
  title: Joi.string().min(2),
  items: Joi.array().items(rabItemSchema),
  status: Joi.string().valid("submitted", "approved", "rejected"),
}).min(1);

module.exports = {
  createRABSchema,
  updateRABSchema,
};
