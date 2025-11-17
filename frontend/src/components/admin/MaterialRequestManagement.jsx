import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionMaterialRequest } from "../../features/materialRequest/materialRequestSlice";

const MaterialRequestManagement = () => {
  const dispatch = useDispatch();
  const { listMaterialRequests, loading } = useSelector(
    (state) => state.materialRequest
  );

  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    dispatch(actionMaterialRequest.fetchMaterialRequests());
  }, [dispatch]);

  const filteredRequests =
    filter === "all"
      ? listMaterialRequests
      : listMaterialRequests.filter((req) => req.status === filter);

  const getStatusBadge = (status) => {
    const config = {
      pending_approval: { label: "Menunggu Persetujuan", class: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Disetujui", class: "bg-green-100 text-green-800" },
      rejected: { label: "Ditolak", class: "bg-red-100 text-red-800" },
      partially_approved: { label: "Disetujui Sebagian", class: "bg-blue-100 text-blue-800" },
      fulfilled: { label: "Terpenuhi", class: "bg-gray-100 text-gray-800" },
    };
    const { label, class: className } = config[status] || config.pending_approval;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  const getUrgencyBadge = (level) => {
    const config = {
      low: { label: "Rendah", class: "bg-gray-100 text-gray-600" },
      normal: { label: "Normal", class: "bg-blue-100 text-blue-600" },
      high: { label: "Tinggi", class: "bg-orange-100 text-orange-600" },
      critical: { label: "Kritis", class: "bg-red-100 text-red-600" },
    };
    const { label, class: className } = config[level] || config.normal;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  const getStockStatusBadge = (status) => {
    const config = {
      sufficient: { label: "✓ Stok Cukup", class: "text-green-600" },
      insufficient: { label: "⚠ Stok Kurang", class: "text-orange-600" },
      out_of_stock: { label: "✗ Stok Habis", class: "text-red-600" },
    };
    const { label, class: className } = config[status] || config.sufficient;
    return <span className={`text-sm font-medium ${className}`}>{label}</span>;
  };

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

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || "");
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedRequest) return;

    try {
      await dispatch(
        actionMaterialRequest.updateMaterialRequest({
          id: selectedRequest._id,
          status,
          adminNotes,
        })
      ).unwrap();

      alert(`Permintaan material berhasil ${status === "approved" ? "disetujui" : "ditolak"}!`);
      setShowDetailModal(false);
      dispatch(actionMaterialRequest.fetchMaterialRequests());
    } catch (error) {
      alert("Gagal memperbarui status: " + (error.message || "Terjadi kesalahan"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Kelola Permintaan Material
        </h2>
        <p className="text-gray-600 mt-1">
          Kelola dan setujui permintaan material dari Project Manager
        </p>
      </div>

      {/* Filter */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Semua ({listMaterialRequests.length})
          </button>
          <button
            onClick={() => setFilter("pending_approval")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending_approval"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Menunggu (
            {listMaterialRequests.filter((r) => r.status === "pending_approval").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Disetujui (
            {listMaterialRequests.filter((r) => r.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ditolak ({listMaterialRequests.filter((r) => r.status === "rejected").length}
            )
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Permintaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Urgensi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Estimasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Tidak ada permintaan material
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {request.projectName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.items?.length || 0} item material
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.requesterName}</div>
                    <div className="text-sm text-gray-500">{request.requesterEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4">{getUrgencyBadge(request.urgencyLevel)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(request.total)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewDetail(request)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Detail Permintaan Material
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedRequest.projectName}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
            </div>

            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Manager
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.requesterName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedRequest.requesterEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Permintaan
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urgensi</label>
                  <div className="mt-1">{getUrgencyBadge(selectedRequest.urgencyLevel)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Permintaan
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.requestReason}
                </p>
              </div>

              {/* Items Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daftar Material
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Material
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Jumlah
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Harga Satuan
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Subtotal
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Status Stok
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRequest.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                            {item.notes && (
                              <div className="text-xs text-gray-500">{item.notes}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </td>
                          <td className="px-4 py-3">
                            <div>{getStockStatusBadge(item.stockStatus)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Tersedia: {item.availableStock || 0} {item.unit}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-900">
                          Total Estimasi:
                        </td>
                        <td colSpan="2" className="px-4 py-3 text-lg font-bold text-gray-900">
                          {formatPrice(selectedRequest.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Admin
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tambahkan catatan untuk permintaan ini..."
                  disabled={selectedRequest.status !== "pending_approval"}
                />
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending_approval" && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleUpdateStatus("rejected")}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    Tolak Permintaan
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("approved")}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    Setujui Permintaan
                  </button>
                </div>
              )}

              {selectedRequest.status !== "pending_approval" && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestManagement;
