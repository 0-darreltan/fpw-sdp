import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../../features/order/orderSlice";
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

const PaymentReport = () => {
  const dispatch = useDispatch();
  const { salesReport: reportData, loading, error } = useSelector(
    (state) => state.order
  );

  // Filter state
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

  useEffect(() => {
    // Fetch data on component mount
    dispatch(actionOrder.fetchSalesReport({}));
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

    dispatch(actionOrder.fetchSalesReport(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      orderType: "",
    });
    dispatch(actionOrder.fetchSalesReport({}));
  };

  // Calculate payment statistics
  const calculatePaymentStats = () => {
    if (!reportData?.orders) {
      return {
        totalRevenue: 0,
        paidAmount: 0,
        pendingAmount: 0,
        failedAmount: 0,
        paidCount: 0,
        pendingCount: 0,
        failedCount: 0,
      };
    }

    const stats = {
      totalRevenue: 0,
      paidAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      paidCount: 0,
      pendingCount: 0,
      failedCount: 0,
    };

    reportData.orders.forEach((order) => {
      const amount = order.totalAmount || 0;
      stats.totalRevenue += amount;

      if (order.status === "payment_confirmed" || order.status === "completed") {
        stats.paidAmount += amount;
        stats.paidCount++;
      } else if (order.status === "pending") {
        stats.pendingAmount += amount;
        stats.pendingCount++;
      } else {
        stats.failedAmount += amount;
        stats.failedCount++;
      }
    });

    return stats;
  };

  const paymentStats = calculatePaymentStats();

  // Chart data for payment status
  const paymentStatusChartData = {
    labels: ["Sudah Dibayar", "Pending", "Gagal/Batal"],
    datasets: [
      {
        label: "Jumlah Uang",
        data: [
          paymentStats.paidAmount,
          paymentStats.pendingAmount,
          paymentStats.failedAmount,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Green for paid
          "rgba(251, 191, 36, 0.8)", // Yellow for pending
          "rgba(239, 68, 68, 0.8)", // Red for failed
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const paymentStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Status Pembayaran (Jumlah Uang)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            label += formatCurrency(context.parsed);
            return label;
          },
        },
      },
    },
  };

  // Chart data for payment count
  const paymentCountChartData = {
    labels: ["Sudah Dibayar", "Pending", "Gagal/Batal"],
    datasets: [
      {
        label: "Jumlah Transaksi",
        data: [
          paymentStats.paidCount,
          paymentStats.pendingCount,
          paymentStats.failedCount,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(251, 191, 36, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const paymentCountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Jumlah Transaksi per Status Pembayaran",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat laporan pembayaran...</p>
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
          Laporan Pembayaran
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
                <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(paymentStats.totalRevenue)}
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sudah Dibayar</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(paymentStats.paidAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paymentStats.paidCount} transaksi
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(paymentStats.pendingAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paymentStats.pendingCount} transaksi
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gagal/Batal</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(paymentStats.failedAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paymentStats.failedCount} transaksi
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment Status Amount Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Doughnut
                data={paymentStatusChartData}
                options={paymentStatusOptions}
              />
            </div>
          </div>

          {/* Payment Count Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div style={{ height: "400px" }}>
              <Bar data={paymentCountChartData} options={paymentCountOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Detail Transaksi
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData?.orders && reportData.orders.length > 0 ? (
                  reportData.orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.orderType === "MATERIAL_PURCHASE"
                          ? "Material"
                          : "Project"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "payment_confirmed" ||
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status === "payment_confirmed"
                            ? "Dibayar"
                            : order.status === "pending"
                            ? "Pending"
                            : order.status === "completed"
                            ? "Selesai"
                            : "Gagal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada data transaksi
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

export default PaymentReport;
