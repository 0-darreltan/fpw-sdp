import { useForm } from "react-hook-form";
import { loginValidationSchema } from "../../utils/validation/loginValidation";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { actionUser } from "../../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currUsers } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginValidationSchema),
  });

  const passwordValue = watch("password");

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await dispatch(actionUser.LoginUser(data)).unwrap();

      // Success notification
      const successToast = document.createElement("div");
      successToast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in";
      successToast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Login berhasil! Redirecting...</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);

      // Navigate based on role
      setTimeout(() => {
        if (response?.user?.role === "admin") {
          navigate("/admin");
        } else if (response?.user?.role === "project_manager") {
          navigate("/projectmanager");
        } else {
          navigate("/customer");
        }
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);

      // Error notification
      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in";
      errorToast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <span>${error?.message || "Login gagal, cek kredensial."}</span>
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements - Soft colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-blue-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <img
              src="/Gambar/LogoAgungBetonKendari.jpeg"
              alt="Agung Beton"
              className="w-20 h-20 mx-auto mb-4 object-contain rounded-full border-4 border-white shadow-xl relative z-10"
            />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
            PT. Agung Beton Kendari
          </h2>
          <p className="text-gray-600 font-medium">Sistem Manajemen Proyek</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-red-400 to-blue-400 rounded"></div>
            <div className="h-1 w-1 bg-red-400 rounded-full"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-red-400 rounded"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Username Input */}
          <div className="group">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                {...register("username")}
                placeholder="Masukkan username"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-red-100 focus:border-red-300"
                }`}
              />
            </div>
            {errors.username && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700 font-medium">
                  {errors.username.message}
                </p>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Masukkan password"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-300"
                }`}
              />
              {passwordValue && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {errors.password && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700 font-medium">
                  {errors.password.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
              ${
                isLoading
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-blue-500 text-white hover:from-red-400 hover:to-blue-400"
              }`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4.293 12.293a1 1 0 011.414 0L12 18.586l6.293-6.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
                  />
                </svg>
              )}
              Masuk
            </button>
          </div>

          {/* Footer - New Design */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Belum punya akun?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-red-500 font-semibold hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
