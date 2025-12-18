import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../../features/order/orderSlice";
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

const CustomerLoyaltyReport = () => {
  const dispatch = useDispatch();
  const { customerLoyalty: reportData, loading, error } = useSelector(
    (state) => state.order
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [viewMode, setViewMode] = useState("spending"); // spending or frequency

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    dispatch(actionOrder.fetchCustomerLoyalty({}));
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

    dispatch(actionOrder.fetchCustomerLoyalty(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
    });
    dispatch(actionOrder.fetchCustomerLoyalty({}));
  };

  // Get customer data
  const customers = reportData?.customers || [];
  const stats = reportData?.stats || {};
  const top10Customers = customers.slice(0, 10);
  const top5Customers = customers.slice(0, 5);

  // Bar chart - Top 10 by selected view mode
  const barChartData = {
    labels: top10Customers.map((c) => c.customerName),
    datasets: [
      {
        label: viewMode === "spending" ? "Total Spent" : "Total Orders",
        data: top10Customers.map((c) =>
          viewMode === "spending" ? c.totalSpent : c.totalOrders
        ),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Top 10 Loyal Customers by ${
          viewMode === "spending" ? "Spending" : "Order Frequency"
        }`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (viewMode === "spending") {
              return formatCurrency(context.parsed.x);
            }
            return `${context.parsed.x} orders`;
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

  // Doughnut chart - Top 5 revenue share
  const doughnutChartData = {
    labels: top5Customers.map((c) => c.customerName),
    datasets: [
      {
        label: "Revenue Share",
        data: top5Customers.map((c) => c.totalSpent),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Top 5 Revenue Contribution",
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

  // Line chart - Orders vs Spending for top 5
  const lineChartData = {
    labels: top5Customers.map((c) => c.customerName),
    datasets: [
      {
        label: "Total Orders",
        data: top5Customers.map((c) => c.totalOrders),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Spending (dalam jutaan)",
        data: top5Customers.map((c) => c.totalSpent / 1000000),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
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
        text: "Top 5 - Orders vs Spending",
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
          text: "Total Orders",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Spending (Juta Rp)",
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
          <p className="mt-4 text-gray-600">Memuat laporan loyalitas customer...</p>
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
            Laporan Customer Paling Loyal
          </h1>
          <p className="text-gray-600 mt-2">
            Analisis pelanggan berdasarkan pembelian dan frekuensi transaksi
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Customers</p>
                <p className="text-3xl font-bold mt-2">{stats.totalCustomers || 0}</p>
              </div>
              <div className="text-5xl opacity-80">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders || 0}</p>
              </div>
              <div className="text-5xl opacity-80">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(stats.totalRevenue || 0)}
                </p>
              </div>
              <div className="text-5xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg per Customer</p>
                <p className="text-xl font-bold mt-2">
                  {formatCurrency(stats.averageSpentPerCustomer || 0)}
                </p>
              </div>
              <div className="text-5xl opacity-80">📊</div>
            </div>
          </div>
        </div>

        {/* Top 3 Customers - Podium Style */}
        {customers.length >= 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🏆 Top 3 Most Loyal Customers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-6xl mb-3">🥈</div>
                  <div className="text-sm text-gray-600 mb-1">2nd Place</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 min-h-[3rem] flex items-center justify-center">
                    {customers[1].customerName}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{customers[1].customerEmail}</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Total Spent</p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatCurrency(customers[1].totalSpent)}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-xl font-bold text-gray-800">
                        {customers[1].totalOrders}
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
                    1st Place - VIP Customer!
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3rem] flex items-center justify-center">
                    {customers[0].customerName}
                  </h3>
                  <p className="text-xs text-gray-800 mb-3">{customers[0].customerEmail}</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Total Spent</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {formatCurrency(customers[0].totalSpent)}
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {customers[0].totalOrders}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Avg/Order</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatCurrency(customers[0].averageOrderValue)}
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
                  <h3 className="text-lg font-bold text-gray-800 mb-2 min-h-[3rem] flex items-center justify-center">
                    {customers[2].customerName}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{customers[2].customerEmail}</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Total Spent</p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatCurrency(customers[2].totalSpent)}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-xl font-bold text-gray-800">
                        {customers[2].totalOrders}
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
                onClick={() => setViewMode("spending")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === "spending"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                By Spending
              </button>
              <button
                onClick={() => setViewMode("frequency")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === "frequency"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                By Frequency
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

          {/* Doughnut Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
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
            Detail Customer Loyalty
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg/Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Since
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer, index) => {
                  return (
                    <tr
                      key={customer.customerId}
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
                          {customer.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.customerPhone || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-600">
                          {customer.totalOrders}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.totalItems} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(customer.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatCurrency(customer.averageOrderValue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(customer.firstOrderDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.customerLifetimeDays} days
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

export default CustomerLoyaltyReport;
