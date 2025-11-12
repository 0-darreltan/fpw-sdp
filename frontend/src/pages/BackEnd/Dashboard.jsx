import React from "react";

const Dashboard = ({ data }) => {
  const stats = [
    {
      id: "orders",
      label: "Total Pesanan",
      icon: "📋",
      count: data?.orders?.length || 0,
      color: "blue",
    },
    {
      id: "users",
      label: "Total User",
      icon: "👥",
      count: data?.users?.length || 0,
      color: "green",
    },
    {
      id: "products",
      label: "Total Produk",
      icon: "📦",
      count: data?.products?.length || 0,
      color: "purple",
    },
    {
      id: "projects",
      label: "Proyek Aktif",
      icon: "🏗️",
      count: data?.projects?.length || 0,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                📝
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Pesanan baru masuk
                </p>
                <p className="text-xs text-gray-500">2 menit yang lalu</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Grafik Penjualan
          </h3>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Proyek
          </h3>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
