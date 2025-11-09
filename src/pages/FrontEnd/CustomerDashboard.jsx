import React, { useState } from "react";
import OrderForm from "../../components/orders/OrderForm";
import OrderHistory from "../../components/orders/OrderHistory";
import ProductCatalog from "../../components/products/ProductCatalog";
import MaterialCatalog from "../../components/materials/MaterialCatalog";

const CustomerDashboard = ({
  user,
  products: propsProducts,
  materials: propsMaterials = [],
  orders,
  onAddOrder,
  onUpdateRAB,
}) => {
  const [activeTab, setActiveTab] = useState("catalog");
  const [cartItems, setCartItems] = useState([]);
  const [negotiationInputs, setNegotiationInputs] = useState({});

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "materials", label: "Katalog Material", icon: "🧱" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
  ];

  const handleAddFromCatalog = (product) => {
    const id = product.id ?? product._id;
    setCartItems((prev) => {
      const existing = prev.find((p) => p.productId === id);
      if (existing) {
        return prev.map((p) =>
          p.productId === id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prev,
        { productId: id, quantity: 1, id: Date.now(), meta: product },
      ];
    });
    setActiveTab("order");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "catalog":
        return (
          <ProductCatalog
            products={propsProducts}
            materials={propsMaterials}
            onAddToCart={handleAddFromCatalog}
          />
        );
      case "materials":
        return (
          <MaterialCatalog
            materials={propsMaterials}
            onAddToCart={(it) => {
              // when adding from material catalog we receive object {id, isMaterial:true}
              setCartItems((prev) => {
                const existing = prev.find((p) => p.productId === it.id);
                if (existing) {
                  return prev.map((p) =>
                    p.productId === it.id
                      ? { ...p, quantity: p.quantity + 1 }
                      : p
                  );
                }
                return [
                  ...prev,
                  { productId: it.id, quantity: 1, id: Date.now() },
                ];
              });
              setActiveTab("order");
            }}
          />
        );

      case "order":
        return (
          <OrderForm
            products={propsProducts}
            materials={propsMaterials}
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
        return <ProductCatalog products={propsProducts} />;
    }
  };
  // negotiation input values per RAB id
  // const [negotiationInputs, setNegotiationInputs] = useState({});

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "Rp 0";
    try {
      return new Intl.NumberFormat("id-ID").format(Number(value));
    } catch {
      return String(value);
    }
  };

  const getOrderStatusBadge = (status) => {
    const cfg = {
      pending: {
        label: "Menunggu Review",
        class: "bg-yellow-100 text-yellow-800",
      },
      reviewed: {
        label: "Sedang Ditinjau",
        class: "bg-blue-100 text-blue-800",
      },
      approved: { label: "Disetujui", class: "bg-green-100 text-green-800" },
      in_progress: {
        label: "Dalam Pengerjaan",
        class: "bg-purple-100 text-purple-800",
      },
      completed: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
      cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
    };
    const c = cfg[status] || {
      label: status || "-",
      class: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.class}`}>
        {c.label}
      </span>
    );
  };

  const getRABStatusBadge = (status) => {
    const cfg = {
      "Menunggu Perhitungan": {
        label: "Menunggu Perhitungan",
        class: "bg-yellow-100 text-yellow-800",
      },
      "Dalam Perhitungan": {
        label: "Dalam Perhitungan",
        class: "bg-blue-100 text-blue-800",
      },
      "Perlu Revisi": {
        label: "Perlu Revisi",
        class: "bg-red-100 text-red-800",
      },
      "Negosiasi Pelanggan": {
        label: "Negosiasi",
        class: "bg-purple-100 text-purple-800",
      },
      Disetujui: { label: "Disetujui", class: "bg-green-100 text-green-800" },
    };
    const c = cfg[status] || {
      label: status || "-",
      class: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.class}`}>
        {c.label}
      </span>
    );
  };

  const submitNegotiation = (rab) => {
    if (!onUpdateRAB) return;
    const raw = negotiationInputs[rab.id];
    if (!raw) return alert("Masukkan nominal tawaran terlebih dahulu");
    const value = Number(String(raw).replace(/[^0-9]/g, ""));
    if (isNaN(value) || value <= 0)
      return alert("Masukkan angka yang valid lebih besar dari 0");
    const updated = {
      ...rab,
      proposedPrice: value,
      status: "Negosiasi Pelanggan",
    };
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
              {/* {rabs.filter((r) => r.customerId === user?.id).length === 0 ? (
                <p className="text-gray-500">Belum ada pengajuan RAB.</p>
              ) : (
                rabs
                  .filter((r) => r.customerId === user?.id)
                  .map((r) => (
                    <div key={r.id} className="border rounded p-3 bg-white">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {r.projectName || "Unnamed"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Status: {getRABStatusBadge(r.status)}
                      </div>
                      <div className="mt-2 text-sm">
                        Total estimasi: Rp{" "}
                        {formatCurrency(r.totalEstimate || 0)}
                      </div>
                      {r.proposedPrice && (
                        <div className="mt-2 text-sm text-blue-700">
                          Tawaran Anda: Rp{" "}
                          {Number(r.proposedPrice).toLocaleString()}
                        </div>
                      )}
                      {r.agreedPrice && (
                        <div className="mt-2 text-sm text-green-700">
                          Disepakati: Rp{" "}
                          {Number(r.agreedPrice).toLocaleString()}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="border rounded p-2 w-40"
                          placeholder="Tawaran (angka)"
                          value={negotiationInputs[r.id] || ""}
                          onChange={(e) =>
                            setNegotiationInputs((p) => ({
                              ...p,
                              [r.id]: e.target.value,
                            }))
                          }
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
              )} */}
            </div>
          </div>

          {/* Recent orders summary for quick monitoring */}
          <div className="mt-6">
            <h3 className="text-lg font-medium">Ringkasan Pesanan Terbaru</h3>
            <div className="mt-3 space-y-3">
              {/* {orders &&
              orders.filter((o) => o.customerId === user?.id).length === 0 ? (
                <p className="text-gray-500">Belum ada pesanan.</p>
              ) : (
                orders
                  .filter((o) => o.customerId === user?.id)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((o) => (
                    <div
                      key={o.id}
                      className="border rounded p-3 bg-white flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{o.projectName}</div>
                        <div className="text-sm text-gray-500">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString()
                            : "-"}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          Total: Rp {formatCurrency(o.total || 0)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div>{getOrderStatusBadge(o.status)}</div>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                            onClick={() => setActiveTab("history")}
                          >
                            Lihat Pesanan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )} */}
              <div className="mt-2">
                <button
                  className="px-3 py-2 bg-gray-100 rounded text-sm"
                  onClick={() => setActiveTab("history")}
                >
                  Lihat semua riwayat pesanan
                </button>
              </div>
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
