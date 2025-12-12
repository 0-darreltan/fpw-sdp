import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionProduct } from "../../features/product/productSlice";
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

const InventoryReport = () => {
  const dispatch = useDispatch();
  const { inventoryReport: reportData, loading, error } = useSelector(
    (state) => state.product
  );

  const [filters, setFilters] = useState({
    category: "",
    lowStock: false,
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    dispatch(actionProduct.fetchInventoryReport({}));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyFilters = () => {
    const queryParams = {};
    if (filters.category) queryParams.category = filters.category;
    if (filters.lowStock) queryParams.lowStock = "true";

    dispatch(actionProduct.fetchInventoryReport(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      lowStock: false,
    });
    dispatch(actionProduct.fetchInventoryReport({}));
  };

  // Get unique categories
  const categories = reportData?.products
    ? [...new Set(reportData.products.map((p) => p.category || "Uncategorized"))]
    : [];

  // Chart data for stock by category
  const stockByCategoryData = {
    labels: Object.keys(reportData?.stats?.byCategory || {}),
    datasets: [
      {
        label: "Jumlah Stok",
        data: Object.values(reportData?.stats?.byCategory || {}).map(
          (cat) => cat.totalStock
        ),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const stockOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stok Barang per Kategori",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Chart data for value by category
  const valueByCategoryData = {
    labels: Object.keys(reportData?.stats?.byCategory || {}),
    datasets: [
      {
        label: "Nilai Inventori",
        data: Object.values(reportData?.stats?.byCategory || {}).map(
          (cat) => cat.totalValue
        ),
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(139, 92, 246, 0.6)",
          "rgba(236, 72, 153, 0.6)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const valueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Nilai Inventori per Kategori",
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
          <p className="mt-4 text-gray-600">Memuat laporan inventori...</p>
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
          Laporan Barang Masuk
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="lowStock"
                  checked={filters.lowStock}
                  onChange={handleFilterChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Hanya Stok Menipis ({"<"} 10)
                </span>
              </label>
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
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
                <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                <p className="text-2xl font-bold text-gray-800">
                  {reportData?.stats?.totalProducts || 0}
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stok</p>
                <p className="text-2xl font-bold text-green-600">
                  {reportData?.stats?.totalStock || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">unit</p>
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
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nilai Inventori</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(reportData?.stats?.totalValue || 0)}
                </p>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stok Menipis</p>
                <p className="text-2xl font-bold text-red-600">
                  {reportData?.stats?.lowStockItems || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {reportData?.stats?.outOfStockItems || 0} habis
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stock Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Bar data={stockByCategoryData} options={stockOptions} />
            </div>
          </div>

          {/* Value Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Doughnut data={valueByCategoryData} options={valueOptions} />
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Detail Produk
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData?.products && reportData.products.length > 0 ? (
                  reportData.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}
                          {product.description?.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.stock} {product.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.price * product.stock)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stock === 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Habis
                          </span>
                        ) : product.stock < 10 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Menipis
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Tersedia
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada data produk
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Summary */}
        {reportData?.stats?.byCategory &&
          Object.keys(reportData.stats.byCategory).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Ringkasan per Kategori
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(reportData.stats.byCategory).map(
                  ([category, data]) => (
                    <div
                      key={category}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {category}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          Jumlah Produk:{" "}
                          <span className="font-medium text-gray-900">
                            {data.count}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Total Stok:{" "}
                          <span className="font-medium text-gray-900">
                            {data.totalStock}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Nilai Total:{" "}
                          <span className="font-medium text-gray-900">
                            {formatCurrency(data.totalValue)}
                          </span>
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default InventoryReport;
