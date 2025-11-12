import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currUsers } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Data order dikirim lewat navigate(`/checkout`, { state: { order } })
  const order = location.state?.order;

  // 🔹 Load script Snap Midtrans
  useEffect(() => {
    if (!order) {
      navigate("/customer");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [order, navigate]);

  // 🔹 Proses Pembayaran
  const handlePay = async () => {
    if (!snapReady) {
      alert("Midtrans belum siap. Tunggu sebentar...");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/payment/create-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );

      const data = await res.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            alert("✅ Pembayaran berhasil!");
            console.log(result);
            navigate("/customer");
          },
          onPending: (result) => {
            alert("🕒 Menunggu pembayaran...");
            console.log(result);
          },
          onError: (result) => {
            alert("❌ Terjadi kesalahan pembayaran!");
            console.log(result);
          },
          onClose: () => {
            alert("⚠️ Kamu menutup popup tanpa menyelesaikan pembayaran");
          },
        });
      } else {
        alert("Gagal mendapatkan token dari server");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

        <p className="mb-2">Nama: {currUsers?.user?.name}</p>
        <p className="mb-2">Email: {currUsers?.user?.email}</p>
        <p className="mb-4 font-semibold">
          Total: Rp {order?.total?.toLocaleString("id-ID")}
        </p>

        <p className="text-gray-500 text-sm mb-4 text-center">
          Klik tombol di bawah untuk melanjutkan ke pembayaran.
        </p>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "💳 Bayar Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
