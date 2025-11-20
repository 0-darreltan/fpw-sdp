import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionRab } from "../../features/RAB/rabSlice";

const PMRABManagement = () => {
  const dispatch = useDispatch();
  const { listRabs, loading } = useSelector((state) => state.rab);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  
  // Quotation form state
  const [quotationItems, setQuotationItems] = useState([
    { description: "", unit: "", qty: 1, unitPrice: 0 },
  ]);
  const [pmNotes, setPmNotes] = useState("");

  useEffect(() => {
    dispatch(actionRab.fetchRabs());
  }, [dispatch]);

  // Debug: Log listRabs whenever it changes
  useEffect(() => {
    console.log("📋 RAB List Updated:", {
      total: listRabs.length,
      data: listRabs,
    });
  }, [listRabs]);

  const filteredRABs =
    statusFilter === "all"
      ? listRabs
      : listRabs.filter((rab) => rab.status === statusFilter);

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

  const handleAssign = async (rabId) => {
    if (!confirm("Apakah Anda ingin menangani permintaan RAB ini?")) return;

    try {
      await dispatch(actionRab.assignRABToMe(rabId)).unwrap();
      alert("Berhasil mengambil permintaan RAB!");
      dispatch(actionRab.fetchRabs());
    } catch (error) {
      alert("Gagal mengambil permintaan: " + error);
    }
  };

  const handleCreateQuotation = (rab) => {
    setSelectedRAB(rab);
    setPmNotes("");
    setQuotationItems([{ description: "", unit: "", qty: 1, unitPrice: 0 }]);
    setShowQuotationModal(true);
  };

  const addQuotationItem = () => {
    setQuotationItems([
      ...quotationItems,
      { description: "", unit: "", qty: 1, unitPrice: 0 },
    ]);
  };

  const removeQuotationItem = (index) => {
    setQuotationItems(quotationItems.filter((_, i) => i !== index));
  };

  const updateQuotationItem = (index, field, value) => {
    const updated = [...quotationItems];
    updated[index] = { ...updated[index], [field]: value };
    setQuotationItems(updated);
  };

  const calculateTotal = () => {
    return quotationItems.reduce(
      (sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0),
      0
    );
  };

  const handleSendQuotation = async () => {
    // Validate items
    const validItems = quotationItems.filter(
      (item) =>
        item.description && item.unit && item.qty > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      alert("Mohon isi minimal 1 item RAB dengan lengkap");
      return;
    }

    try {
      await dispatch(
        actionRab.sendRABQuotation({
          rabId: selectedRAB._id,
          quotationData: {
            items: validItems,
            pmNotes,
          },
        })
      ).unwrap();

      alert("Penawaran RAB berhasil dikirim!");
      dispatch(actionRab.fetchRabs());
      setShowQuotationModal(false);
      setShowDetailModal(false);
    } catch (error) {
      alert("Gagal mengirim penawaran: " + error);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Manajemen Permintaan RAB
          </h3>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Review</option>
            <option value="reviewed">Sedang Diproses</option>
            <option value="quoted">Penawaran Dikirim</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        {filteredRABs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada permintaan RAB{statusFilter !== "all" && ` dengan status "${statusFilter}"`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRABs.map((rab) => (
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
                      👤 {rab.customerName} | 📍 {rab.location}
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
                  {rab.estimatedBudget && (
                    <div>
                      <span className="text-gray-600">Estimasi Budget:</span>
                      <p className="font-medium">
                        {formatCurrency(rab.estimatedBudget)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetail(rab)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    Lihat Detail
                  </button>

                  {rab.status === "pending" && (
                    <button
                      onClick={() => handleAssign(rab._id)}
                      className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      Tangani Permintaan
                    </button>
                  )}

                  {(rab.status === "reviewed" || rab.status === "pending") && (
                    <button
                      onClick={() => handleCreateQuotation(rab)}
                      className="flex-1 bg-purple-50 text-purple-600 py-2 px-4 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium"
                    >
                      Buat Penawaran
                    </button>
                  )}
                </div>
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

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRAB.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Customer
                  </label>
                  <p className="mt-1 text-gray-900">{selectedRAB.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedRAB.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lokasi</label>
                  <p className="mt-1 text-gray-900">{selectedRAB.location}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Judul Proyek
                </label>
                <p className="mt-1 text-gray-900">{selectedRAB.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {selectedRAB.description}
                </p>
              </div>

              {selectedRAB.customerNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Catatan Customer
                  </label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {selectedRAB.customerNotes}
                  </p>
                </div>
              )}

              {selectedRAB.items && selectedRAB.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Penawaran yang Dikirim
                  </h4>
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
                            <td className="px-3 py-2 text-sm text-center">
                              {item.qty}
                            </td>
                            <td className="px-3 py-2 text-sm text-center">
                              {item.unit}
                            </td>
                            <td className="px-3 py-2 text-sm text-right">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-3 py-2 text-sm text-right font-medium">
                              {formatCurrency(item.qty * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan="4"
                            className="px-3 py-2 text-sm font-semibold text-right"
                          >
                            Total:
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
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && selectedRAB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Buat Penawaran RAB</h3>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Customer:</strong> {selectedRAB.customerName}
                </p>
                <p className="text-sm">
                  <strong>Proyek:</strong> {selectedRAB.title}
                </p>
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Rincian Biaya
                  </label>
                  <button
                    type="button"
                    onClick={addQuotationItem}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                  >
                    + Tambah Item
                  </button>
                </div>

                <div className="space-y-3">
                  {quotationItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded"
                    >
                      <input
                        type="text"
                        placeholder="Deskripsi item"
                        value={item.description}
                        onChange={(e) =>
                          updateQuotationItem(index, "description", e.target.value)
                        }
                        className="col-span-4 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) =>
                          updateQuotationItem(index, "qty", Number(e.target.value))
                        }
                        className="col-span-2 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) =>
                          updateQuotationItem(index, "unit", e.target.value)
                        }
                        className="col-span-2 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Harga"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateQuotationItem(
                            index,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="col-span-3 px-2 py-1 border rounded text-sm"
                      />
                      {quotationItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuotationItem(index)}
                          className="col-span-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    Total: {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </div>

              {/* PM Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan PM (Opsional)
                </label>
                <textarea
                  value={pmNotes}
                  onChange={(e) => setPmNotes(e.target.value)}
                  rows={4}
                  placeholder="Tambahkan catatan atau penjelasan untuk customer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowQuotationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendQuotation}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Kirim Penawaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMRABManagement;
