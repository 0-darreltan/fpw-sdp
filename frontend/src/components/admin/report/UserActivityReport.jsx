import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionUser } from "../../../features/users/userSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserActivityReport = () => {
  const dispatch = useDispatch();
  const { activityReport, loading, error } = useSelector(
    (state) => state.users || {}
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    role: "",
  });

  useEffect(() => {
    console.log("🚀 Component mounted, fetching data...");
    console.log("🔍 Initial filters:", filters);
    dispatch(actionUser.fetchUserActivityReport(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya run sekali saat component mount

  // Debug: Log activityReport untuk melihat struktur data
  useEffect(() => {
    console.log("📦 Redux State Update:");
    console.log("  - loading:", loading);
    console.log("  - error:", error);
    console.log("  - activityReport:", activityReport);

    if (activityReport) {
      console.log("📊 Activity Report Details:");
      console.log("  - Has stats?", !!activityReport.stats);
      console.log("  - Stats:", activityReport.stats);
      console.log("  - Users count:", activityReport.users?.length || 0);
      console.log("  - Role Distribution:", activityReport.roleDistribution);
      console.log("  - Activity Timeline:", activityReport.activityTimeline);
      console.log(
        "  - Recent Activities count:",
        activityReport.recentActivities?.length || 0
      );
    }
  }, [activityReport, loading, error]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    dispatch(actionUser.fetchUserActivityReport(filters));
  };

  const handleResetFilter = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      role: "",
    };
    setFilters(resetFilters);
    dispatch(actionUser.fetchUserActivityReport(resetFilters));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Memuat Laporan Aktivitas User...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("❌ Error state:", error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold mb-2">Error:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">
            Silakan cek console browser untuk detail lebih lanjut (F12)
          </p>
        </div>
      </div>
    );
  }

  // Check if activityReport exists and has data
  if (!activityReport) {
    console.warn("⚠️ activityReport is null or undefined");
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Tidak ada data aktivitas user</p>
          <p className="text-sm mt-2">Loading: {loading ? "Ya" : "Tidak"}</p>
          <p className="text-sm">
            Silakan cek console browser (F12) untuk melihat data yang diterima
          </p>
        </div>
      </div>
    );
  }

  if (!activityReport.stats) {
    console.warn(
      "⚠️ activityReport exists but stats is missing:",
      activityReport
    );
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Data tidak lengkap - stats tidak ditemukan</p>
          <p className="text-sm mt-2">Data yang diterima:</p>
          <pre className="text-xs mt-1 bg-white p-2 rounded">
            {JSON.stringify(Object.keys(activityReport), null, 2)}
          </pre>
          <p className="text-sm mt-2">
            Silakan cek console browser (F12) untuk detail
          </p>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering component with valid data");

  const { stats, users, roleDistribution, activityTimeline, recentActivities } =
    activityReport;

  // Helper function to safely format date
  const safeFormatDate = (dateString, formatOptions) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("id-ID", formatOptions);
    } catch (error) {
      console.log({ error });

      return "Invalid Date";
    }
  };

  // Helper function to safely format datetime
  const safeFormatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString("id-ID");
    } catch (error) {
      console.log({ error });

      return "Invalid Date";
    }
  };

  // Role Distribution Chart Data
  const roleChartData = {
    labels: (roleDistribution || []).map((item) => item.role),
    datasets: [
      {
        label: "Jumlah User",
        data: (roleDistribution || []).map((item) => item.userCount),
        backgroundColor: [
          "rgba(249, 115, 22, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
      },
    ],
  };

  const roleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Distribusi User per Role",
        font: { size: 16 },
      },
    },
  };

  // Activity Timeline Chart Data
  const timelineChartData = {
    labels: (activityTimeline || []).map((item) =>
      safeFormatDate(item.date, { day: "2-digit", month: "short" })
    ),
    datasets: [
      {
        label: "Total Aktivitas",
        data: (activityTimeline || []).map((item) => item.totalActivities),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "User Aktif",
        data: (activityTimeline || []).map((item) => item.uniqueUsers),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        yAxisID: "y1",
        tension: 0.3,
      },
    ],
  };

  const timelineChartOptions = {
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
        text: "Timeline Aktivitas User",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Total Aktivitas",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "User Aktif",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Activity Type Chart Data
  const activityTypeData = (activityTimeline || []).reduce(
    (acc, day) => {
      acc.CREATE += day.actions.CREATE || 0;
      acc.UPDATE += day.actions.UPDATE || 0;
      acc.DELETE += day.actions.DELETE || 0;
      acc.VIEW += day.actions.VIEW || 0;
      acc.LOGIN += day.actions.LOGIN || 0;
      return acc;
    },
    { CREATE: 0, UPDATE: 0, DELETE: 0, VIEW: 0, LOGIN: 0 }
  );

  const activityTypeChartData = {
    labels: Object.keys(activityTypeData),
    datasets: [
      {
        label: "Jumlah Aktivitas",
        data: Object.values(activityTypeData),
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(249, 115, 22, 0.7)",
        ],
      },
    ],
  };

  const activityTypeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Distribusi Tipe Aktivitas",
        font: { size: 16 },
      },
    },
  };

  // Get badge color based on activity count
  const getActivityBadge = (count) => {
    if (count === 0) return "bg-gray-100 text-gray-600";
    if (count < 10) return "bg-blue-100 text-blue-700";
    if (count < 50) return "bg-green-100 text-green-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          👥 Laporan Aktivitas User
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor aktivitas dan engagement pengguna
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Semua Role</option>
              <option value="Admin">Admin</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Customer">Customer</option>
            </select>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Total User</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.totalUsers || 0}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Aktif (30 Hari)</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.activeUsers30d || 0}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">Aktif (7 Hari)</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.activeUsers7d || 0}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">User Baru (30 Hari)</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.newUsers30d || 0}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm opacity-90">User Tidak Aktif</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.inactiveUsers || 0}
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Role Distribution */}
        {roleDistribution && roleDistribution.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Doughnut data={roleChartData} options={roleChartOptions} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-gray-500">Tidak ada data distribusi role</p>
          </div>
        )}

        {/* Activity Type Distribution */}
        {activityTimeline && activityTimeline.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar
              data={activityTypeChartData}
              options={activityTypeChartOptions}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <p className="text-gray-500">Tidak ada data tipe aktivitas</p>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      {activityTimeline && activityTimeline.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <Line data={timelineChartData} options={timelineChartOptions} />
        </div>
      )}

      {/* Most Active User */}
      {stats?.mostActiveUser && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🏆 User Paling Aktif
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Nama</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.mostActiveUser.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Role</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.mostActiveUser.role}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-xl font-bold text-gray-800">
                  {stats.mostActiveUser.email}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Aktivitas</div>
                <div className="text-xl font-bold text-orange-600">
                  {stats.mostActiveUser.activityCount} aktivitas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Most Active Users */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          🔥 Top 10 User Teraktif
        </h2>
        {users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Aktivitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terakhir Aktif
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 10).map((user, index) => (
                  <tr
                    key={user.userId}
                    className={index < 3 ? "bg-orange-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && (
                          <span className="text-gray-600 font-medium">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityBadge(
                          user.activityCount
                        )}`}
                      >
                        {user.activityCount} aktivitas
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastActive
                        ? safeFormatDateTime(user.lastActive)
                        : "Tidak ada aktivitas"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Belum ada data user
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📝 Aktivitas Terbaru
        </h2>
        {recentActivities && recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 20).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.action === "CREATE"
                        ? "bg-green-500"
                        : activity.action === "UPDATE"
                        ? "bg-blue-500"
                        : activity.action === "DELETE"
                        ? "bg-red-500"
                        : activity.action === "LOGIN"
                        ? "bg-orange-500"
                        : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.userId?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.userId?.email || "-"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">{activity.action}</span> -{" "}
                      {activity.description || "No description"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {safeFormatDateTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Belum ada aktivitas terbaru
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityReport;
