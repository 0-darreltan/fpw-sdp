const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  category: Joi.string().allow(null, ""),
  price: Joi.number().min(0).required(),
  unit: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive").default("active"),
  metadata: Joi.object().unknown(true).optional(), // fleksibel untuk field tambahan
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2),
  category: Joi.string().allow(null, ""),
  price: Joi.number().min(0),
  unit: Joi.string(),
  description: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive"),
  metadata: Joi.object().unknown(true),
}).min(1); // Minimal 1 field yang diupdate

module.exports = {
  createProductSchema,
  updateProductSchema,
};
