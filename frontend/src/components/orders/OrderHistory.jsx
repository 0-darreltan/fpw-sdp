import React, { useState } from "react";

const OrderHistory = ({ orders, user }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter orders for current customer
  const customerOrders = orders.filter((order) => order.customerId === user.id);

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

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Menunggu Review",
        class: "bg-yellow-100 text-yellow-800",
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

  if (customerOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Riwayat Pesanan
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Pantau status pesanan RAB Anda
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Belum Ada Pesanan
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Anda belum membuat pesanan apapun. Mulai dengan membuat pesanan RAB
            di tab "Buat Pesanan".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Riwayat Pesanan
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Total {customerOrders.length} pesanan
        </p>
      </div>

      <div className="space-y-6">
        {customerOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {order.projectName}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{order.projectLocation}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {order.projectDescription && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {order.projectDescription}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {(order.startDate || order.endDate) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.startDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Mulai:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(order.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    )}
                    {order.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Selesai:
                        </span>
                        <span className="text-sm text-gray-900">
                          {new Date(order.endDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Detail Material ({order.items.length} item)
                  </h5>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {item.quantity} {item.product.unit}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total RAB:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => handleShowDetail(order)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                >
                  Lihat Detail
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">
                  Hubungi Tim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Detail Pesanan
                </h3>
                <p className="text-gray-600">Order ID: #{selectedOrder.id}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Status Pesanan:
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Project Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">
                  Informasi Proyek
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Nama Proyek:
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {selectedOrder.projectName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lokasi:</p>
                    <p className="text-gray-900">
                      {selectedOrder.projectLocation}
                    </p>
                  </div>
                  {selectedOrder.startDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tanggal Mulai:
                      </p>
                      <p className="text-gray-900">
                        {new Date(selectedOrder.startDate).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {selectedOrder.endDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tanggal Selesai:
                      </p>
                      <p className="text-gray-900">
                        {new Date(selectedOrder.endDate).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">
                      Tanggal Pemesanan:
                    </p>
                    <p className="text-gray-900">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
                {selectedOrder.projectDescription && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Deskripsi Proyek:
                    </p>
                    <p className="text-gray-900">
                      {selectedOrder.projectDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Material Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Detail Material ({selectedOrder.items.length} Item)
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spesifikasi
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga Satuan
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Kategori: {item.product.category}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {item.product.specification || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="text-sm text-gray-900">
                              {formatPrice(item.product.price)}
                            </div>
                            <div className="text-xs text-gray-500">
                              per {item.product.unit}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {item.quantity} {item.product.unit}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatPrice(item.subtotal)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Item:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.items.length} item
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Kuantitas:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      unit
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total RAB:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200">
                  💬 Hubungi Tim Proyek
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200">
                  📄 Unduh RAB (PDF)
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
