import Joi from "joi";

export const registerValidationSchema = Joi.object({
  namaLengkap: Joi.string().min(3).required().messages({
    "string.empty": "Nama lengkap wajib diisi.",
    "string.min": "Nama lengkap harus terdiri dari minimal 3 karakter.",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email wajib diisi.",
    "string.email": "Format email tidak valid.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,13}$/)
    .required()
    .messages({
      "string.empty": "Nomor telepon wajib diisi.",
      "string.pattern.base":
        "Nomor telepon harus terdiri dari 10-13 digit angka.",
    }),

  username: Joi.string().min(3).required().messages({
    "string.empty": "Username wajib diisi.",
    "string.min": "Username harus terdiri dari minimal 3 karakter.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password wajib diisi.",
    "string.min": "Password harus terdiri dari minimal 6 karakter.",
  }),
});
