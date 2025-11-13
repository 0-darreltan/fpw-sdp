import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const CheckoutPage = () => {
  const [snapReady, setSnapReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapToken, setSnapToken] = useState(null);
  const location = useLocation();
  const { order } = location.state || {};

  console.log(order);

  const { oneUsers } = useSelector((state) => state.users);

  useEffect(() => {
    setCurrUsers(oneUsers);
  }, [oneUsers]);

  const [currUsers, setCurrUsers] = useState({});
  // 🔹 Load script Snap Midtrans
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Kirim data transaksi ke backend
      const res = await fetch(
        "http://localhost:3000/api/payments/create-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: "ORDER-" + Date.now(),
            grossAmount: order.total,
            customer: {
              name: "customer1",
              email: "john@example.com",
              phone: "081234567890",
            },
            items: order.items,
          }),
        }
      );

      const data = await res.json();
      console.log(data.token);
      setSnapToken(data.token);
      setLoading(false);

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            console.log("✅ Payment success:", result);
            alert("Pembayaran berhasil!");
          },
          onPending: (result) => {
            console.log("⏳ Payment pending:", result);
            alert("Menunggu konfirmasi pembayaran.");
          },
          onError: (error) => {
            console.error("❌ Payment error:", error);
            alert("Terjadi kesalahan pembayaran.");
          },
          onClose: () => {
            console.log("❎ Payment popup closed");
          },
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <div className="border p-4 rounded-lg mb-4">
        <p>
          <strong>Customer:</strong> customer1
        </p>
        <p>
          <strong>Email:</strong> john@example.com
        </p>
        <p>
          <strong>Total:</strong> Rp {order.total.toLocaleString()}
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={!snapReady || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Bayar Sekarang"}
      </button>
    </div>
  );
};

export default CheckoutPage;
