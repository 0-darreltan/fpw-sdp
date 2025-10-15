import React, { useState } from "react";

const OrderForm = ({ products, user, onAddOrder }) => {
  const [orderData, setOrderData] = useState({
    projectName: "",
    projectLocation: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "",
    notes: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
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

      setOrderData({
        ...orderData,
        items: [...orderData.items, item],
      });

      setCurrentItem({
        productId: "",
        quantity: "",
        notes: "",
      });
    }
  };

  const removeItem = (itemId) => {
    setOrderData({
      ...orderData,
      items: orderData.items.filter((item) => item.id !== itemId),
    });
  };

  const calculateTotal = () => {
    return orderData.items.reduce((total, item) => total + item.subtotal, 0);
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

    if (orderData.items.length === 0) {
      alert("Mohon tambahkan minimal satu item");
      return;
    }

    const order = {
      ...orderData,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      total: calculateTotal(),
      status: "pending",
    };

    onAddOrder(order);
    setShowSuccess(true);

    // Reset form
    setOrderData({
      projectName: "",
      projectLocation: "",
      projectDescription: "",
      startDate: "",
      endDate: "",
      items: [],
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Buat Pesanan RAB
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Rencana Anggaran Biaya untuk Proyek Konstruksi
        </p>
      </div>

      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Pesanan berhasil dibuat! Tim kami akan segera menghubungi Anda.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Proyek
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Proyek *
              </label>
              <input
                type="text"
                name="projectName"
                value={orderData.projectName}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Pembangunan Jalan Raya"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Proyek *
              </label>
              <input
                type="text"
                name="projectLocation"
                value={orderData.projectLocation}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Kendari, Sulawesi Tenggara"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Proyek
            </label>
            <textarea
              name="projectDescription"
              value={orderData.projectDescription}
              onChange={handleInputChange}
              rows="3"
              placeholder="Jelaskan detail proyek yang akan dikerjakan..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="startDate"
                value={orderData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="endDate"
                value={orderData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Daftar Material
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produk
              </label>
              <select
                name="productId"
                value={currentItem.productId}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Pilih Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.price)}/{product.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah
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
                Catatan
              </label>
              <input
                type="text"
                name="notes"
                value={currentItem.notes}
                onChange={handleItemChange}
                placeholder="Catatan tambahan"
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

          {orderData.items.length > 0 && (
            <div className="overflow-x-auto">
              <div className="hidden md:block">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Produk
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Harga Satuan
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
                    {orderData.items.map((item) => (
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
                        Total RAB
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
                {orderData.items.map((item) => (
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
                      Total RAB: {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Kirim Pesanan RAB
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
