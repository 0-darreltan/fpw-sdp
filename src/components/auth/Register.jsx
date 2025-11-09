import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { actionUser } from "../../features/users/userSlice";

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username wajib diisi",
    "string.min": "Username minimal 3 karakter",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password wajib diisi",
    "string.min": "Password minimal 6 karakter",
  }),
  name: Joi.string().min(3).required().messages({
    "string.empty": "Nama wajib diisi",
    "string.min": "Nama minimal 3 karakter",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email wajib diisi",
      "string.email": "Format email tidak valid",
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\- ]{6,20}$/)
    .empty("") // anggap "" sebagai empty sehingga required() akan memicu
    .required()
    .messages({
      "string.pattern.base": "Nomor telepon tidak valid",
      "any.required": "Nomor telepon wajib diisi",
      "string.empty": "Nomor telepon wajib diisi",
    }),
});

const Register = ({ onRegistered }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.users.loading);
  const serverErrorFromStore = useSelector((state) => state.users.error);

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const res = await dispatch(actionUser.RegisterUser(data)).unwrap();
      setSuccess(true);
      if (typeof onRegistered === "function") onRegistered(res);

      navigate("/login");
    } catch (err) {
      // err may be object or string
      const msg =
        err?.message ||
        err?.data?.message ||
        err?.message?.toString() ||
        "Registrasi gagal";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-black/30 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="/Gambar/LogoAgungBetonKendari.jpeg"
            alt="Agung Beton"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PT. Agung Beton Kendari
          </h2>
          <p className="text-gray-600">Registrasi Akun</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Masukkan username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Masukkan password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              {...register("name")}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Masukkan email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              {...register("phone")}
              placeholder="0812xxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}

          {serverErrorFromStore && !serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {typeof serverErrorFromStore === "string"
                ? serverErrorFromStore
                : serverErrorFromStore?.message || "Server error"}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Registrasi berhasil. Mengarahkan ke halaman login...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-md font-medium`}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
