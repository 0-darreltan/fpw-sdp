import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionRab } from "../../features/RAB/rabSlice";

const RABHistory = ({ user }) => {
  const dispatch = useDispatch();
  const { listRabs, loading } = useSelector((state) => state.rab);
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(actionRab.fetchRabs());
    }
  }, [dispatch, user]);

  // Filter RAB untuk customer yang login
  const myRABs = listRabs.filter((rab) => {
    const customerId = rab.customerId?._id || rab.customerId;
    const userId = user?.id || user?._id;
    return String(customerId) === String(userId);
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        label: "Dalam Review PM",
        class: "bg-blue-100 text-blue-800",
        icon: "🔍",
      },
      reviewed: {
        label: "Dalam Review PM",
        class: "bg-blue-100 text-blue-800",
        icon: "🔍",
      },
      quoted: {
        label: "Menunggu Persetujuan Anda",
        class: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
      },
      accepted: {
        label: "Diterima",
        class: "bg-green-100 text-green-800",
        icon: "✅",
      },
      rejected: {
        label: "Ditolak Customer",
        class: "bg-red-100 text-red-800",
        icon: "❌",
      },
      rejected_by_pm: {
        label: "Ditolak PM",
        class: "bg-orange-100 text-orange-800",
        icon: "🚫",
      },
    };
    const statusInfo = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}
      >
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.label}</span>
      </span>
    );
  };

  const handleViewDetail = (rab) => {
    console.log("📋 RAB Detail:", rab);
    console.log("📦 Items:", rab.items);
    setSelectedRAB(rab);
    setShowDetailModal(true);
  };

  const handleAcceptQuotation = async (rabId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menerima penawaran RAB ini? Proyek akan langsung dimulai oleh Project Manager."
      )
    ) {
      try {
        const result = await dispatch(actionRab.acceptRABQuotation(rabId)).unwrap();
        
        // Show success message with project info
        const message = result.project 
          ? `✅ Penawaran RAB berhasil diterima!\n\nProyek "${result.project.name}" telah dimulai dan sedang dikerjakan oleh Project Manager.`
          : "✅ Penawaran RAB berhasil diterima!";
        
        alert(message);
        dispatch(actionRab.fetchRabs());
        setShowDetailModal(false);
      } catch (error) {
        alert("Gagal menerima penawaran: " + error);
      }
    }
  };

  const handleRejectQuotation = async (rabId) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (reason) {
      try {
        await dispatch(
          actionRab.rejectRABQuotation({ rabId, reason })
        ).unwrap();
        alert("Penawaran RAB telah ditolak.");
        dispatch(actionRab.fetchRabs());
        setShowDetailModal(false);
      } catch (error) {
        alert("Gagal menolak penawaran: " + error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memuat riwayat RAB...</p>
        </div>
      </div>
    );
  }

  if (myRABs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Riwayat RAB
        </h3>
        <p className="text-gray-600">
          Anda belum pernah mengajukan permintaan RAB. Mulai buat pesanan untuk
          mengajukan RAB pertama Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Riwayat Permintaan RAB
        </h3>
        <p className="text-gray-600">
          Total {myRABs.length} permintaan RAB yang telah diajukan
        </p>
      </div>

      <div className="grid gap-4">
        {myRABs.map((rab) => (
          <div
            key={rab._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl">🏗️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {rab.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {rab.location}
                    </p>
                    {rab.projectManagerName && (
                      <p className="text-sm text-gray-600 mt-1">
                        👨‍💼 PM: {rab.projectManagerName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>📅 {formatDate(rab.submittedAt || rab.createdAt)}</span>
                  {rab.estimatedBudget > 0 && (
                    <span>💵 Estimasi: {formatCurrency(rab.estimatedBudget)}</span>
                  )}
                  {(rab.totalEstimated > 0 || rab.totalEstimatedCost > 0) && (
                    <span className="font-semibold text-blue-600">
                      💰 Penawaran: {formatCurrency(rab.totalEstimated || rab.totalEstimatedCost)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(rab.status)}
                <button
                  onClick={() => handleViewDetail(rab)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRAB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Permintaan RAB
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedRAB._id}
                </p>
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

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <div>{getStatusBadge(selectedRAB.status)}</div>
              </div>

              {/* Info Proyek */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Informasi Proyek
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Judul:</span>
                    <span className="font-medium">{selectedRAB.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lokasi:</span>
                    <span className="font-medium">{selectedRAB.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Diajukan:</span>
                    <span className="font-medium">
                      {formatDate(selectedRAB.submittedAt || selectedRAB.createdAt)}
                    </span>
                  </div>
                  {selectedRAB.projectManagerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Manager:</span>
                      <span className="font-medium">
                        {selectedRAB.projectManagerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deskripsi */}
              {selectedRAB.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Deskripsi
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRAB.description}</p>
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  {selectedRAB.status === 'quoted' ? 'Penawaran Material & Harga' : 'Material yang Diminta'}
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {selectedRAB.items && selectedRAB.items.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">
                            No
                          </th>
                          <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">
                            Material
                          </th>
                          <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">
                            Jumlah
                          </th>
                          <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">
                            Satuan
                          </th>
                          {selectedRAB.status === 'quoted' && (
                            <>
                              <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">
                                Harga Satuan
                              </th>
                              <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">
                                Total
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRAB.items.map((item, index) => {
                          const quantity = item.quantity || 0;
                          const unitPrice = item.unitPrice || 0;
                          const total = quantity * unitPrice;
                          
                          return (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="py-2 px-2 text-sm text-center">
                                {index + 1}
                              </td>
                              <td className="py-2 px-2 text-sm">
                                {item.materialName || item.name || "-"}
                              </td>
                              <td className="py-2 px-2 text-sm text-center">
                                {quantity}
                              </td>
                              <td className="py-2 px-2 text-sm text-center">
                                {item.unit || "pcs"}
                              </td>
                              {selectedRAB.status === 'quoted' && (
                                <>
                                  <td className="py-2 px-2 text-sm text-right">
                                    {formatCurrency(unitPrice)}
                                  </td>
                                  <td className="py-2 px-2 text-sm text-right font-medium">
                                    {formatCurrency(total)}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                        {selectedRAB.status === 'quoted' && (
                          <tr className="border-t-2 border-gray-400 bg-blue-50">
                            <td colSpan="5" className="py-3 px-2 text-right font-bold text-gray-900">
                              Total Keseluruhan:
                            </td>
                            <td className="py-3 px-2 text-right font-bold text-blue-600 text-lg">
                              {formatCurrency(selectedRAB.totalEstimated || 0)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Tidak ada material yang tercatat</p>
                      {selectedRAB.customerNotes && (
                        <p className="text-xs mt-2">Catatan: {selectedRAB.customerNotes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Catatan PM */}
              {selectedRAB.status === "quoted" && selectedRAB.pmNotes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Catatan Project Manager
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRAB.pmNotes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons for Quoted Status */}
              {selectedRAB.status === "quoted" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAcceptQuotation(selectedRAB._id)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✅ Terima Penawaran
                  </button>
                  <button
                    onClick={() => handleRejectQuotation(selectedRAB._id)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    ❌ Tolak Penawaran
                  </button>
                </div>
              )}

              {/* Payment Button for Accepted Status */}
              {selectedRAB.status === "accepted" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">✅</span>
                      <h4 className="font-semibold text-green-900">
                        Penawaran Telah Diterima
                      </h4>
                    </div>
                    <p className="text-sm text-green-800">
                      Proyek sedang dikerjakan oleh Project Manager. Silakan lakukan pembayaran untuk melanjutkan proses.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert("Fitur pembayaran akan segera tersedia");
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">💳</span>
                    <span>Bayar Sekarang - {formatCurrency(selectedRAB.totalEstimated || 0)}</span>
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

export default RABHistory;
