import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionProduct } from "../../../features/product/productSlice";
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

const LowStockReport = () => {
  const dispatch = useDispatch();
  const { lowStockReport: reportData, loading, error } = useSelector(
    (state) => state.product
  );

  const [filters, setFilters] = useState({
    threshold: "10",
    category: "",
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    dispatch(actionProduct.fetchLowStockReport({ threshold: 10 }));
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
    if (filters.threshold) queryParams.threshold = filters.threshold;
    if (filters.category) queryParams.category = filters.category;

    dispatch(actionProduct.fetchLowStockReport(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      threshold: "10",
      category: "",
    });
    dispatch(actionProduct.fetchLowStockReport({ threshold: 10 }));
  };

  // Get data
  const critical = reportData?.critical || [];
  const veryLow = reportData?.veryLow || [];
  const low = reportData?.low || [];
  const moderateLow = reportData?.moderateLow || [];
  const allItems = reportData?.allItems || [];
  const stats = reportData?.stats || {};
  const threshold = reportData?.threshold || 10;

  // Get unique categories
  const categories = [...new Set(allItems.map((item) => item.category))];

  // Chart - Stock Status Distribution
  const statusChartData = {
    labels: ["Critical (0)", "Very Low", "Low", "Moderate Low"],
    datasets: [
      {
        label: "Jumlah Produk",
        data: [
          stats.criticalCount || 0,
          stats.veryLowCount || 0,
          stats.lowCount || 0,
          stats.moderateLowCount || 0,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribusi Status Stok",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  };

  // Chart - Category Distribution
  const categoryData = {};
  Object.keys(stats.byCategory || {}).forEach((cat) => {
    categoryData[cat] = stats.byCategory[cat].count;
  });

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Produk Low Stock",
        data: Object.values(categoryData),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Low Stock by Category",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      IMMEDIATE: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: "🚨",
        text: "SEGERA",
      },
      URGENT: {
        color: "bg-orange-100 text-orange-800 border-orange-300",
        icon: "⚠️",
        text: "URGENT",
      },
      HIGH: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: "⚡",
        text: "HIGH",
      },
      MEDIUM: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: "📌",
        text: "MEDIUM",
      },
    };
    return badges[urgency] || badges.MEDIUM;
  };

  const getStatusBadge = (status) => {
    const badges = {
      CRITICAL: {
        color: "bg-red-600 text-white",
        text: "HABIS",
      },
      VERY_LOW: {
        color: "bg-orange-500 text-white",
        text: "SANGAT RENDAH",
      },
      LOW: {
        color: "bg-yellow-500 text-white",
        text: "RENDAH",
      },
      MODERATE_LOW: {
        color: "bg-blue-500 text-white",
        text: "CUKUP RENDAH",
      },
    };
    return badges[status] || badges.MODERATE_LOW;
  };

  const renderProductCard = (product) => {
    const urgency = getUrgencyBadge(product.urgency);
    const status = getStatusBadge(product.status);

    return (
      <div
        key={product._id}
        className={`border-2 rounded-lg p-4 transition-all hover:shadow-lg ${
          product.status === "CRITICAL"
            ? "border-red-500 bg-red-50"
            : product.status === "VERY_LOW"
            ? "border-orange-400 bg-orange-50"
            : product.status === "LOW"
            ? "border-yellow-400 bg-yellow-50"
            : "border-blue-400 bg-blue-50"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded p-2 border">
            <p className="text-xs text-gray-600">Stok Tersisa</p>
            <p className="text-2xl font-bold text-red-600">
              {product.stock} {product.unit}
            </p>
          </div>
          <div className="bg-white rounded p-2 border">
            <p className="text-xs text-gray-600">Harga</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded p-2 border mb-3">
          <p className="text-xs text-gray-600">Nilai Total Stok</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(product.price * product.stock)}
          </p>
        </div>

        <div className={`flex items-center gap-2 p-2 rounded border-2 ${urgency.color}`}>
          <span className="text-xl">{urgency.icon}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold">{urgency.text}</p>
            <p className="text-xs">
              Estimasi habis: {product.daysUntilEmpty} hari
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600">Perlu Restock:</p>
          <p className="font-bold text-purple-600">
            {threshold - product.stock} {product.unit}
          </p>
          <p className="text-xs text-gray-500">
            Nilai: {formatCurrency(product.price * (threshold - product.stock))}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat laporan stok menipis...</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">⚠️</span>
            Laporan Stok Menipis
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor dan kelola produk yang perlu segera direstock
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Threshold
              </label>
              <input
                type="number"
                name="threshold"
                value={filters.threshold}
                onChange={handleFilterChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Minimal 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">CRITICAL</p>
                <p className="text-3xl font-bold mt-2">{stats.criticalCount || 0}</p>
                <p className="text-xs opacity-75">Stok Habis</p>
              </div>
              <div className="text-5xl opacity-80">🚨</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">VERY LOW</p>
                <p className="text-3xl font-bold mt-2">{stats.veryLowCount || 0}</p>
                <p className="text-xs opacity-75">Sangat Menipis</p>
              </div>
              <div className="text-5xl opacity-80">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">LOW STOCK</p>
                <p className="text-3xl font-bold mt-2">{stats.lowCount || 0}</p>
                <p className="text-xs opacity-75">Stok Rendah</p>
              </div>
              <div className="text-5xl opacity-80">⚡</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">MODERATE</p>
                <p className="text-3xl font-bold mt-2">{stats.moderateLowCount || 0}</p>
                <p className="text-xs opacity-75">Perlu Perhatian</p>
              </div>
              <div className="text-5xl opacity-80">📌</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Total Informasi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Total Produk Low Stock:</span>
                <span className="font-bold text-lg text-red-600">
                  {stats.totalLowStockItems || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Nilai Stok Saat Ini:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(stats.totalValue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimasi Restock:</span>
                <span className="font-bold text-purple-600">
                  {formatCurrency(stats.estimatedRestockValue || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 opacity-90">
              Threshold Setting
            </h3>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{threshold} unit</p>
              <p className="text-sm opacity-90">
                Produk dengan stok ≤ {threshold} akan ditampilkan
              </p>
              <div className="mt-4 pt-4 border-t border-purple-400">
                <p className="text-xs opacity-75">Kategori Level:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-xs">
                    <span className="font-semibold">Critical:</span> 0
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Very Low:</span> 1-{Math.ceil(threshold / 4)}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Low:</span> {Math.ceil(threshold / 4) + 1}-{Math.ceil(threshold / 2)}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Moderate:</span> {Math.ceil(threshold / 2) + 1}-{threshold}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "300px" }}>
              <Bar data={statusChartData} options={statusChartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "300px" }}>
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>
          </div>
        </div>

        {/* Critical Items - SEGERA */}
        {critical.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-600 text-white rounded-t-lg p-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">🚨</span>
                CRITICAL - Stok Habis ({critical.length})
              </h2>
              <p className="text-sm opacity-90 mt-1">
                Produk ini HABIS! Perlu restok SEGERA
              </p>
            </div>
            <div className="bg-white rounded-b-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {critical.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {/* Very Low Items - URGENT */}
        {veryLow.length > 0 && (
          <div className="mb-6">
            <div className="bg-orange-500 text-white rounded-t-lg p-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                VERY LOW - Sangat Menipis ({veryLow.length})
              </h2>
              <p className="text-sm opacity-90 mt-1">
                Stok sangat rendah, perlu restok URGENT
              </p>
            </div>
            <div className="bg-white rounded-b-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {veryLow.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {/* Low Items */}
        {low.length > 0 && (
          <div className="mb-6">
            <div className="bg-yellow-500 text-white rounded-t-lg p-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                LOW STOCK - Stok Rendah ({low.length})
              </h2>
              <p className="text-sm opacity-90 mt-1">
                Perlu perencanaan restok segera
              </p>
            </div>
            <div className="bg-white rounded-b-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {low.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {/* Moderate Low Items */}
        {moderateLow.length > 0 && (
          <div className="mb-6">
            <div className="bg-blue-500 text-white rounded-t-lg p-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">📌</span>
                MODERATE LOW - Perlu Perhatian ({moderateLow.length})
              </h2>
              <p className="text-sm opacity-90 mt-1">
                Stok cukup rendah, perlu monitoring
              </p>
            </div>
            <div className="bg-white rounded-b-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moderateLow.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {allItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Semua Stok Aman!
            </h3>
            <p className="text-gray-600">
              Tidak ada produk yang perlu direstock saat ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockReport;
