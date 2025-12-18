import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../../features/order/orderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendAnalysisReport = () => {
  const dispatch = useDispatch();
  const { trendReport, loading, error } = useSelector((state) => state.order);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(actionOrder.fetchTrendAnalysis(filters));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    dispatch(actionOrder.fetchTrendAnalysis(filters));
  };

  const handleResetFilter = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
    };
    setFilters(resetFilters);
    dispatch(actionOrder.fetchTrendAnalysis(resetFilters));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Memuat Laporan Trend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!trendReport) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Tidak ada data laporan trend
        </div>
      </div>
    );
  }

  const {
    stats = {},
    dailyTrend = [],
    weeklyTrend = [],
    monthlyTrend = [],
    dayOfWeekStats = [],
  } = trendReport || {};

  // Format currency
  const formatCurrency = (value) => {
    // Handle NaN, null, undefined
    if (value == null || isNaN(value)) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    // Handle NaN, null, undefined
    if (value == null || isNaN(value)) {
      return "+0.0%";
    }
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Daily Trend Chart Data
  const dailyChartData = {
    labels: dailyTrend.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
    }),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: dailyTrend.map((item) => item.revenue),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "Jumlah Order",
        data: dailyTrend.map((item) => item.orderCount),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        yAxisID: "y1",
        tension: 0.3,
      },
    ],
  };

  const dailyChartOptions = {
    responsive: true,
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
        text: "Trend Harian",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y + " order";
              }
            }
            return label;
          },
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
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Jumlah Order",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Weekly Trend Chart Data
  const weeklyChartData = {
    labels: weeklyTrend.map((item) => item.week),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: weeklyTrend.map((item) => item.revenue),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "Jumlah Order",
        data: weeklyTrend.map((item) => item.orderCount),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        yAxisID: "y1",
        tension: 0.3,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
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
        text: "Trend Mingguan",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y + " order";
              }
            }
            return label;
          },
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
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Jumlah Order",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Monthly Trend Chart Data
  const monthlyChartData = {
    labels: monthlyTrend.map((item) => item.month),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: monthlyTrend.map((item) => item.revenue),
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "Jumlah Order",
        data: monthlyTrend.map((item) => item.orderCount),
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        yAxisID: "y1",
        tension: 0.3,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
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
        text: "Trend Bulanan",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y + " order";
              }
            }
            return label;
          },
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
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Jumlah Order",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Day of Week Chart Data
  const dayOfWeekChartData = {
    labels: dayOfWeekStats.map((item) => item.dayName),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: dayOfWeekStats.map((item) => item.revenue),
        backgroundColor: "rgba(249, 115, 22, 0.7)",
        yAxisID: "y",
      },
      {
        label: "Jumlah Order",
        data: dayOfWeekStats.map((item) => item.orderCount),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        yAxisID: "y1",
      },
    ],
  };

  const dayOfWeekChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performa per Hari dalam Minggu",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y + " order";
              }
            }
            return label;
          },
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
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Jumlah Order",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          📈 Laporan Analisis Trend
        </h1>
        <p className="text-gray-600 mt-2">
          Analisis trend penjualan berdasarkan waktu
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter</h2>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilter}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Terapkan
            </button>
            <button
              onClick={handleResetFilter}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(stats.totalRevenue || 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Total Order</div>
          <div className="text-2xl font-bold mt-1">
            {(stats.totalOrders || 0).toLocaleString("id-ID")}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Rata-rata Order</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(stats.averageOrderValue || 0)}
          </div>
        </div>
        <div
          className={`bg-gradient-to-br ${
            (stats.growthRate || 0) >= 0
              ? "from-emerald-500 to-emerald-600"
              : "from-red-500 to-red-600"
          } text-white p-6 rounded-lg shadow-md`}
        >
          <div className="text-sm opacity-90">Pertumbuhan</div>
          <div className="text-2xl font-bold mt-1">
            {formatPercentage(stats.growthRate || 0)}
          </div>
        </div>
      </div>

      {/* Peak Performance */}
      {stats.peakDay && stats.peakDate && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🏆 Performa Terbaik
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="text-sm text-orange-700 font-medium">
                Hari Terbaik
              </div>
              <div className="text-2xl font-bold text-orange-600 mt-1">
                {stats.peakDay}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Revenue: {formatCurrency(stats.peakDayRevenue || 0)}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="text-sm text-blue-700 font-medium">
                Tanggal Terbaik
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {new Date(stats.peakDate).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Revenue: {formatCurrency(stats.peakDateRevenue || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Daily Trend */}
        {dailyTrend && dailyTrend.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={dailyChartData} options={dailyChartOptions} />
          </div>
        )}

        {/* Weekly Trend */}
        {weeklyTrend && weeklyTrend.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        )}

        {/* Monthly Trend */}
        {monthlyTrend && monthlyTrend.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={monthlyChartData} options={monthlyChartOptions} />
          </div>
        )}

        {/* Day of Week */}
        {dayOfWeekStats && dayOfWeekStats.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar data={dayOfWeekChartData} options={dayOfWeekChartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendAnalysisReport;
