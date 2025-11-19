import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionProduct } from "../../features/product/productSlice";
import { actionUser } from "../../features/users/userSlice";
import { actionOrder } from "../../features/order/orderSlice";
import { actionProject } from "../../features/project/projectSlice";
import { activityActions } from "../../features/activity/activitySlice";

const Dashboard = ({ data }) => {
  const dispatch = useDispatch();
  
  const { listProducts } = useSelector((state) => state.product);
  const { listUsers } = useSelector((state) => state.users);
  const { listOrders } = useSelector((state) => state.order);
  const { listProjects } = useSelector((state) => state.project);
  const { listActivities, loading: activityLoading } = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(actionProduct.fetchProduct());
    dispatch(actionUser.fetchUser());
    dispatch(actionOrder.fetchOrder());
    dispatch(actionProject.fetchProject());
    dispatch(activityActions.fetchActivities({ limit: 10 }));
  }, [dispatch]);

  const stats = [
    {
      id: "orders",
      label: "Total Pesanan",
      icon: "📋",
      count: listOrders?.length || 0,
      color: "blue",
    },
    {
      id: "users",
      label: "Total User",
      icon: "👥",
      count: listUsers?.length || 0,
      color: "green",
    },
    {
      id: "products",
      label: "Total Produk",
      icon: "📦",
      count: listProducts?.length || 0,
      color: "purple",
    },
    {
      id: "projects",
      label: "Proyek Aktif",
      icon: "🏗️",
      count: listProjects?.filter(p => p.status === "active")?.length || 0,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aktivitas Terbaru
        </h3>
        {activityLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 mt-2">Memuat aktivitas...</p>
          </div>
        ) : listActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {listActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 break-words">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Grafik Penjualan
          </h3>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Proyek
          </h3>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
