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
  progress: Joi.number().min(0).max(100).default(0).optional(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).allow(""),
  location: Joi.string().allow("", null),
  locationDetails: locationDetailsSchema.optional(),
  description: Joi.string().allow("", null),
  projectManagerId: Joi.string().allow("", null),
  status: Joi.string().valid(
    "planned",
    "in-progress",
    "completed",
    "cancelled"
  ),
  startDate: Joi.date().allow("", null),
  endDate: Joi.date().allow("", null),
  budget: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().allow("", null)
  ),
  progress: Joi.alternatives().try(
    Joi.number().min(0).max(100),
    Joi.string().allow("", null)
  ).optional(),
  progressHistory: Joi.array().optional(),
})
  .min(1) // minimal 1 field diupdate
  .unknown(false); // tidak mengizinkan field yang tidak terdefinisi

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
