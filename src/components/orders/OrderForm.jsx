import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// ✅ Validation schema dengan Joi
const orderSchema = Joi.object({
  projectName: Joi.string().min(3).required().messages({
    "string.empty": "Nama proyek wajib diisi",
    "string.min": "Nama proyek minimal 3 karakter",
  }),
  projectLocation: Joi.string().min(3).required().messages({
    "string.empty": "Lokasi proyek wajib diisi",
    "string.min": "Lokasi proyek minimal 3 karakter",
  }),
  projectDescription: Joi.string().allow("").optional(),
  startDate: Joi.date().iso().allow("").optional(),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref("startDate"))
    .allow("")
    .optional()
    .messages({
      "date.min": "Tanggal selesai harus setelah tanggal mulai",
    }),
  items: Joi.array()
    .min(1)
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().min(0.1).required().messages({
          "number.min": "Jumlah minimal 0.1",
          "number.base": "Jumlah harus berupa angka",
        }),
        price: Joi.number().required(),
        unit: Joi.string().required(),
        notes: Joi.string().allow("").optional(),
      })
    )
    .messages({
      "array.min": "Minimal harus ada 1 item dalam keranjang",
    }),
});

const OrderForm = ({ products = [], user, onAddOrder, initialItems = [] }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(orderSchema),
    defaultValues: {
      projectName: "",
      projectLocation: "",
      projectDescription: "",
      startDate: "",
      endDate: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // ✅ Load initial items from catalog
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      initialItems.forEach((item) => {
        const product = products.find(
          (p) => p.id === item.productId || p._id === item.productId
        );
        if (product) {
          append({
            productId: product.id || product._id,
            productName: product.name,
            quantity: item.quantity || 1,
            price: product.price,
            unit: product.unit,
            notes: item.notes || "",
          });
        }
      });
    }
  }, [initialItems, products, append]);

  const watchItems = watch("items");

  // ✅ Calculate totals
  const calculateSubtotal = (item) => {
    return (item.quantity || 0) * (item.price || 0);
  };

  const calculateTotal = () => {
    return watchItems.reduce((total, item) => {
      return total + calculateSubtotal(item);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ✅ Add product to cart
  const handleAddToCart = () => {
    if (!selectedProduct || !quantity) {
      alert("Pilih produk dan masukkan jumlah");
      return;
    }

    const product = products.find(
      (p) => String(p.id || p._id) === String(selectedProduct)
    );
    if (!product) return;

    // Check if product already exists
    const existingIndex = watchItems.findIndex(
      (item) => String(item.productId) === String(product.id || product._id)
    );

    if (existingIndex >= 0) {
      // Update quantity if exists
      const currentQty = watchItems[existingIndex].quantity || 0;
      setValue(
        `items.${existingIndex}.quantity`,
        currentQty + parseFloat(quantity)
      );
    } else {
      // Add new item
      append({
        productId: product.id || product._id,
        productName: product.name,
        quantity: parseFloat(quantity),
        price: product.price,
        unit: product.unit,
        notes: "",
      });
    }

    // Reset selection
    setSelectedProduct("");
    setQuantity("");
  };

  // ✅ Submit order
  const onSubmit = (data) => {
    const order = {
      ...data,
      customerId: user?.id || user?._id,
      customerName: user?.name,
      customerEmail: user?.email,
      customerPhone: user?.phone,
      total: calculateTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("📦 Order submitted:", order);
    onAddOrder(order);
    setShowSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setValue("projectName", "");
      setValue("projectLocation", "");
      setValue("projectDescription", "");
      setValue("startDate", "");
      setValue("endDate", "");
      setValue("items", []);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="font-medium">
              Pesanan berhasil dibuat! Tim kami akan segera menghubungi Anda.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Informasi Proyek</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Proyek <span className="text-red-500">*</span>
              </label>
              <input
                {...register("projectName")}
                type="text"
                placeholder="Contoh: Pembangunan Jalan Raya"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.projectName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.projectName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Proyek <span className="text-red-500">*</span>
              </label>
              <input
                {...register("projectLocation")}
                type="text"
                placeholder="Contoh: Kendari, Sulawesi Tenggara"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.projectLocation
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.projectLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectLocation.message}
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Proyek
              </label>
              <textarea
                {...register("projectDescription")}
                rows="3"
                placeholder="Jelaskan detail proyek yang akan dikerjakan..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                {...register("startDate")}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                {...register("endDate")}
                type="date"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.endDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Add Product Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛒</span>
            <span>Tambah Produk</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Produk
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Produk --</option>
                {products.map((product) => (
                  <option
                    key={product.id || product._id}
                    value={product.id || product._id}
                  >
                    {product.name} - {formatPrice(product.price)}/{product.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>➕</span>
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛍️</span>
            <span>Keranjang Belanja</span>
            {fields.length > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {fields.length} item
              </span>
            )}
          </h3>

          {errors.items && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.items.message}
            </div>
          )}

          {fields.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Keranjang masih kosong</p>
              <p className="text-gray-400 text-sm mt-2">
                Tambahkan produk untuk membuat pesanan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Icon */}
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      📦
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {watchItems[index]?.productName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatPrice(watchItems[index]?.price)} /{" "}
                        {watchItems[index]?.unit}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Jumlah
                          </label>
                          <input
                            {...register(`items.${index}.quantity`)}
                            type="number"
                            min="0.1"
                            step="0.1"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                              errors.items?.[index]?.quantity
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.items[index].quantity.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Catatan
                          </label>
                          <input
                            {...register(`items.${index}.notes`)}
                            type="text"
                            placeholder="Catatan opsional"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">
                          Subtotal:{" "}
                          <span className="text-green-600 text-lg">
                            {formatPrice(calculateSubtotal(watchItems[index]))}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1"
                        >
                          <span>🗑️</span>
                          <span className="text-sm font-medium">Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Total Estimasi RAB
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatPrice(calculateTotal())}
                    </p>
                  </div>
                  <div className="text-5xl">💰</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setValue("items", [])}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Reset Keranjang
          </button>
          <button
            type="submit"
            disabled={fields.length === 0}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              fields.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            🚀 Kirim Pesanan RAB
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
