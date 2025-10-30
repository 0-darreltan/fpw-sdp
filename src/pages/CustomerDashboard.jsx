import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import OrderHistory from '../components/OrderHistory';
import ProductCatalog from "../components/ProductCatalog";

const CustomerDashboard = ({
  user,
  products,
  orders,
  onAddOrder,
  rabs = [],
  onAddRAB,
}) => {
  const [activeTab, setActiveTab] = useState("catalog");
  // Cart state for quick add-to-order from product catalog
  const [cartItems, setCartItems] = useState([]);

  // Form state for creating RAB (budget) requests
  const [rabProjectName, setRabProjectName] = useState("");
  const [rabDescription, setRabDescription] = useState("");
  const [rabItems, setRabItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
    { id: "rab", label: "Ajukan Anggaran", icon: "💼" },
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
      case "rab":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">
                Form Pengajuan Anggaran (RAB)
              </h3>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nama Proyek"
                value={rabProjectName}
                onChange={(e) => setRabProjectName(e.target.value)}
              />
              <textarea
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Deskripsi singkat proyek / kebutuhan"
                value={rabDescription}
                onChange={(e) => setRabDescription(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  className="border rounded-md p-2"
                  placeholder="Nama item"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded-md p-2"
                  placeholder="Kuantitas"
                  value={itemQty}
                  min={1}
                  onChange={(e) => setItemQty(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded-md p-2"
                  placeholder="Harga satuan"
                  value={itemPrice}
                  min={0}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 bg-green-600 text-white rounded-md"
                  onClick={() => {
                    if (!itemName) return;
                    setRabItems((prev) => [
                      ...prev,
                      { name: itemName, qty: itemQty, price: itemPrice },
                    ]);
                    setItemName("");
                    setItemQty(1);
                    setItemPrice(0);
                  }}
                >
                  Tambah Item
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Daftar Item</h4>
              {rabItems.length === 0 ? (
                <p className="text-gray-500">Belum ada item.</p>
              ) : (
                <ul className="space-y-2">
                  {rabItems.map((it, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 border p-2 rounded"
                    >
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-gray-600">
                          {it.qty} x Rp {it.price?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <button
                          className="text-sm text-red-600"
                          onClick={() =>
                            setRabItems((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => {
                  const total = rabItems.reduce(
                    (s, it) => s + it.qty * (it.price || 0),
                    0
                  );
                  const payload = {
                    projectName: rabProjectName,
                    description: rabDescription,
                    items: rabItems,
                    totalEstimate: total,
                    customerId: user?.id,
                  };
                  if (onAddRAB) {
                    onAddRAB(payload);
                  }
                  // clear form
                  setRabProjectName("");
                  setRabDescription("");
                  setRabItems([]);
                }}
              >
                Kirim Pengajuan
              </button>
            </div>

            <div className="pt-4">
              <h4 className="font-medium">Riwayat Pengajuan Anggaran Anda</h4>
              <div className="space-y-3 mt-3">
                {rabs.filter((r) => r.customerId === user?.id).length === 0 ? (
                  <p className="text-gray-500">Belum ada pengajuan.</p>
                ) : (
                  rabs
                    .filter((r) => r.customerId === user?.id)
                    .map((r) => (
                      <div key={r.id} className="border rounded p-3 bg-white">
                        <div className="flex justify-between">
                          <div className="font-medium">{r.projectName}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Status: {r.status}
                        </div>
                        <div className="mt-2 text-sm">
                          Total estimasi: Rp{" "}
                          {Number(r.totalEstimate || 0).toLocaleString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <ProductCatalog products={products} />;
    }
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