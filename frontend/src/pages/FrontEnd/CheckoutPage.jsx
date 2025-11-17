import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const rabId = searchParams.get("rabId");

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [form, setForm] = useState({
    deliveryAddress: "",
    paymentMethod: "bank_transfer",
  });

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // MODE 1: Checkout dari RAB
  // -----------------------------
  async function loadRABItems() {
    try {
      const res = await fetch(`http://localhost:3000/api/rab/${rabId}`);
      const data = await res.json();

      const converted = data.items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        price: i.unitPrice,
        unit: i.unit,
      }));

      setItems(converted);

      const sum = converted.reduce((acc, i) => acc + i.qty * i.price, 0);
      setSubtotal(sum);
    } catch (err) {
      console.log("Error load RAB:", err);
    }
  }

  // -----------------------------
  // MODE 2: Checkout Biasa
  // -----------------------------
  function loadNormalCheckout() {
    const cartItems = location.state?.items || [];

    setItems(cartItems);

    const sum = cartItems.reduce((acc, i) => acc + i.qty * i.price, 0);
    setSubtotal(sum);
  }

  // -----------------------------
  // Detect mode (RAB or Normal)
  // -----------------------------
  useEffect(() => {
    async function init() {
      if (rabId) {
        await loadRABItems(); // Mode RAB
      } else {
        loadNormalCheckout(); // Mode normal
      }
      setLoading(false);
    }

    init();
  }, [rabId]);

  // -----------------------------
  // Submit Checkout
  // -----------------------------
  const handleCheckout = async () => {
    const body = {
      rabId: rabId || null,
      items,
      subtotal,
      total: subtotal,
      deliveryAddress: form.deliveryAddress,
      paymentMethod: form.paymentMethod,
    };

    const res = await fetch("http://localhost:3000/api/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Order created:", data);

    navigate(`/order-success/${data.order._id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Checkout</h1>

      {rabId ? (
        <p style={{ color: "blue" }}>
          Mode: Checkout dari <b>RAB</b>
        </p>
      ) : (
        <p style={{ color: "green" }}>
          Mode: Checkout <b>Normal</b>
        </p>
      )}

      <hr />

      <h3>Items</h3>
      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <p>
            <b>{item.productName || item.productId}</b>
          </p>
          <p>
            {item.qty} x Rp {item.price.toLocaleString()}
          </p>
        </div>
      ))}

      <h2>Subtotal: Rp {subtotal.toLocaleString()}</h2>

      <hr />

      <h3>Delivery Address</h3>
      <textarea
        rows="3"
        style={{ width: "100%" }}
        value={form.deliveryAddress}
        onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
        placeholder="Masukkan alamat lengkap..."
      />

      <h3>Payment Method</h3>
      <select
        value={form.paymentMethod}
        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
      >
        <option value="bank_transfer">Bank Transfer</option>
        <option value="e-wallet">E-Wallet</option>
        <option value="qris">QRIS</option>
      </select>

      <br />
      <br />

      <button
        onClick={handleCheckout}
        style={{
          width: "100%",
          padding: 10,
          background: "black",
          color: "white",
          borderRadius: 8,
        }}
      >
        Buat Pesanan
      </button>
    </div>
  );
};

export default CheckoutPage;
