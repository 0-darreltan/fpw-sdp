import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionRab } from "../../features/RAB/rabSlice";

const CustomerRABList = () => {
  const dispatch = useDispatch();
  const { listRabs, loading } = useSelector((state) => state.rab);
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    dispatch(actionRab.fetchRabs());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Menunggu Review",
        class: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
      },
      reviewed: {
        label: "Sedang Diproses",
        class: "bg-blue-100 text-blue-800",
        icon: "🔄",
      },
      quoted: {
        label: "Penawaran Dikirim",
        class: "bg-purple-100 text-purple-800",
        icon: "💰",
      },
      accepted: {
        label: "Diterima",
        class: "bg-green-100 text-green-800",
        icon: "✅",
      },
      rejected: {
        label: "Ditolak",
        class: "bg-red-100 text-red-800",
        icon: "❌",
      },
      revised: {
        label: "Revisi",
        class: "bg-orange-100 text-orange-800",
        icon: "📝",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetail = (rab) => {
    setSelectedRAB(rab);
    setShowDetailModal(true);
  };

  const handleAccept = async (rabId) => {
    if (!confirm("Apakah Anda yakin ingin menerima penawaran RAB ini?")) return;

    try {
      await dispatch(actionRab.acceptRABQuotation(rabId)).unwrap();
      alert("Penawaran RAB berhasil diterima!");
      dispatch(actionRab.fetchRabs());
      setShowDetailModal(false);
    } catch (error) {
      alert("Gagal menerima penawaran: " + error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Mohon berikan alasan penolakan");
      return;
    }

    try {
      await dispatch(
        actionRab.rejectRABQuotation({
          rabId: selectedRAB._id,
          reason: rejectReason,
        })
      ).unwrap();
      alert("Penawaran RAB berhasil ditolak");
      dispatch(actionRab.fetchRabs());
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectReason("");
    } catch (error) {
      alert("Gagal menolak penawaran: " + error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Daftar Permintaan RAB Saya
        </h3>

        {listRabs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada permintaan RAB</p>
            <p className="text-sm mt-2">
              Ajukan permintaan RAB untuk mendapatkan penawaran biaya proyek
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {listRabs.map((rab) => (
              <div
                key={rab._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {rab.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {rab.location}
                    </p>
                  </div>
                  {getStatusBadge(rab.status)}
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {rab.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Diajukan:</span>
                    <p className="font-medium">{formatDate(rab.submittedAt)}</p>
                  </div>
                  {rab.totalEstimated > 0 && (
                    <div>
                      <span className="text-gray-600">Total Estimasi:</span>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(rab.totalEstimated)}
                      </p>
                    </div>
                  )}
                </div>

                {rab.projectManagerName && (
                  <p className="text-sm text-gray-600 mb-3">
                    👷 Ditangani oleh: <span className="font-medium">{rab.projectManagerName}</span>
                  </p>
                )}

                <button
                  onClick={() => handleViewDetail(rab)}
                  className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRAB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Detail Permintaan RAB</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRAB.status)}</div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Judul Proyek</label>
                  <p className="mt-1 text-gray-900">{selectedRAB.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lokasi</label>
                  <p className="mt-1 text-gray-900">{selectedRAB.location}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {selectedRAB.description}
                </p>
              </div>

              {selectedRAB.estimatedBudget && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Estimasi Budget Awal
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatCurrency(selectedRAB.estimatedBudget)}
                  </p>
                </div>
              )}

              {selectedRAB.customerNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Catatan Customer</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {selectedRAB.customerNotes}
                  </p>
                </div>
              )}

              {/* PM Response */}
              {selectedRAB.projectManagerName && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Respon dari Project Manager
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    👷 {selectedRAB.projectManagerName}
                  </p>

                  {selectedRAB.pmNotes && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-600">Catatan PM</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {selectedRAB.pmNotes}
                      </p>
                    </div>
                  )}

                  {/* RAB Items */}
                  {selectedRAB.items && selectedRAB.items.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Rincian Biaya
                      </label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                                Item
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                                Qty
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                                Unit
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">
                                Harga
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedRAB.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {item.description}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {item.qty}
                                </td>
                                <td className="px-3 py-2 text-sm text-center text-gray-900">
                                  {item.unit}
                                </td>
                                <td className="px-3 py-2 text-sm text-right text-gray-900">
                                  {formatCurrency(item.unitPrice)}
                                </td>
                                <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">
                                  {formatCurrency(item.qty * item.unitPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td
                                colSpan="4"
                                className="px-3 py-2 text-sm font-semibold text-right text-gray-900"
                              >
                                Total Estimasi:
                              </td>
                              <td className="px-3 py-2 text-sm font-bold text-right text-blue-600">
                                {formatCurrency(selectedRAB.totalEstimated)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons for Quoted Status */}
              {selectedRAB.status === "quoted" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleAccept(selectedRAB._id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    ✓ Terima Penawaran
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    ✕ Tolak Penawaran
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Tolak Penawaran RAB</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mohon berikan alasan penolakan:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Tuliskan alasan Anda menolak penawaran ini..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRABList;
