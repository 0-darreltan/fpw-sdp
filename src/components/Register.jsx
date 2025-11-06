import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionUser } from "../features/users/userSlice";

const Register = ({ onRegistered }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.loading);
  const serverError = useSelector((state) => state.users.error);

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
  });

  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess(false);

    if (!form.username || !form.password || !form.name || !form.email) {
      setLocalError("Mohon isi semua field yang wajib.");
      return;
    }

    try {
      const res = await dispatch(actionUser.RegisterUser(form));
      if (res.error) {
        setLocalError(res.error.message || "Gagal mendaftar");
        return;
      }
      setSuccess(true);
      if (onRegistered) onRegistered();
    } catch (err) {
      setLocalError(err.message || "Gagal mendaftar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-black/30 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/public/Gambar/LogoAgungBetonKendari.jpeg"
            alt="Agung Beton"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PT. Agung Beton Kendari
          </h2>
          <p className="text-gray-600">Registrasi Akun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Masukkan username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Masukkan password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Masukkan email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0812xxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {localError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {localError}
            </div>
          )}

          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Registrasi berhasil. Silakan masuk.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 px-4 rounded-md font-medium transition-colors duration-200`}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;