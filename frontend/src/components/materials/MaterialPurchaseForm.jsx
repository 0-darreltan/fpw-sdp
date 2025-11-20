import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionCart } from "../../features/cart/cartSlice";

// ✅ Updated Validation Schema (without project fields)
const purchaseSchema = Joi.object({
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

const MaterialPurchaseForm = ({ products = [], onOrderComplete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // ✅ Get data from Redux
  const { currUsers } = useSelector((state) => state.users);
  const { items: cartItems, loading: cartLoading } = useSelector(
    (state) => state.cart
  );

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(purchaseSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // ✅ Load cart items from Redux into the form
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const formattedItems = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit,
        notes: "",
      }));
      replace(formattedItems);
    } else {
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
      await dispatch(
        actionCart.upsertItemInCart({
          productId: product.id || product._id,
          quantity: parseInt(quantity),
        })
      ).unwrap();
      setSelectedProduct("");
      setQuantity("");
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      alert("Gagal menambahkan produk: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Remove item from cart
  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Hapus item ini dari keranjang?")) return;
    try {
      await dispatch(actionCart.deleteCartItem(productId)).unwrap();
    } catch (error) {
      console.error("❌ Failed to remove item:", error);
      alert("Gagal menghapus item: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Update item quantity in cart
  const handleQuantityChange = async (productId, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (!qty || qty < 1) return; // Fail silently or provide feedback
    try {
      await dispatch(
        actionCart.upsertItemInCart({ productId, quantity: qty })
      ).unwrap();
    } catch (error) {
      console.error("❌ Failed to update quantity:", error);
    }
  };

  // ✅ Clear cart
  const handleResetCart = async () => {
    if (!window.confirm("Yakin ingin menghapus semua item?")) return;
    try {
      await dispatch(actionCart.clearCart()).unwrap();
    } catch (error) {
      console.error("❌ Failed to clear cart:", error);
      alert("Gagal reset keranjang: " + (error.message || "Unknown error"));
    }
  };

  // ✅ Simplified Checkout Logic
  const handleCheckout = () => {
    if (fields.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }
    const itemsForCheckout = watchItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      qty: item.quantity,
      price: item.price,
      unit: item.unit,
      notes: item.notes || "",
    }));
    const checkoutData = {
      orderType: "MATERIAL_PURCHASE", // Differentiator
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
    console.log("🚀 Proceeding to checkout (Material Purchase):", checkoutData);
    navigate("/checkout", { state: checkoutData });
  };

  // ✅ This function is kept for direct order submission if needed,
  // but the primary action is now `handleCheckout`.
  const onSubmit = async (data) => {
    const order = {
      items: data.items,
      customerId: currUsers?.id || currUsers?._id,
      customerName: currUsers?.name,
      total: calculateTotal(),
      status: "pending",
      orderType: "MATERIAL_PURCHASE",
      createdAt: new Date().toISOString(),
    };
    console.log("📦 Material Purchase Submitted:", order);

    // You would typically call an API action here to save the order
    // await dispatch(actionOrder.createMaterialPurchase(order)).unwrap();

    setShowSuccess(true);
    setTimeout(async () => {
      setShowSuccess(false);
      reset();
      if (onOrderComplete) {
        await onOrderComplete();
      }
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {showSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          <p>
            <strong>Pesanan berhasil!</strong> Pembelian Anda sedang diproses.
          </p>
        </div>
      )}

      {cartLoading && (
        <div className="mb-6 bg-blue-100 text-blue-700 px-4 py-3 rounded-lg">
          <p>Memuat keranjang...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Add Product Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛒</span>
            <span>Tambah Material</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Material
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Material --</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedProduct || !quantity}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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
              <p className="text-gray-500 text-lg">
                Keranjang Anda masih kosong.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">
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
                            onBlur={(e) =>
                              handleQuantityChange(
                                watchItems[index]?.productId,
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${
                              errors.items?.[index]?.quantity
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Catatan
                          </label>
                          <input
                            {...register(`items.${index}.notes`)}
                            type="text"
                            placeholder="Catatan opsional"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          Subtotal:{" "}
                          <span className="text-green-600">
                            {formatPrice(calculateSubtotal(watchItems[index]))}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(watchItems[index]?.productId)
                          }
                          disabled={cartLoading}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 border-t-2 border-blue-200 rounded-b-lg p-6 mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-blue-900">
                    Total Pembelian
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatPrice(calculateTotal())}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleResetCart}
            disabled={cartLoading || fields.length === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Reset Keranjang
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={fields.length === 0 || cartLoading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:bg-gray-300"
          >
            Lanjut ke Checkout
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialPurchaseForm;
