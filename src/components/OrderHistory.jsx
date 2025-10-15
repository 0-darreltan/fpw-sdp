import React from "react";

const OrderHistory = ({ orders, user }) => {
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
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">
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
    </div>
  );
};

export default OrderHistory;
