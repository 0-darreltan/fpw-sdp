import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionRab } from "../../features/RAB/rabSlice";

const RABRequestForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rab);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    estimatedBudget: "",
    expectedStartDate: "",
    customerNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        estimatedBudget: formData.estimatedBudget
          ? Number(formData.estimatedBudget)
          : undefined,
      };

      await dispatch(actionRab.createRABRequest(submitData)).unwrap();

      alert("Permintaan RAB berhasil diajukan!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        estimatedBudget: "",
        expectedStartDate: "",
        customerNotes: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert("Gagal mengajukan permintaan RAB: " + error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Ajukan Permintaan RAB (Rencana Anggaran Biaya)
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Proyek <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Contoh: Renovasi Rumah 2 Lantai"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi Proyek <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Proyek <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Jelaskan detail proyek yang Anda inginkan..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estimated Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimasi Budget (Rp) <span className="text-gray-500">(Opsional)</span>
          </label>
          <input
            type="number"
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleChange}
            placeholder="100000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expected Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai yang Diharapkan <span className="text-gray-500">(Opsional)</span>
          </label>
          <input
            type="date"
            name="expectedStartDate"
            value={formData.expectedStartDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Customer Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Tambahan <span className="text-gray-500">(Opsional)</span>
          </label>
          <textarea
            name="customerNotes"
            value={formData.customerNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Tambahkan catatan atau permintaan khusus..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Mengirim..." : "Ajukan Permintaan RAB"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RABRequestForm;
