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
import { Bar, Doughnut, Line } from "react-chartjs-2";

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

const ProfitReport = () => {
  const dispatch = useDispatch();
  const {
    profitReport: reportData,
    loading,
    error,
  } = useSelector((state) => state.order);

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

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  useEffect(() => {
    dispatch(actionOrder.fetchProfitReport({}));
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

    dispatch(actionOrder.fetchProfitReport(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      orderType: "",
    });
    dispatch(actionOrder.fetchProfitReport({}));
  };

  const stats = reportData?.stats || {};
  const productProfitability = reportData?.productProfitability || [];
  const categoryProfitability = reportData?.categoryProfitability || [];
  const top10Products = productProfitability.slice(0, 10);
  const top5Products = productProfitability.slice(0, 5);

  // Chart - Revenue vs Cost vs Profit
  const revenueBreakdownData = {
    labels: ["Total Penjualan", "HPP", "Laba Kotor", "Laba Bersih"],
    datasets: [
      {
        label: "Nilai (Rp)",
        data: [
          stats.totalRevenue || 0,
          stats.totalCOGS || 0,
          stats.grossProfit || 0,
          stats.netProfit || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const revenueBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Breakdown Penjualan & Keuntungan",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return formatCurrency(context.parsed.y);
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

  // Chart - Top Products Profit
  const topProductsChartData = {
    labels: top10Products.map((p) => p.productName),
    datasets: [
      {
        label: "Profit",
        data: top10Products.map((p) => p.profit),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 10 Produk Paling Profitable",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return formatCurrency(context.parsed.x);
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // Chart - Category Profit Distribution
  const categoryChartData = {
    labels: categoryProfitability.map((c) => c.category),
    datasets: [
      {
        label: "Profit by Category",
        data: categoryProfitability.map((c) => c.profit),
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

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Distribusi Profit per Kategori",
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
            return `${context.label}: ${formatCurrency(
              context.parsed
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Chart - Profit Margin Comparison
  const marginChartData = {
    labels: top5Products.map((p) => p.productName),
    datasets: [
      {
        label: "Revenue",
        data: top5Products.map((p) => p.revenue),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Profit Margin (%)",
        data: top5Products.map((p) => p.profitMargin),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const marginOptions = {
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
        text: "Top 5 - Revenue vs Profit Margin",
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
          text: "Revenue (Rp)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Profit Margin (%)",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat laporan keuntungan...</p>
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
            <span className="text-4xl">💰</span>
            Laporan Keuntungan / Laba Rugi
          </h1>
          <p className="text-gray-600 mt-2">
            Analisis profitabilitas, HPP, dan margin keuntungan
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Semua</option>
                <option value="MATERIAL_PURCHASE">Material Purchase</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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

        {/* Main Profit/Loss Statement */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-t-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 Laporan Laba Rugi (Profit & Loss Statement)
          </h2>

          <div className="space-y-4">
            {/* Revenue Section */}
            <div className="border-b-2 pb-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700">
                  Total Penjualan (Revenue)
                </span>
                <span className="font-bold text-blue-600 text-xl">
                  {formatCurrency(stats.totalRevenue || 0)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Dari {stats.totalOrders || 0} order (
                {stats.totalQuantitySold || 0} item terjual)
              </p>
            </div>

            {/* COGS Section */}
            <div className="border-b-2 pb-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700">
                  Harga Pokok Penjualan / HPP (COGS)
                </span>
                <span className="font-bold text-red-600 text-xl">
                  ({formatCurrency(stats.totalCOGS || 0)})
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Cost of Goods Sold</p>
            </div>

            {/* Gross Profit */}
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-800 text-xl">
                    Laba Kotor (Gross Profit)
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    = Penjualan - HPP
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-700 text-2xl">
                    {formatCurrency(stats.grossProfit || 0)}
                  </span>
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    Margin: {formatPercent(stats.grossProfitMargin || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Operational Costs */}
            <div className="border-b-2 pb-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700">
                  Biaya Operasional (Operational Costs)
                </span>
                <span className="font-bold text-orange-600 text-xl">
                  ({formatCurrency(stats.operationalCosts || 0)})
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Biaya lain-lain (opsional)
              </p>
            </div>

            {/* Net Profit */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center text-white">
                <div>
                  <span className="font-bold text-2xl">
                    Laba Bersih (Net Profit)
                  </span>
                  <p className="text-sm opacity-90 mt-1">
                    = Laba Kotor - Biaya Operasional
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-4xl">
                    {formatCurrency(stats.netProfit || 0)}
                  </span>
                  <p className="text-lg font-semibold mt-1 opacity-90">
                    Margin: {formatPercent(stats.netProfitMargin || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Order Value</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(stats.averageOrderValue || 0)}
                </p>
              </div>
              <div className="text-5xl opacity-80">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Profit per Order</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(stats.averageProfit || 0)}
                </p>
              </div>
              <div className="text-5xl opacity-80">💵</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Gross Margin</p>
                <p className="text-2xl font-bold mt-2">
                  {formatPercent(stats.grossProfitMargin || 0)}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Net: {formatPercent(stats.netProfitMargin || 0)}
                </p>
              </div>
              <div className="text-5xl opacity-80">📈</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "350px" }}>
              <Bar
                data={revenueBreakdownData}
                options={revenueBreakdownOptions}
              />
            </div>
          </div>

          {/* Category Profit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "350px" }}>
              <Doughnut data={categoryChartData} options={categoryOptions} />
            </div>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div style={{ height: "400px" }}>
            <Bar data={topProductsChartData} options={topProductsOptions} />
          </div>
        </div>

        {/* Margin Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div style={{ height: "350px" }}>
            <Line data={marginChartData} options={marginOptions} />
          </div>
        </div>

        {/* Product Profitability Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Detail Profitabilitas per Produk
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HPP/COGS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productProfitability.map((product, index) => {
                  return (
                    <tr
                      key={product.productId}
                      className={`hover:bg-gray-50 ${
                        index < 3 ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-600">
                          {product.quantitySold}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">
                          {formatCurrency(product.cogs)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(product.profit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.profitMargin >= 30
                              ? "bg-green-100 text-green-800"
                              : product.profitMargin >= 15
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatPercent(product.profitMargin)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Profitability Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Profitabilitas per Kategori
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COGS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryProfitability.map((category, index) => {
                  return (
                    <tr
                      key={category.category}
                      className={`hover:bg-gray-50 ${
                        index === 0 ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(category.revenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">
                          {formatCurrency(category.cogs)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(category.profit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.profitMargin >= 30
                              ? "bg-green-100 text-green-800"
                              : category.profitMargin >= 15
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatPercent(category.profitMargin)}
                        </span>
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

export default ProfitReport;
