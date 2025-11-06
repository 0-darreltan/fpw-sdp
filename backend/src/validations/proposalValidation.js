const Joi = require("joi");

const proposalItemSchema = Joi.object({
  productId: Joi.string().required(),
  description: Joi.string().allow("", null),
  qty: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
});

const createProposalSchema = Joi.object({
  rabId: Joi.string().required(),
  projectManagerId: Joi.string().required(),
  customerId: Joi.string().required(),
  items: Joi.array().items(proposalItemSchema).min(1).required(),
  status: Joi.string().valid("draft", "submitted", "approved", "rejected"),
  sentAt: Joi.date().optional(),
});

const updateProposalSchema = Joi.object({
  items: Joi.array().items(proposalItemSchema),
  status: Joi.string().valid("draft", "submitted", "approved", "rejected"),
  sentAt: Joi.date(),
}).min(1);

module.exports = {
  createProposalSchema,
  updateProposalSchema,
};
