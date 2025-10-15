import React, { useState } from "react";

const MaterialRequest = ({ products, user, projects }) => {
  const [requestData, setRequestData] = useState({
    projectId: "",
    projectName: "",
    requestReason: "",
    urgencyLevel: "normal",
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "",
    notes: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter projects assigned to current PM
  const myProjects = projects.filter(
    (project) => project.projectManagerId === user.id
  );

  const handleInputChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (e) => {
    setCurrentItem({
      ...currentItem,
      [e.target.name]: e.target.value,
    });
  };

  const addItem = () => {
    if (currentItem.productId && currentItem.quantity) {
      const product = products.find(
        (p) => p.id === parseInt(currentItem.productId)
      );
      const item = {
        id: Date.now(),
        product,
        quantity: parseFloat(currentItem.quantity),
        notes: currentItem.notes,
        subtotal: product.price * parseFloat(currentItem.quantity),
      };

      setRequestData({
        ...requestData,
        items: [...requestData.items, item],
      });

      setCurrentItem({
        productId: "",
        quantity: "",
        notes: "",
      });
    }
  };

  const removeItem = (itemId) => {
    setRequestData({
      ...requestData,
      items: requestData.items.filter((item) => item.id !== itemId),
    });
  };

  const calculateTotal = () => {
    return requestData.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (requestData.items.length === 0) {
      alert("Mohon tambahkan minimal satu item material");
      return;
    }

    if (!requestData.projectId) {
      alert("Mohon pilih proyek terlebih dahulu");
      return;
    }

    const materialRequest = {
      ...requestData,
      requesterId: user.id,
      requesterName: user.name,
      requesterEmail: user.email,
      total: calculateTotal(),
      status: "pending_approval",
      type: "material_request",
      createdAt: new Date().toISOString(),
    };

    // In a real app, this would be sent to a material request endpoint
    console.log("Material Request:", materialRequest);
    setShowSuccess(true);

    // Reset form
    setRequestData({
      projectId: "",
      projectName: "",
      requestReason: "",
      urgencyLevel: "normal",
      items: [],
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const getUrgencyBadge = (level) => {
    const urgencyConfig = {
      low: { label: "Rendah", class: "bg-gray-100 text-gray-800" },
      normal: { label: "Normal", class: "bg-blue-100 text-blue-800" },
      high: { label: "Tinggi", class: "bg-yellow-100 text-yellow-800" },
      critical: { label: "Kritis", class: "bg-red-100 text-red-800" },
    };

    const config = urgencyConfig[level];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Permintaan Material Proyek
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Ajukan permintaan material untuk kebutuhan proyek yang sedang
          dikerjakan
        </p>
      </div>

      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Permintaan material berhasil diajukan! Menunggu persetujuan dari
          admin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Permintaan
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proyek *
              </label>
              <select
                name="projectId"
                value={requestData.projectId}
                onChange={(e) => {
                  const projectId = e.target.value;
                  const project = myProjects.find(
                    (p) => p.id === parseInt(projectId)
                  );
                  setRequestData({
                    ...requestData,
                    projectId,
                    projectName: project ? project.name : "",
                  });
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Proyek</option>
                {myProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat Urgensi
              </label>
              <select
                name="urgencyLevel"
                value={requestData.urgencyLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Rendah</option>
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="critical">Kritis</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan Permintaan *
            </label>
            <textarea
              name="requestReason"
              value={requestData.requestReason}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Jelaskan mengapa material ini diperlukan untuk proyek..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Daftar Material yang Diperlukan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                name="productId"
                value={currentItem.productId}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Pilih Material</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.price)}/{product.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Dibutuhkan
              </label>
              <input
                type="number"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleItemChange}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Khusus
              </label>
              <input
                type="text"
                name="notes"
                value={currentItem.notes}
                onChange={handleItemChange}
                placeholder="Spesifikasi khusus, dll"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addItem}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Tambah
              </button>
            </div>
          </div>

          {requestData.items.length > 0 && (
            <div className="overflow-x-auto">
              <div className="hidden md:block">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Estimasi Harga
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requestData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            {item.notes && (
                              <div className="text-sm text-gray-500">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.quantity} {item.product.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatPrice(item.product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-sm font-medium text-gray-900"
                      >
                        Total Estimasi
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        {formatPrice(calculateTotal())}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                {requestData.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {item.product.name}
                        </h5>
                        {item.notes && (
                          <p className="text-sm text-gray-500">{item.notes}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        ❌
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Jumlah: </span>
                        <span className="font-medium">
                          {item.quantity} {item.product.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Harga: </span>
                        <span className="font-medium">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Subtotal: </span>
                        <span className="font-bold text-lg">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <span className="text-lg font-bold text-blue-900">
                      Total Estimasi: {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {requestData.projectName && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Proyek:
                </span>
                <div className="text-sm text-gray-900">
                  {requestData.projectName}
                </div>
              </div>
            )}
            {requestData.urgencyLevel && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Urgensi:
                </span>
                <div className="mt-1">
                  {getUrgencyBadge(requestData.urgencyLevel)}
                </div>
              </div>
            )}
            {requestData.items.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Total Item:
                </span>
                <div className="text-sm text-gray-900">
                  {requestData.items.length} material
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Kirim Permintaan Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialRequest;
