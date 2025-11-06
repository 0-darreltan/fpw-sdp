const Joi = require("joi");

// Register validation
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("Customer", "Project Manager", "Administrator")
    .required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Update user validation
const updateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  password: Joi.string().min(6),
  role: Joi.string().valid("Customer", "Project Manager", "Administrator"),
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
});

module.exports = { registerSchema, loginSchema, updateSchema };
