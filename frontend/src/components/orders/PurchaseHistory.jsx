import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionOrder } from "../../features/order/orderSlice";

const PurchaseHistory = () => {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.order);

  const [filters, setFilters] = useState({
    status: "",
    orderType: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(actionOrder.fetchMyOrders({}));
  }, [dispatch]);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      payment_confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Pembayaran Dikonfirmasi",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Menunggu Pembayaran",
      },
      processing: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Diproses",
      },
      shipping: {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        label: "Dalam Pengiriman",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Selesai",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Dibatalkan",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const queryParams = {};
    if (filters.status) queryParams.status = filters.status;
    if (filters.orderType) queryParams.orderType = filters.orderType;

    dispatch(actionOrder.fetchMyOrders(queryParams));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      orderType: "",
    });
    dispatch(actionOrder.fetchMyOrders({}));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat riwayat pembelian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Riwayat Pembelian
          </h1>
          <p className="mt-2 text-gray-600">
            Lihat semua transaksi dan pesanan Anda
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pesanan
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="payment_confirmed">
                  Pembayaran Dikonfirmasi
                </option>
                <option value="processing">Diproses</option>
                <option value="shipping">Dalam Pengiriman</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Pesanan
              </label>
              <select
                name="orderType"
                value={filters.orderType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Tipe</option>
                <option value="MATERIAL_PURCHASE">Pembelian Material</option>
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Orders List */}
        {myOrders && myOrders.length > 0 ? (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      {getStatusBadge(order.status)}
                      <span className="text-sm text-gray-600">
                        {order.orderType === "MATERIAL_PURCHASE"
                          ? "Pembelian Material"
                          : "Project"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum Ada Pesanan
            </h3>
            <p className="text-gray-500">
              Anda belum memiliki riwayat pembelian
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Pesanan #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
              {/* Order Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Informasi Pesanan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                    <p className="font-medium">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipe Pesanan</p>
                    <p className="font-medium">
                      {selectedOrder.orderType === "MATERIAL_PURCHASE"
                        ? "Pembelian Material"
                        : "Project"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="font-bold text-lg text-blue-600">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout Details */}
              {selectedOrder.checkoutId && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Detail Checkout
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedOrder.checkoutId.items &&
                    selectedOrder.checkoutId.items.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOrder.checkoutId.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit} ×{" "}
                                {formatCurrency(item.priceAtCheckout)}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(
                                item.quantity * item.priceAtCheckout
                              )}
                            </p>
                          </div>
                        ))}
                        <div className="pt-3 border-t-2 border-gray-300">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Subtotal:</p>
                            <p className="font-medium">
                              {formatCurrency(
                                selectedOrder.checkoutId.subtotal || 0
                              )}
                            </p>
                          </div>
                          {selectedOrder.checkoutId.shippingCost > 0 && (
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-sm text-gray-600">
                                Biaya Pengiriman:
                              </p>
                              <p className="font-medium">
                                {formatCurrency(
                                  selectedOrder.checkoutId.shippingCost
                                )}
                              </p>
                            </div>
                          )}
                          {selectedOrder.checkoutId.discount > 0 && (
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-sm text-gray-600">Diskon:</p>
                              <p className="font-medium text-green-600">
                                -{" "}
                                {formatCurrency(
                                  selectedOrder.checkoutId.discount
                                )}
                              </p>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                            <p className="font-bold text-lg">Total:</p>
                            <p className="font-bold text-lg text-blue-600">
                              {formatCurrency(selectedOrder.checkoutId.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Detail item tidak tersedia
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {selectedOrder.checkoutId?.deliveryAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Alamat Pengiriman
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {selectedOrder.checkoutId.deliveryAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              {selectedOrder.checkoutId?.paymentStatus && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Status Pembayaran
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {selectedOrder.checkoutId.paymentStatus === "paid"
                        ? "✅ Pembayaran Berhasil"
                        : selectedOrder.checkoutId.paymentStatus === "pending"
                        ? "⏳ Menunggu Pembayaran"
                        : "❌ Pembayaran Gagal"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
