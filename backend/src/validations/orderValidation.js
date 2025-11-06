const Joi = require("joi");

// Schema untuk item order
const orderItemSchema = Joi.object({
  productId: Joi.string().required(),
  qty: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
  unit: Joi.string().required(),
});

// Create Order Validation
const createOrderSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  deliveryAddress: Joi.string().required(),
});

// Update Order Validation
const updateOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema),
  status: Joi.string().valid("pending", "processing", "completed", "cancelled"),
  deliveryAddress: Joi.string(),
}).min(1); // Harus ada minimal satu field yang diupdate

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
