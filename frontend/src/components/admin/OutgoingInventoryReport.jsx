import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../features/order/orderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const OutgoingInventoryReport = () => {
  const dispatch = useDispatch();
  const { outgoingInventory: reportData, loading, error } = useSelector(
    (state) => state.order
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    orderType: "",
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    dispatch(actionOrder.fetchOutgoingInventory({}));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const queryParams = {};
    if (filters.startDate) queryParams.startDate = filters.startDate;
    if (filters.endDate) queryParams.endDate = filters.endDate;
    if (filters.orderType) queryParams.orderType = filters.orderType;

    dispatch(actionOrder.fetchOutgoingInventory(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      orderType: "",
    });
    dispatch(actionOrder.fetchOutgoingInventory({}));
  };

  // Top 10 products for chart
  const top10Products = reportData?.products?.slice(0, 10) || [];

  // Chart data for quantity sold
  const quantityChartData = {
    labels: top10Products.map((p) => p.productName),
    datasets: [
      {
        label: "Jumlah Terjual",
        data: top10Products.map((p) => p.totalQuantity),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  const quantityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 10 Produk Terlaris (Quantity)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: top10Products.map((p) => p.productName),
    datasets: [
      {
        label: "Revenue",
        data: top10Products.map((p) => p.totalRevenue),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(244, 63, 94, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(244, 63, 94, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 10 Produk by Revenue",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return formatCurrency(context.parsed);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat laporan barang keluar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Laporan Barang Keluar
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Order
              </label>
              <select
                name="orderType"
                value={filters.orderType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua</option>
                <option value="MATERIAL_PURCHASE">Material Purchase</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Terapkan
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Order</p>
                <p className="text-2xl font-bold text-gray-800">
                  {reportData?.stats?.totalOrders || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Item Keluar</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reportData?.stats?.totalItemsSold || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">unit</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(reportData?.stats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Produk Unik</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reportData?.stats?.uniqueProducts || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">jenis produk</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Quantity Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Bar data={quantityChartData} options={quantityOptions} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Doughnut data={revenueChartData} options={revenueOptions} />
            </div>
          </div>
        </div>

        {/* Top Selling Product Highlight */}
        {reportData?.stats?.topSellingProduct && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              🏆 Produk Terlaris
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-90">Nama Produk</p>
                <p className="text-xl font-bold">
                  {reportData.stats.topSellingProduct.productName}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Terjual</p>
                <p className="text-xl font-bold">
                  {reportData.stats.topSellingProduct.totalQuantity}{" "}
                  {reportData.stats.topSellingProduct.unit}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-xl font-bold">
                  {formatCurrency(
                    reportData.stats.topSellingProduct.totalRevenue
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Detail Produk Keluar
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty Terjual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData?.products && reportData.products.length > 0 ? (
                  reportData.products.map((product, index) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                              ? "bg-gray-200 text-gray-800"
                              : index === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.totalQuantity} {product.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.orderCount} order
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.totalRevenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada data barang keluar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingInventoryReport;
