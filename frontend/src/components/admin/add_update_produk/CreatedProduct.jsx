import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { actionProduct } from "../../../features/product/productSlice";

// Joi Validation Schema
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Nama produk wajib diisi",
    "string.min": "Nama produk minimal 3 karakter",
    "string.max": "Nama produk maksimal 100 karakter",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Kategori wajib dipilih",
  }),
  unit: Joi.string().required().messages({
    "string.empty": "Satuan wajib dipilih",
  }),
  unitOther: Joi.string().allow("").optional(),
  price: Joi.number().min(0).required().messages({
    "number.base": "Harga harus berupa angka",
    "number.min": "Harga tidak boleh negatif",
    "any.required": "Harga wajib diisi",
  }),
  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Deskripsi maksimal 500 karakter",
  }),
  status: Joi.string().valid("active", "inactive").default("active"),
});

const CreatedProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const units = ["pcs", "kg", "m3", "unit", "liter", "m", "set"];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: joiResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      unitOther: "",
      price: "",
      description: "",
      status: "active",
    },
  });

  const selectedUnit = watch("unit");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Validasi unit lainnya
    if (data.unit === "other" && !data.unitOther) {
      setError("unitOther", {
        type: "manual",
        message: "Harap isi satuan lainnya",
      });
      setIsSubmitting(false);
      return;
    }

    const productData = {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price) || 0,
      stock: 0, // Default stock 0, will be managed in Material Management
      unit: data.unit === "other" ? data.unitOther : data.unit,
      description: data.description || "",
      status: data.status || "active",
    };

    console.log("📤 Creating product:", productData);

    try {
      await dispatch(actionProduct.createProduct(productData)).unwrap();

      // ✅ Show success message
      setShowSuccess(true);
      reset();

      // Navigate after 2 seconds
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      console.error("❌ Error creating product:", err);

      // ✅ Handle different error types
      let errorMessage = "Terjadi kesalahan saat menyimpan produk";

      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const serverMessage = err.response.data?.message;

        switch (status) {
          case 400:
            errorMessage = serverMessage || "Data produk tidak valid";
            break;
          case 401:
            errorMessage = "Sesi Anda telah berakhir. Silakan login kembali";
            setTimeout(() => navigate("/login"), 2000);
            break;
          case 403:
            errorMessage = "Anda tidak memiliki izin untuk menambah produk";
            break;
          case 409:
            errorMessage = "Produk dengan nama yang sama sudah ada";
            break;
          case 500:
            errorMessage = "Terjadi kesalahan pada server. Coba lagi nanti";
            break;
          default:
            errorMessage = serverMessage || errorMessage;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda";
      } else if (err.message) {
        // Something else happened
        errorMessage = err.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm("Apakah Anda yakin ingin membatalkan? Data akan hilang.")
    ) {
      reset();
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Daftar Produk
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="mt-2 text-gray-600">
            Isi form di bawah untuk menambahkan produk/jasa baru
          </p>
        </div>

        {/* ✅ Success Alert */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Produk berhasil ditambahkan!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Anda akan dialihkan ke halaman produk...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Error Alert */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Gagal menyimpan produk
                </h3>
                <p className="mt-1 text-sm text-red-700">{submitError}</p>
              </div>
              <button
                onClick={() => setSubmitError(null)}
                className="ml-3 text-red-400 hover:text-red-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Produk & Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Contoh: Jasa Pengecatan Dinding"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Jasa Konstruksi">Jasa Konstruksi</option>
                  <option value="Jasa Renovasi">Jasa Renovasi</option>
                  <option value="Jasa Pemasangan">Jasa Pemasangan</option>
                  <option value="Interior">Interior</option>
                  <option value="Pekerjaan Infrastruktur">
                    Pekerjaan Infrastruktur
                  </option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Satuan & Harga */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("unit")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.unit ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Satuan</option>
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  <option value="other">Lainnya (isi manual)</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.unit.message}
                  </p>
                )}

                {/* Custom Unit Input */}
                {selectedUnit === "other" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      {...register("unitOther")}
                      placeholder="Masukkan satuan lainnya"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.unitOther ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.unitOther && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.unitOther.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    {...register("price")}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register("status")}
                    value="active"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Aktif</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register("status")}
                    value="inactive"
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Non-aktif</span>
                </label>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Deskripsi detail tentang produk/jasa (opsional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maksimal 500 karakter
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Produk
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">Tips:</p>
              <ul className="mt-2 text-sm text-blue-600 list-disc list-inside space-y-1">
                <li>Gunakan nama produk yang jelas dan deskriptif</li>
                <li>Pastikan harga sudah sesuai dengan satuan yang dipilih</li>
                <li>Deskripsi membantu customer memahami produk/jasa Anda</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatedProduct;
