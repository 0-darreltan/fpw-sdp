import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router";
import Dashboard from "./Dashboard";
import UserManagement from "../../components/admin/UserManagement";
import ProductManagement from "../../components/admin/ProductManagement";
import MaterialManagement from "../../components/admin/MaterialManagement";
import OrderManagement from "../../components/admin/OrderManagement";

const AdminDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { currUsers } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Deteksi nested route (create/edit product)
  const isNestedRoute =
    location.pathname.includes("/admin/products/create") ||
    location.pathname.includes("/admin/products/edit");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const renderContent = () => {
    // ✅ Jika nested route, render Outlet
    if (isNestedRoute) {
      return <Outlet />;
    }

    // ✅ Render menu biasa
    switch (activeTab) {
      case "dashboard":
        return <Dashboard data={data} />;

      case "orders":
        return <OrderManagement orders={data?.orders || []} />;

      case "users":
        return <UserManagement users={data?.users || []} />;

      case "products":
        return <ProductManagement />;

      case "materials":
        return <MaterialManagement materials={data?.materials || []} />;

      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500">Pilih menu dari sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    PT. Agung Beton Kendari
                  </h1>
                  <p className="text-xs text-gray-400">
                    Sistem Manajemen Proyek
                  </p>
                </div>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white">
                  {currUsers?.user?.name || "Administrator"}
                </p>
                <p className="text-xs text-gray-400">
                  ({currUsers?.user?.role || "Admin"})
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-0"
        } bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 overflow-hidden`}
      >
        <div className="h-full overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-sm text-gray-400 mt-1">Sistem Manajemen</p>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 p-4 font-medium">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  navigate("/admin");
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "dashboard" && !isNestedRoute
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </button>
            </li>

            {/* Kelola Pesanan */}
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "orders"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl mr-3">📋</span>
                <span>Kelola Pesanan</span>
              </button>
            </li>

            {/* Kelola User */}
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "users"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl mr-3">👥</span>
                <span>Kelola User</span>
              </button>
            </li>

            {/* Kelola Produk */}
            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "products" || isNestedRoute
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl mr-3">📦</span>
                <span>Kelola Produk</span>
              </button>
            </li>

            {/* Kelola Material */}
            <li>
              <button
                onClick={() => setActiveTab("materials")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "materials"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl mr-3">🧱</span>
                <span>Kelola Material</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-24 z-50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-r-lg shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "left-72" : "left-0"
        }`}
        title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isSidebarOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out pt-16 ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
