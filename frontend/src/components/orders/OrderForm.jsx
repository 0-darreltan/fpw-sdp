import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionCart } from "../../features/cart/cartSlice";

// ✅ Validation schema
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
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Jumlah minimal 1",
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

const OrderForm = ({ products = [], user, onAddOrder, onOrderComplete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // State untuk autocomplete alamat proyek
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const suggestionRef = useRef(null);

  // ✅ Get data from Redux
  const { currUsers } = useSelector((state) => state.users);
  const { items: cartItems, loading: cartLoading } = useSelector(
    (state) => state.cart
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
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

  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // ✅ Load cart items dari Redux ke form
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      console.log("📥 Loading cart to form:", cartItems);

      // ✅ Replace all items (lebih efisien daripada setValue + append)
      const formattedItems = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit,
        notes: "",
      }));

      replace(formattedItems);
      console.log("✅ Cart loaded to form");
    } else {
      console.log("⚠️ Cart is empty");
      replace([]);
    }
  }, [cartItems, replace]);

  // ✅ Calculate totals
  const calculateSubtotal = (item) => {
    return (item?.quantity || 0) * (item?.price || 0);
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
    }).format(price || 0);
  };

  // ✅ Search location with autocomplete
  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    console.log("🔍 Searching location for:", query);

    try {
      const response = await fetch(
        `${url}/geocode/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("❌ Response is not an array:", data);
        setLocationSuggestions([]);
        return;
      }

      const suggestions = (data || []).map((item) => {
        const addr = item.address || {};

        const kelurahan =
          addr.village || addr.suburb || addr.neighbourhood || "";
        const kecamatan =
          addr.city_district || addr.municipality || addr.county || "";
        const city =
          addr.city ||
          addr.town ||
          (addr.county && !addr.city_district ? addr.county : "") ||
          "";

        const parts = [
          addr.road,
          kelurahan,
          kecamatan,
          city,
          addr.state,
        ].filter(Boolean);
        const shortLabel = parts.join(", ");

        return {
          display_name: shortLabel || item.display_name,
          full_display_name: item.display_name,
          address: {
            street: addr.road || addr.pedestrian || "",
            kelurahan: kelurahan,
            kecamatan: kecamatan,
            city: city,
            province: addr.state || "",
            postalCode: addr.postcode || "",
            country: addr.country || "Indonesia",
          },
        };
      });

      setLocationSuggestions(suggestions);
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("❌ Error searching location:", error);
      setLocationSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce search location
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery.trim().length >= 3) {
        searchLocation(locationQuery);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  // Handle click outside untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Add product to cart
  const handleAddToCart = async () => {
    if (!selectedProduct || !quantity || quantity < 1) {
      alert("Pilih produk dan masukkan jumlah yang valid");
      return;
    }

    const product = products.find(
      (p) => String(p.id || p._id) === String(selectedProduct)
    );

    if (!product) {
      alert("Produk tidak ditemukan");
      return;
    }

    try {
      console.log("➕ Adding to cart:", {
        productId: product.id || product._id,
        quantity: parseInt(quantity),
      });

      await dispatch(
        actionCart.upsertItemInCart({
          productId: product.id || product._id,
          quantity: parseInt(quantity),
        })
      ).unwrap();

      console.log("✅ Item added to cart");

      // Reset selection
      setSelectedProduct("");
      setQuantity("");
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      alert("Gagal menambahkan produk: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Remove item from cart
  const handleRemoveItem = async (index, productId) => {
    if (!window.confirm("Hapus item ini dari keranjang?")) return;

    try {
      console.log("🗑️ Removing item:", productId);

      await dispatch(actionCart.deleteCartItem(productId)).unwrap();
      console.log("✅ Item removed from cart");
    } catch (error) {
      console.error("❌ Failed to remove item:", error);
      alert("Gagal menghapus item: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Update quantity - Debounced
  const handleQuantityChange = async (index, productId, newQuantity) => {
    const qty = parseInt(newQuantity);

    if (!qty || qty < 1) {
      alert("Jumlah minimal 1");
      return;
    }

    try {
      console.log("🔄 Updating quantity:", { productId, quantity: qty });

      await dispatch(
        actionCart.upsertItemInCart({
          productId: productId,
          quantity: qty,
          replaceQuantity: true, // ✅ Replace, not increment
        })
      ).unwrap();

      console.log("✅ Quantity updated");
    } catch (error) {
      console.error("❌ Failed to update quantity:", error);
    }
  };

  // ✅ Clear cart
  const handleResetCart = async () => {
    if (!window.confirm("Yakin ingin menghapus semua item?")) return;

    try {
      await dispatch(actionCart.clearCart()).unwrap();
      console.log("✅ Cart cleared");
    } catch (error) {
      console.error("❌ Failed to clear cart:", error);
      alert("Gagal reset keranjang: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Checkout
  const handleCheckout = () => {
    if (fields.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    const projectData = {
      projectName: watch("projectName"),
      projectLocation: watch("projectLocation"),
      locationDetails: selectedLocation ? selectedLocation.address : null,
      projectDescription: watch("projectDescription"),
      startDate: watch("startDate"),
      endDate: watch("endDate"),
    };

    const itemsForCheckout = watchItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: item.quantity,
      price: item.price,
      unit: item.unit,
      notes: item.notes || "",
    }));

    const checkoutData = {
      project: projectData,
      items: itemsForCheckout,
      total: calculateTotal(),
      customer: {
        id: currUsers?.id || currUsers?._id,
        username: currUsers?.username,
        name: currUsers?.name,
        email: currUsers?.email,
        phone: currUsers?.phone,
      },
    };

    console.log("🚀 Proceeding to checkout:", checkoutData);
    navigate("/checkout", { state: checkoutData });
  };

  // ✅ Submit order
  const onSubmit = async (data) => {
    // Get user from currUsers.user or fallback to user prop
    const currentUser = currUsers?.user || user;

    if (!currentUser) {
      alert("User data tidak ditemukan. Silakan login kembali.");
      return;
    }

    const order = {
      ...data,
      // Simpan locationDetails jika ada dari suggestion
      locationDetails: selectedLocation ? selectedLocation.address : null,
      customerId: currentUser?.id || currentUser?._id,
      customerName: currentUser?.name,
      customerEmail: currentUser?.email,
      customerPhone: currentUser?.phone,
      total: calculateTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("📦 Order submitted:", order);

    if (onAddOrder) {
      await onAddOrder(order);
    }

    setShowSuccess(true);

    // Clear cart after order
    setTimeout(async () => {
      setShowSuccess(false);
      reset(); // ✅ Reset entire form
      setLocationQuery("");
      setSelectedLocation(null);

      if (onOrderComplete) {
        await onOrderComplete();
      }
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

      {/* Loading State */}
      {cartLoading && (
        <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>Memuat keranjang...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Info */}
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

              {/* Preview lokasi yang tersimpan */}
              {selectedLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <p className="text-xs font-medium text-blue-700 mb-1">
                    📍 Lokasi Tersimpan:
                  </p>
                  <div className="text-xs text-blue-600">
                    {selectedLocation.address.street && (
                      <span>{selectedLocation.address.street}</span>
                    )}
                    {selectedLocation.address.kelurahan && (
                      <span>, Kel. {selectedLocation.address.kelurahan}</span>
                    )}
                    {selectedLocation.address.kecamatan && (
                      <span>, Kec. {selectedLocation.address.kecamatan}</span>
                    )}
                    {selectedLocation.address.city && (
                      <span>, {selectedLocation.address.city}</span>
                    )}
                    {selectedLocation.address.province && (
                      <span>, {selectedLocation.address.province}</span>
                    )}
                    {selectedLocation.address.postalCode && (
                      <span> {selectedLocation.address.postalCode}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="relative" ref={suggestionRef}>
                <input
                  {...register("projectLocation")}
                  type="text"
                  placeholder="Cari lokasi proyek (min. 3 karakter)..."
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    // Update form value
                    const event = {
                      target: {
                        name: "projectLocation",
                        value: e.target.value,
                      },
                    };
                    register("projectLocation").onChange(event);
                    if (e.target.value.length >= 3) {
                      setShowSuggestions(true);
                    }
                  }}
                  onFocus={() => {
                    if (
                      locationQuery.length >= 3 &&
                      locationSuggestions.length > 0
                    ) {
                      setShowSuggestions(true);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.projectLocation
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />

                {loadingSuggestions && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                )}

                {/* Dropdown suggestions */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {locationSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const fullLocation = suggestion.display_name;
                          setLocationQuery(fullLocation);
                          setSelectedLocation(suggestion);
                          setShowSuggestions(false);

                          // Update form value
                          const event = {
                            target: {
                              name: "projectLocation",
                              value: fullLocation,
                            },
                          };
                          register("projectLocation").onChange(event);

                          console.log(
                            "✅ Lokasi proyek tersimpan:",
                            suggestion
                          );
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                      >
                        <p className="font-medium text-gray-800 text-sm">
                          {suggestion.address.street || "Lokasi"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {suggestion.display_name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {locationQuery.length >= 3 && !loadingSuggestions && (
                  <p className="text-xs text-gray-400 mt-1">
                    {locationSuggestions.length} lokasi ditemukan
                  </p>
                )}
              </div>

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
                min="1"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedProduct || !quantity}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>➕</span>
                <span>{cartLoading ? "Loading..." : "Tambah"}</span>
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
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      📦
                    </div>

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
                            min="1"
                            step="1"
                            onBlur={(e) =>
                              handleQuantityChange(
                                index,
                                watchItems[index]?.productId,
                                e.target.value
                              )
                            }
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
                          onClick={() =>
                            handleRemoveItem(
                              index,
                              watchItems[index]?.productId
                            )
                          }
                          disabled={cartLoading}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1 disabled:opacity-50"
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

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={handleResetCart}
            disabled={cartLoading || fields.length === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Keranjang
          </button>

          <button
            type="submit"
            disabled={fields.length === 0 || cartLoading}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              fields.length === 0 || cartLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            🚀 Kirim Pesanan RAB
          </button>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={fields.length === 0 || cartLoading}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              fields.length === 0 || cartLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            💳 Lanjut ke Checkout
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
