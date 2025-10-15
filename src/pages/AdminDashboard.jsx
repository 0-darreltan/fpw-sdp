import React, { useState } from 'react';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import ProjectMonitoring from "../components/ProjectMonitoring";

const AdminDashboard = ({
  user,
  data,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onAddProject,
  onUpdateProject,
}) => {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    {
      id: "orders",
      label: "Kelola Pesanan",
      icon: "📋",
      count: data.orders.length,
    },
    {
      id: "projects",
      label: "Monitor Proyek",
      icon: "🏗️",
      count: data.projects.length,
    },
    { id: "users", label: "Kelola User", icon: "👥", count: data.users.length },
    {
      id: "products",
      label: "Kelola Produk",
      icon: "📦",
      count: data.products.length,
    },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "orders":
        return (
          <OrderManagement orders={data.orders} onUpdateOrder={onUpdateOrder} />
        );
      case "projects":
        return (
          <ProjectMonitoring
            projects={data.projects}
            orders={data.orders}
            users={data.users}
            onAddProject={onAddProject}
            onUpdateProject={onUpdateProject}
          />
        );
      case "users":
        return (
          <UserManagement
            users={data.users}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        );
      case "products":
        return (
          <ProductManagement
            products={data.products}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      default:
        return (
          <OrderManagement orders={data.orders} onUpdateOrder={onUpdateOrder} />
        );
    }
  };

  const getTabLabel = (tab) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{tab.icon}</span>
        <span className="hidden sm:inline">{tab.label}</span>
        {tab.count > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {tab.count}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Administrator
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Selamat datang, {user?.name}! Panel kontrol sistem manajemen proyek
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📋</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {data.orders.length}
                </h3>
                <p className="text-gray-600 text-sm">Total Pesanan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {data.users.length}
                </h3>
                <p className="text-gray-600 text-sm">Total User</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {data.products.length}
                </h3>
                <p className="text-gray-600 text-sm">Total Produk</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏗️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {data.projects.length}
                </h3>
                <p className="text-gray-600 text-sm">Proyek Aktif</p>
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
                  {getTabLabel(tab)}
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

export default AdminDashboard;