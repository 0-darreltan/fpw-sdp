import React, { useState } from "react";

const OrderManagement = ({ orders, onUpdateOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Menunggu Review",
        class: "bg-yellow-100 text-yellow-800",
      },
      pending_approval: {
        label: "Menunggu Persetujuan",
        class: "bg-orange-100 text-orange-800",
      },
      reviewed: {
        label: "Sedang Ditinjau",
        class: "bg-blue-100 text-blue-800",
      },
      approved: { label: "Disetujui", class: "bg-green-100 text-green-800" },
      in_progress: {
        label: "Dalam Pengerjaan",
        class: "bg-purple-100 text-purple-800",
      },
      completed: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
      cancelled: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      label: status,
      class: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getOrderType = (order) => {
    return order.type === "material_request"
      ? "📦 Permintaan Material"
      : "📋 Pesanan RAB";
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      onUpdateOrder({ ...order, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      pending_approval: orders.filter((o) => o.status === "pending_approval")
        .length,
      approved: orders.filter((o) => o.status === "approved").length,
      in_progress: orders.filter((o) => o.status === "in_progress").length,
      completed: orders.filter((o) => o.status === "completed").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Kelola Pesanan
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Belum ada pesanan yang masuk
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Belum Ada Pesanan
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Pesanan dari customer dan permintaan material dari project manager
            akan muncul di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Kelola Pesanan
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Total {orders.length} pesanan masuk
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("all")}
        >
          Semua ({statusCounts.all})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending ({statusCounts.pending})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "pending_approval"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("pending_approval")}
        >
          Perlu Persetujuan ({statusCounts.pending_approval})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "approved"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("approved")}
        >
          Disetujui ({statusCounts.approved})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "in_progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("in_progress")}
        >
          Sedang Dikerjakan ({statusCounts.in_progress})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filterStatus === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterStatus("completed")}
        >
          Selesai ({statusCounts.completed})
        </button>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit">
                    {getOrderType(order)}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {order.projectName}
                  </h4>
                  {getStatusBadge(order.status)}
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p>
                    {order.type === "material_request"
                      ? `Project Manager: ${order.requesterName}`
                      : `Customer: ${order.customerName}`}
                  </p>
                  <p>📅 {formatDate(order.createdAt)}</p>
                  {order.projectLocation && <p>📍 {order.projectLocation}</p>}
                </div>

                {(order.projectDescription || order.requestReason) && (
                  <div className="text-sm text-gray-700 mb-3 p-3 bg-gray-100 rounded-md">
                    <p>{order.projectDescription || order.requestReason}</p>
                  </div>
                )}

                {order.urgencyLevel && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Tingkat Urgensi:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.urgencyLevel === "low"
                          ? "bg-green-100 text-green-800"
                          : order.urgencyLevel === "normal"
                          ? "bg-blue-100 text-blue-800"
                          : order.urgencyLevel === "high"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.urgencyLevel === "low"
                        ? "Rendah"
                        : order.urgencyLevel === "normal"
                        ? "Normal"
                        : order.urgencyLevel === "high"
                        ? "Tinggi"
                        : "Kritis"}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Material ({order.items.length} item)
                  </h5>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.product.name}
                        </span>
                        <span className="text-gray-600">
                          {item.quantity} {item.product.unit}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{order.items.length - 3} item lainnya
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-48">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  onClick={() => setSelectedOrder(order)}
                >
                  Lihat Detail
                </button>

                {order.status === "pending" && (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() => updateOrderStatus(order.id, "approved")}
                    >
                      Setujui
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                    >
                      Tolak
                    </button>
                  </>
                )}

                {order.status === "pending_approval" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => updateOrderStatus(order.id, "approved")}
                    >
                      Setujui
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                    >
                      Tolak
                    </button>
                  </>
                )}

                {order.status === "approved" && (
                  <button
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                    onClick={() => updateOrderStatus(order.id, "in_progress")}
                  >
                    Mulai Proses
                  </button>
                )}

                {order.status === "in_progress" && (
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                    onClick={() => updateOrderStatus(order.id, "completed")}
                  >
                    Selesaikan
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedOrder.projectName}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setSelectedOrder(null)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi{" "}
                  {selectedOrder.type === "material_request"
                    ? "Permintaan"
                    : "Pesanan"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Tipe:
                      </span>
                      <span className="text-gray-900">
                        {getOrderType(selectedOrder)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Dibuat:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.projectLocation && (
                      <div>
                        <span className="block text-sm font-medium text-gray-700">
                          Lokasi:
                        </span>
                        <span className="text-gray-900">
                          {selectedOrder.projectLocation}
                        </span>
                      </div>
                    )}
                    {selectedOrder.urgencyLevel && (
                      <div>
                        <span className="block text-sm font-medium text-gray-700">
                          Urgensi:
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            selectedOrder.urgencyLevel === "low"
                              ? "bg-green-100 text-green-800"
                              : selectedOrder.urgencyLevel === "normal"
                              ? "bg-blue-100 text-blue-800"
                              : selectedOrder.urgencyLevel === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedOrder.urgencyLevel === "low"
                            ? "Rendah"
                            : selectedOrder.urgencyLevel === "normal"
                            ? "Normal"
                            : selectedOrder.urgencyLevel === "high"
                            ? "Tinggi"
                            : "Kritis"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Detail Material
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga Satuan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            {item.notes && (
                              <div className="text-sm text-gray-500 mt-1">
                                {item.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity} {item.product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(item.product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                        >
                          Total:
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                          {formatPrice(selectedOrder.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
