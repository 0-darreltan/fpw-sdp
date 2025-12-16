import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRabs,
  assignRABToMe,
  sendRABQuotation,
} from "../../features/RAB/rabSlice";

const RABRequestManagement = () => {
  const dispatch = useDispatch();
  const { listRabs, loading } = useSelector((state) => state.rab);
  const { currUsers } = useSelector((state) => state.users);
  const user = currUsers?.user;

  const [filter, setFilter] = useState("all");
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationData, setQuotationData] = useState({
    items: [],
    totalEstimatedCost: 0,
    notes: "",
  });
  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedPMId, setSelectedPMId] = useState("");

  useEffect(() => {
    dispatch(fetchRabs());
    fetchProjectManagers();
  }, [dispatch]);

  const fetchProjectManagers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users?role=project_manager",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setProjectManagers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch project managers:", error);
    }
  };

  const handleAssignPM = async (rabId, pmId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rab/${rabId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ projectManagerId: pmId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Project Manager berhasil di-assign!");
        dispatch(fetchRabs());
        setShowDetailModal(false);
      } else {
        alert("Gagal assign Project Manager: " + data.message);
      }
    } catch (error) {
      alert("Gagal assign Project Manager: " + error.message);
    }
  };

  const handleUpdateStatus = async (rabId, newStatus) => {
    const statusLabels = {
      reviewed: "Review",
      accepted: "Diterima",
      rejected: "Ditolak",
    };

    if (
      window.confirm(
        `Apakah Anda yakin ingin mengubah status menjadi "${statusLabels[newStatus]}"?`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/rab/${rabId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        const data = await response.json();
        if (data.success) {
          alert("Status berhasil diupdate!");
          dispatch(fetchRabs());
          setShowDetailModal(false);
        } else {
          alert("Gagal update status: " + data.message);
        }
      } catch (error) {
        alert("Gagal update status: " + error.message);
      }
    }
  };

  const filteredRABs =
    filter === "all"
      ? listRabs
      : listRabs.filter((rab) => rab.status === filter);

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        label: "Menunggu Review",
        class: "bg-yellow-100 text-yellow-800",
      },
      reviewed: { label: "Dalam Review", class: "bg-blue-100 text-blue-800" },
      quoted: {
        label: "Quotation Dikirim",
        class: "bg-purple-100 text-purple-800",
      },
      accepted: {
        label: "Diterima Customer",
        class: "bg-green-100 text-green-800",
      },
      rejected: { label: "Ditolak Customer", class: "bg-red-100 text-red-800" },
    };
    const { label, class: className } = config[status] || config.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {label}
      </span>
    );
  };

  const handleViewDetail = (rab) => {
    setSelectedRAB(rab);
    setSelectedPMId(rab.projectManagerId?._id || "");
    setShowDetailModal(true);
  };

  const handleAssignToMe = async (rabId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mengambil permintaan RAB ini untuk ditangani?"
      )
    ) {
      try {
        await dispatch(assignRABToMe(rabId)).unwrap();
        alert("Berhasil mengambil permintaan RAB!");
        dispatch(fetchRabs());
      } catch (error) {
        alert("Gagal mengambil permintaan RAB: " + error);
      }
    }
  };

  const handleSendQuotation = (rab) => {
    setSelectedRAB(rab);
    // Pre-fill items from RAB request
    const items = rab.items.map((item) => ({
      materialName: item.materialName,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: 0,
      totalPrice: 0,
    }));
    setQuotationData({
      items,
      totalEstimatedCost: 0,
      notes: "",
    });
    setShowQuotationModal(true);
  };

  const handleQuotationItemChange = (index, field, value) => {
    const newItems = [...quotationData.items];
    newItems[index][field] = value;

    if (field === "unitPrice" || field === "quantity") {
      newItems[index].totalPrice =
        newItems[index].unitPrice * newItems[index].quantity;
    }

    const total = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setQuotationData({
      ...quotationData,
      items: newItems,
      totalEstimatedCost: total,
    });
  };

  const handleSubmitQuotation = async () => {
    if (quotationData.items.some((item) => item.unitPrice <= 0)) {
      alert("Harap isi semua harga satuan!");
      return;
    }

    try {
      await dispatch(
        sendRABQuotation({
          rabId: selectedRAB._id,
          quotationData,
        })
      ).unwrap();
      alert("Quotation berhasil dikirim!");
      setShowQuotationModal(false);
      dispatch(fetchRabs());
    } catch (error) {
      alert("Gagal mengirim quotation: " + error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Permintaan RAB Customer
          </h2>
          <p className="text-gray-600 mt-1">
            Kelola permintaan Rencana Anggaran Biaya dari customer
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Semua" },
            { value: "pending", label: "Menunggu Review" },
            { value: "reviewed", label: "Dalam Review" },
            { value: "quoted", label: "Quotation Dikirim" },
            { value: "accepted", label: "Diterima" },
            { value: "rejected", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              {tab.value === "all"
                ? ` (${listRabs.length})`
                : ` (${listRabs.filter((r) => r.status === tab.value).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* RAB List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredRABs.length === 0 ? (
          <div className="p-12 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Tidak ada permintaan RAB</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul & Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PM Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRABs.map((rab) => (
                  <tr key={rab._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rab.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rab.customerId?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {rab.customerId?.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {rab.description || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(rab.status)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(rab.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {rab.projectManagerId?.name || (
                          <span className="text-gray-400 italic">
                            Belum ditangani
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(rab)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Detail
                        </button>
                        {user?.role === "project_manager" && (
                          <>
                            {!rab.projectManagerId && (
                              <button
                                onClick={() => handleAssignToMe(rab._id)}
                                className="text-green-600 hover:text-green-800 font-medium text-sm"
                              >
                                Ambil
                              </button>
                            )}
                            {rab.projectManagerId?._id === user?._id &&
                              rab.status === "reviewed" && (
                                <button
                                  onClick={() => handleSendQuotation(rab)}
                                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                                >
                                  Kirim Quotation
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRAB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-start">
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
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Informasi Customer
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">
                      {selectedRAB.customerId?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {selectedRAB.customerId?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* RAB Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Informasi Permintaan
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Judul:</span>
                    <span className="font-medium">{selectedRAB.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(selectedRAB.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Dibuat:</span>
                    <span className="font-medium">
                      {formatDate(selectedRAB.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-600">Project Manager:</span>
                    <div className="flex gap-2">
                      <select
                        value={
                          selectedPMId ||
                          selectedRAB.projectManagerId?._id ||
                          ""
                        }
                        onChange={(e) => setSelectedPMId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Pilih Project Manager</option>
                        {projectManagers.map((pm) => (
                          <option key={pm._id} value={pm._id}>
                            {pm.name} - {pm.email}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (!selectedPMId) {
                            alert("Pilih Project Manager terlebih dahulu!");
                            return;
                          }
                          handleAssignPM(selectedRAB._id, selectedPMId);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Assign PM
                      </button>
                    </div>
                    {selectedRAB.projectManagerId && (
                      <div className="text-sm text-gray-500">
                        Saat ini:{" "}
                        <span className="font-medium">
                          {selectedRAB.projectManagerId.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedRAB.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Deskripsi
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRAB.description}</p>
                  </div>
                </div>
              )}

              {/* Items Requested */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Material yang Diminta
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 text-sm font-medium text-gray-700">
                          Material
                        </th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">
                          Jumlah
                        </th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">
                          Satuan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRAB.items?.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2 text-sm">{item.materialName}</td>
                          <td className="py-2 text-sm text-right">
                            {item.quantity}
                          </td>
                          <td className="py-2 text-sm text-right">
                            {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Update Status Buttons - Only for Admin */}
              {user?.role === "admin" && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Update Status Permintaan
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRAB._id, "reviewed")
                        }
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Review
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRAB._id, "accepted")
                        }
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Diterima
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedRAB._id, "rejected")
                        }
                        className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Ditolak
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Klik salah satu tombol untuk mengubah status permintaan
                      RAB ini
                    </p>
                  </div>
                </div>
              )}

              {/* Quotation if exists */}
              {selectedRAB.totalEstimatedCost > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Quotation yang Dikirim
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-medium">
                        Total Estimasi Biaya:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(selectedRAB.totalEstimatedCost)}
                      </span>
                    </div>
                    {selectedRAB.notes && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Catatan:</span>{" "}
                          {selectedRAB.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && selectedRAB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Buat Quotation RAB
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRAB.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuotationModal(false)}
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Perhatian:</span> Isi harga
                  satuan untuk setiap material. Total akan dihitung otomatis.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        Material
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Jumlah
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Satuan
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Harga Satuan
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-sm">
                          {item.materialName}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          {item.unit}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleQuotationItemChange(
                                index,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-medium">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 border-t-2 border-blue-300">
                      <td
                        colSpan="4"
                        className="py-3 px-2 text-sm font-bold text-right"
                      >
                        Total Estimasi Biaya:
                      </td>
                      <td className="py-3 px-2 text-sm font-bold text-right text-blue-600">
                        {formatCurrency(quotationData.totalEstimatedCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={quotationData.notes}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tambahkan catatan untuk customer..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowQuotationModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitQuotation}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kirim Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RABRequestManagement;
