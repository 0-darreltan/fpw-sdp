import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import OrderHistory from '../components/OrderHistory';
import ProductCatalog from "../components/ProductCatalog";

const CustomerDashboard = ({ user, products, orders, onAddOrder }) => {
  const [activeTab, setActiveTab] = useState("catalog");

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "catalog":
        return <ProductCatalog products={products} />;
      case "order":
        return (
          <OrderForm products={products} user={user} onAddOrder={onAddOrder} />
        );
      case "history":
        return <OrderHistory orders={orders} user={user} />;
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