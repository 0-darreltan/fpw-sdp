import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../../features/order/orderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesReport = () => {
  const dispatch = useDispatch();
  const { salesReport: reportData, loading, error } = useSelector(
    (state) => state.order
  );

  // Filter state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    orderType: "",
    status: "",
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    dispatch(actionOrder.fetchSalesReport(filters));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilter = () => {
    dispatch(actionOrder.fetchSalesReport(filters));
  };

  const handleResetFilter = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      orderType: "",
      status: "",
    };
    setFilters(resetFilters);
    dispatch(actionOrder.fetchSalesReport(resetFilters));
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      payment_confirmed: "Pembayaran Dikonfirmasi",
      processing: "Diproses",
      shipping: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      payment_confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      shipping: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusConfig[status] || "bg-gray-100 text-gray-800";
  };

  const exportToCSV = () => {
    if (!reportData || !reportData.orders) return;

    const headers = [
      "Nomor Order",
      "Tanggal",
      "Customer",
      "Tipe Order",
      "Status",
      "Total",
    ];

    const rows = reportData.orders.map((order) => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString("id-ID"),
      order.customerId?.name || "-",
      order.orderType,
      getStatusLabel(order.status),
      order.totalAmount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `laporan_penjualan_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Chart Data Generators
  const getRevenueChartData = () => {
    if (!reportData) return null;
    
    return {
      labels: ['Project', 'Pembelian Material'],
      datasets: [{
        data: [
          reportData.summary.revenueByType.PROJECT,
          reportData.summary.revenueByType.MATERIAL_PURCHASE
        ],
        backgroundColor: ['#3B82F6', '#A855F7'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  const getOrderTypeChartData = () => {
    if (!reportData) return null;
    
    return {
      labels: ['Project', 'Pembelian Material'],
      datasets: [{
        label: 'Jumlah Pesanan',
        data: [
          reportData.summary.ordersByType.PROJECT,
          reportData.summary.ordersByType.MATERIAL_PURCHASE
        ],
        backgroundColor: ['#3B82F6', '#A855F7'],
        borderWidth: 0,
        borderRadius: 8
      }]
    };
  };

  const getStatusChartData = () => {
    if (!reportData) return null;
    
    const statusLabels = Object.keys(reportData.summary.ordersByStatus).map(getStatusLabel);
    const statusData = Object.values(reportData.summary.ordersByStatus);
    
    return {
      labels: statusLabels,
      datasets: [{
        data: statusData,
        backgroundColor: [
          '#3B82F6', '#FBBF24', '#A855F7', '#10B981', '#EF4444'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  const getTrendChartData = () => {
    if (!reportData || !reportData.orders.length) return null;
    
    // Group orders by date
    const dateMap = {};
    reportData.orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (!dateMap[date]) {
        dateMap[date] = 0;
      }
      dateMap[date] += order.totalAmount;
    });

    const sortedDates = Object.keys(dateMap).sort((a, b) => {
      return new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'));
    });

    return {
      labels: sortedDates,
      datasets: [{
        label: 'Pendapatan Harian',
        data: sortedDates.map(date => dateMap[date]),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6'
      }]
    };
  };

  // Chart Options
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Pendapatan Berdasarkan Tipe Order',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed);
          }
        }
      }
    }
  };

  const orderTypeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Jumlah Pesanan Berdasarkan Tipe',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: 'Status Pesanan',
        font: { size: 16, weight: 'bold' }
      }
    }
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Tren Pendapatan',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000000).toFixed(1) + 'jt';
          }
        }
      }
    }
  };

  if (loading && !reportData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Laporan Penjualan
        </h2>
        <button
          onClick={exportToCSV}
          disabled={!reportData?.orders?.length}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === 'string' ? error : 'Gagal memuat laporan'}
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Laporan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Order
            </label>
            <select
              name="orderType"
              value={filters.orderType}
              onChange={handleFilterChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Semua</option>
              <option value="PROJECT">Project</option>
              <option value="MATERIAL_PURCHASE">Pembelian Material</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Semua</option>
              <option value="payment_confirmed">Pembayaran Dikonfirmasi</option>
              <option value="processing">Diproses</option>
              <option value="shipping">Dikirim</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleApplyFilter}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Memuat..." : "Terapkan Filter"}
          </button>
          <button
            onClick={handleResetFilter}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary Section */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Total Pesanan</div>
              <div className="text-3xl font-bold text-gray-800 mt-2">
                {reportData.summary.totalOrders}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Total Pendapatan</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(reportData.summary.totalRevenue)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Pesanan Project</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                {reportData.summary.ordersByType.PROJECT}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(reportData.summary.revenueByType.PROJECT)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Pembelian Material</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">
                {reportData.summary.ordersByType.MATERIAL_PURCHASE}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(reportData.summary.revenueByType.MATERIAL_PURCHASE)}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Type Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div style={{ height: '300px' }}>
                {getRevenueChartData() && (
                  <Doughnut 
                    data={getRevenueChartData()} 
                    options={revenueChartOptions} 
                  />
                )}
              </div>
            </div>

            {/* Order Count by Type Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div style={{ height: '300px' }}>
                {getOrderTypeChartData() && (
                  <Bar 
                    data={getOrderTypeChartData()} 
                    options={orderTypeChartOptions} 
                  />
                )}
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div style={{ height: '300px' }}>
                {getStatusChartData() && (
                  <Pie 
                    data={getStatusChartData()} 
                    options={statusChartOptions} 
                  />
                )}
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div style={{ height: '300px' }}>
                {getTrendChartData() && (
                  <Line 
                    data={getTrendChartData()} 
                    options={trendChartOptions} 
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orders Table */}
      {reportData && reportData.orders.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
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
                {reportData.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerId?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.orderType === "PROJECT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.orderType === "PROJECT"
                          ? "Project"
                          : "Material"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportData && reportData.orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak Ada Data
          </h3>
          <p className="text-gray-500">
            Tidak ada pesanan yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
