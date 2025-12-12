import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../features/order/orderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BestSellerReport = () => {
  const dispatch = useDispatch();
  const { outgoingInventory: reportData, loading, error } = useSelector(
    (state) => state.order
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    orderType: "",
  });

  const [viewMode, setViewMode] = useState("quantity"); // quantity or revenue

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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

  // Get top products
  const topProducts = reportData?.products?.slice(0, 20) || [];
  const top5Products = topProducts.slice(0, 5);

  // Bar chart - Top 10 by selected view mode
  const top10ByView = topProducts.slice(0, 10);
  const barChartData = {
    labels: top10ByView.map((p) => p.productName),
    datasets: [
      {
        label: viewMode === "quantity" ? "Quantity Terjual" : "Revenue",
        data: top10ByView.map((p) =>
          viewMode === "quantity" ? p.totalQuantity : p.totalRevenue
        ),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Top 10 Produk Terlaris by ${
          viewMode === "quantity" ? "Quantity" : "Revenue"
        }`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (viewMode === "revenue") {
              return formatCurrency(context.parsed.y);
            }
            return `${context.parsed.y} unit`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pie chart - Top 5 market share by revenue
  const pieChartData = {
    labels: top5Products.map((p) => p.productName),
    datasets: [
      {
        label: "Revenue Share",
        data: top5Products.map((p) => p.totalRevenue),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Top 5 Revenue Share",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Line chart - Quantity vs Revenue trend for top 5
  const lineChartData = {
    labels: top5Products.map((p) => p.productName),
    datasets: [
      {
        label: "Quantity Terjual",
        data: top5Products.map((p) => p.totalQuantity),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Revenue (dalam jutaan)",
        data: top5Products.map((p) => p.totalRevenue / 1000000),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 5 - Quantity vs Revenue",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Quantity",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Revenue (Juta Rp)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat laporan best seller...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan Barang Paling Laris
          </h1>
          <p className="text-gray-600 mt-2">
            Analisis produk terlaris berdasarkan penjualan dan revenue
          </p>
        </div>

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

        {/* Top 3 Products - Podium Style */}
        {topProducts.length >= 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🏆 Top 3 Best Sellers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-6xl mb-3">🥈</div>
                  <div className="text-sm text-gray-600 mb-1">2nd Place</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 min-h-[3rem]">
                    {topProducts[1].productName}
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Terjual</p>
                      <p className="text-xl font-bold text-gray-800">
                        {topProducts[1].totalQuantity} {topProducts[1].unit}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatCurrency(topProducts[1].totalRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg p-6 text-center transform md:scale-110 hover:scale-115 transition-transform shadow-xl">
                  <div className="text-7xl mb-3">🥇</div>
                  <div className="text-sm text-gray-800 mb-1 font-semibold">
                    1st Place - Champion!
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[3rem]">
                    {topProducts[0].productName}
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Terjual</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {topProducts[0].totalQuantity} {topProducts[0].unit}
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {formatCurrency(topProducts[0].totalRevenue)}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {topProducts[0].orderCount} order
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-6xl mb-3">🥉</div>
                  <div className="text-sm text-gray-600 mb-1">3rd Place</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 min-h-[3rem]">
                    {topProducts[2].productName}
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Terjual</p>
                      <p className="text-xl font-bold text-gray-800">
                        {topProducts[2].totalQuantity} {topProducts[2].unit}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatCurrency(topProducts[2].totalRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Tampilan Grafik
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("quantity")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === "quantity"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                By Quantity
              </button>
              <button
                onClick={() => setViewMode("revenue")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === "revenue"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                By Revenue
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Pie data={pieChartData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div style={{ height: "400px" }}>
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Ranking Detail Produk
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty Terjual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg/Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => {
                  const avgPerOrder = product.totalRevenue / product.orderCount;
                  return (
                    <tr
                      key={product.productId}
                      className={`hover:bg-gray-50 ${
                        index < 3 ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                            index === 0
                              ? "bg-yellow-400 text-yellow-900"
                              : index === 1
                              ? "bg-gray-300 text-gray-900"
                              : index === 2
                              ? "bg-orange-300 text-orange-900"
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
                        <div className="text-sm font-bold text-blue-600">
                          {product.totalQuantity} {product.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.orderCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatCurrency(avgPerOrder)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerReport;
