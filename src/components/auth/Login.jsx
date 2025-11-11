import { useForm } from "react-hook-form";
import { loginValidationSchema } from "../../utils/validation/loginValidation";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { actionUser } from "../../features/users/userSlice";
import { useNavigate } from "react-router";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currUsers } = useSelector((state) => state.users);

  console.log(currUsers);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginValidationSchema),
  });

  const handleLogin = async (data) => {
    try {
      console.log(data);

      const response = await dispatch(actionUser.LoginUser(data)).unwrap();

      console.log("Login response:", response);
      console.log("User role:", response?.user?.role);

      // ✅ Gunakan response.user.role, bukan currUsers
      if (response?.user?.role === "admin") {
        navigate("/admin");
      } else if (response?.user?.role === "project_manager") {
        navigate("/projectmanager");
      } else {
        navigate("/customer");
      }
      alert("login Berhasil");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error?.message || "Login gagal, cek kredensial.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-black/30 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/Gambar/LogoAgungBetonKendari.jpeg"
            alt="Agung Beton"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PT. Agung Beton Kendari
          </h2>
          <p className="text-gray-600">Sistem Manajemen Proyek</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-xl font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="Masukkan username"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            {errors.username && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 p-3 rounded-md border border-red-200">
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

          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Masukkan password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            {errors.password && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 p-3 rounded-md border border-red-200">
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
                  {errors.password.message}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <div>
          <p className="mt-6 text-center ">Belum punya akun? Daftar Sekarang</p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </button>
          </div>
        </div>

        {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Demo Accounts:</h4>
          <div className="space-y-2 text-sm">
            <div className="text-gray-700">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="text-gray-700">
              <strong>Customer:</strong> customer1 / customer123
            </div>
            <div className="text-gray-700">
              <strong>Project Manager:</strong> pm1 / pm123
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
