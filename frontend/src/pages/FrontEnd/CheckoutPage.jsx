import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Demo data (ganti dengan useSelector dan useLocation di project asli)
  const [order, setOrder] = useState({
    total: 150000,
    items: [
      { name: "Product 1", price: 100000 },
      { name: "Product 2", price: 50000 },
    ],
  });

  const [currUsers, setCurrUsers] = useState({
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  // Client key (ganti dengan env variable di project asli)
  const MIDTRANS_CLIENT_KEY = "SB-Mid-client-xxxxxxxxxxxxx";
  const API_URL = "http://localhost:5000/api/payment/create-transaction";

  // 🔹 Load script Snap Midtrans
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 🔹 Proses Pembayaran
  const handlePay = async () => {
    if (!snapReady) {
      alert("Midtrans belum siap. Tunggu sebentar...");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            alert("✅ Pembayaran berhasil!");
            console.log(result);
            // navigate("/customer"); // Uncomment di project asli
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
            alert("⚠ Kamu menutup popup tanpa menyelesaikan pembayaran");
          },
        });
      } else {
        alert("Gagal mendapatkan token dari server");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pembayaran: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Nama:</span> {currUsers?.user?.name}
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Email:</span>{" "}
            {currUsers?.user?.email}
          </p>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Detail Pesanan:</h3>
          <div className="space-y-2">
            {order?.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-600">
                <span>{item.name}</span>
                <span>Rp {item.price?.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">
                Rp {order?.total?.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm text-center">
            {snapReady
              ? "✓ Midtrans siap. Klik tombol untuk melanjutkan pembayaran."
              : "⏳ Memuat Midtrans..."}
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading || !snapReady}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? "⏳ Memproses..." : "💳 Bayar Sekarang"}
        </button>

        {/* Info */}
        <p className="text-gray-400 text-xs mt-4 text-center">
          Environment: Sandbox (Testing)
        </p>
      </div>

      {/* Demo Controls - Remove di production */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg w-full">
        <p className="text-yellow-800 text-sm font-semibold mb-2">
          🔧 Demo Controls (Hapus di production):
        </p>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Edit Client Key"
            className="w-full px-3 py-2 border rounded text-sm"
            defaultValue={MIDTRANS_CLIENT_KEY}
          />
          <p className="text-xs text-yellow-700">
            Ganti dengan: import.meta.env.VITE_MIDTRANS_CLIENT_KEY
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;