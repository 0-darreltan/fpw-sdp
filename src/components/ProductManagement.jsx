import React, { useState } from "react";

const ProductManagement = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    description: "",
    stock: "",
    status: "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct({
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString(),
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      price: "",
      description: "",
      stock: "",
      status: "active",
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock?.toString() || "",
      status: product.status || "active",
    });
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      onDeleteProduct(productId);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const badgeClass =
      status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
      >
        {status === "active" ? "Aktif" : "Non-aktif"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Kelola Produk
        </h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          onClick={() => setShowModal(true)}
        >
          + Tambah Produk
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Nama Produk
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Satuan
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Harga
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Stok
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {product.unit}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {product.stock || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(product.status || "active")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mt-1 inline-block">
                  {product.category}
                </span>
              </div>
              <div className="ml-2">
                {getStatusBadge(product.status || "active")}
              </div>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 mb-3">
                {product.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-600">Satuan: </span>
                <span className="font-medium">{product.unit}</span>
              </div>
              <div>
                <span className="text-gray-600">Stok: </span>
                <span className="font-medium">{product.stock || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Harga: </span>
                <span className="font-bold text-lg text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={() => handleDelete(product.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h4 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h4>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Semen">Semen</option>
                    <option value="Besi Beton">Besi Beton</option>
                    <option value="Agregat">Agregat</option>
                    <option value="Ready Mix">Ready Mix</option>
                    <option value="Bata">Bata</option>
                    <option value="Kayu">Kayu</option>
                    <option value="Cat">Cat</option>
                    <option value="Pipa">Pipa</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="kg, m³, pcs, dll"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={resetForm}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingProduct ? "Update" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
