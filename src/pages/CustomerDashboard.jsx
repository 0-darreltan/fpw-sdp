import React, { useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderHistory from "../components/OrderHistory";
import ProductCatalog from "../components/ProductCatalog";

const CustomerDashboard = ({
  user,
  products,
  orders,
  onAddOrder,
  rabs = [],
  onAddRAB,
  onUpdateRAB,
}) => {
  const [activeTab, setActiveTab] = useState("catalog");
  // Cart state for quick add-to-order from product catalog
  const [cartItems, setCartItems] = useState([]);

  // Cart / order related state (RABs are created from orders)
  // no local RAB form state here; RABs are created automatically from orders

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "catalog":
        return (
          <ProductCatalog
            products={products}
            onAddToCart={(product) => {
              // add or increment
              setCartItems((prev) => {
                const existing = prev.find((p) => p.productId === product.id);
                if (existing) {
                  return prev.map((p) =>
                    p.productId === product.id
                      ? { ...p, quantity: p.quantity + 1 }
                      : p
                  );
                }
                return [
                  ...prev,
                  { productId: product.id, quantity: 1, id: Date.now() },
                ];
              });
              // open order tab for checkout
              setActiveTab("order");
            }}
          />
        );
      case "order":
        return (
          <OrderForm
            products={products}
            user={user}
            onAddOrder={(order) => {
              // call parent handler and clear cart
              if (onAddOrder) onAddOrder(order);
              setCartItems([]);
            }}
            initialItems={cartItems}
          />
        );
      case "history":
        return <OrderHistory orders={orders} user={user} />;
      default:
        return <ProductCatalog products={products} />;
    }
  };
  // negotiation input values per RAB id
  const [negotiationInputs, setNegotiationInputs] = useState({});

  const submitNegotiation = (rab) => {
    if (!onUpdateRAB) return;
    const raw = negotiationInputs[rab.id];
    if (!raw) return alert("Masukkan nominal tawaran terlebih dahulu");
    const value = Number(String(raw).replace(/[^0-9]/g, ""));
    if (isNaN(value) || value <= 0) return alert("Masukkan angka yang valid lebih besar dari 0");
    const updated = { ...rab, proposedPrice: value, status: "Negosiasi Pelanggan" };
    onUpdateRAB(updated);
    // clear input for that rab
    setNegotiationInputs((prev) => ({ ...prev, [rab.id]: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Customer
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Selamat datang, {user?.name}!
          </p>
          {/* RAB submissions summary (since RABs are created from orders) */}
          <div className="mt-4">
            <h3 className="text-lg font-medium">Pengajuan RAB Anda</h3>
            <div className="mt-3 space-y-3">
              {rabs.filter((r) => r.customerId === user?.id).length === 0 ? (
                <p className="text-gray-500">Belum ada pengajuan RAB.</p>
              ) : (
                rabs
                  .filter((r) => r.customerId === user?.id)
                  .map((r) => (
                    <div key={r.id} className="border rounded p-3 bg-white">
                      <div className="flex justify-between">
                        <div className="font-medium">{r.projectName || 'Unnamed'}</div>
                        <div className="text-sm text-gray-500">
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Status: {r.status}</div>
                      <div className="mt-2 text-sm">Total estimasi: Rp {Number(r.totalEstimate || 0).toLocaleString()}</div>
                      {r.proposedPrice && (
                        <div className="mt-2 text-sm text-blue-700">Tawaran Anda: Rp {Number(r.proposedPrice).toLocaleString()}</div>
                      )}
                      {r.agreedPrice && (
                        <div className="mt-2 text-sm text-green-700">Disepakati: Rp {Number(r.agreedPrice).toLocaleString()}</div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="border rounded p-2 w-40"
                          placeholder="Tawaran (angka)"
                          value={negotiationInputs[r.id] || ""}
                          onChange={(e) => setNegotiationInputs((p) => ({ ...p, [r.id]: e.target.value }))}
                        />
                        <button
                          className="px-3 py-2 bg-yellow-500 text-white rounded"
                          onClick={() => submitNegotiation(r)}
                        >
                          Ajukan Negosiasi
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
