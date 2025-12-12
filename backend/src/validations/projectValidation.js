const Joi = require("joi");

const locationDetailsSchema = Joi.object({
  street: Joi.string().allow("", null),
  kelurahan: Joi.string().allow("", null),
  kecamatan: Joi.string().allow("", null),
  city: Joi.string().allow("", null),
  province: Joi.string().allow("", null),
  postalCode: Joi.string().allow("", null),
  country: Joi.string().allow("", null).default("Indonesia"),
});

const createProjectSchema = Joi.object({
  name: Joi.string().min(2).required(),
  location: Joi.string().allow("", null),
  locationDetails: locationDetailsSchema.optional(),
  description: Joi.string().allow("", null),
  projectManagerId: Joi.string().required(),
  status: Joi.string()
    .valid("planned", "in-progress", "completed", "cancelled")
    .default("planned"),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  budget: Joi.number().min(0).optional(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(2),
  location: Joi.string().allow("", null),
  locationDetails: locationDetailsSchema.optional(),
  description: Joi.string().allow("", null),
  projectManagerId: Joi.string(),
  status: Joi.string().valid(
    "planned",
    "in-progress",
    "completed",
    "cancelled"
  ),
  startDate: Joi.date(),
  endDate: Joi.date(),
  budget: Joi.number().min(0),
}).min(1); // minimal 1 field diupdate

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
