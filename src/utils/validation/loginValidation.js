import Joi from "joi";

export const loginValidationSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "string.empty": "Username Wajib diisi.",
    "string.min": "Username harus terdiri dari minimal 3 karakter.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password Wajib diisi.",
    "string.min": "Password harus terdiri dari minimal 6 karakter.",
  }),
});
