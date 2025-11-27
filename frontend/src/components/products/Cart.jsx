import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionCart } from "../../features/cart/cartSlice";

const Cart = ({ onClose }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(
    (state) => state.cart || { items: [], loading: false }
  );
  const navigate = useNavigate();

  const totalPrice = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * (it.quantity || 0),
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleInc = async (item) => {
    try {
      await dispatch(
        actionCart.upsertItemInCart({
          productId: item.productId,
          quantity: (item.quantity || 0) + 1,
        })
      ).unwrap();
      await dispatch(actionCart.fetchCart());
    } catch (err) {
      console.error("Failed to update cart:", err);
      alert("Gagal mengupdate keranjang");
    }
  };

  const handleDec = async (item) => {
    const nextQty = (item.quantity || 0) - 1;
    try {
      if (nextQty <= 0) {
        await dispatch(actionCart.deleteCartItem(item.productId)).unwrap();
      } else {
        await dispatch(
          actionCart.upsertItemInCart({
            productId: item.productId,
            quantity: nextQty,
          })
        ).unwrap();
      }
      await dispatch(actionCart.fetchCart());
    } catch (err) {
      console.error("Failed to update cart:", err);
      alert("Gagal mengupdate keranjang");
    }
  };

  const handleRemove = async (item) => {
    try {
      await dispatch(actionCart.deleteCartItem(item.productId)).unwrap();
      await dispatch(actionCart.fetchCart());
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      alert("Gagal menghapus item dari keranjang");
    }
  };

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    const confirmed = window.confirm(
      `Total: ${formatPrice(totalPrice)}\nLanjutkan ke halaman checkout?`
    );
    if (!confirmed) return;

    try {
      // Navigate to checkout page (data diambil dari Redux state cart)
      navigate("/checkout");
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menuju checkout: " + (err.message || err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 max-h-[80vh] overflow-auto z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Keranjang Pembelian</h3>
          <button className="text-gray-500" onClick={onClose}>
            ✖
          </button>
        </div>

        {loading && <div className="text-sm text-gray-500 mb-4">Memuat...</div>}

        {!items || items.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Keranjang masih kosong
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.productId}
                className="flex items-center justify-between border rounded p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <div className="font-medium">
                      {it.productName || "Produk"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {it.unit || "pcs"} • {formatPrice(it.price || 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button className="px-3 py-1" onClick={() => handleDec(it)}>
                      -
                    </button>
                    <div className="px-3 py-1">{it.quantity}</div>
                    <button className="px-3 py-1" onClick={() => handleInc(it)}>
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice((it.price || 0) * (it.quantity || 0))}
                    </div>
                    <button
                      className="text-sm text-red-600 mt-1"
                      onClick={() => handleRemove(it)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="font-semibold">Total</div>
              <div className="font-bold text-lg text-green-600">
                {formatPrice(totalPrice)}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-100 py-2 rounded"
                onClick={onClose}
              >
                Lanjut Belanja
              </button>
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
