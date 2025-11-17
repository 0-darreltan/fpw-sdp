import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionProduct } from "../../features/product/productSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listProducts, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(actionProduct.fetchProduct());
  }, [dispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await dispatch(actionProduct.deleteProduct(productId)).unwrap();
        alert("Produk berhasil dihapus!");
        dispatch(actionProduct.fetchProduct());
      } catch (err) {
        alert(`Error: ${err.message || "Gagal menghapus produk"}`);
        console.error("Error deleting product:", err);
      }
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
          Kelola Produk / Jasa (paket pekerjaan)
        </h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          onClick={() => navigate("/admin/products/create")}
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
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : listProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Belum ada produk
                </td>
              </tr>
            ) : (
              listProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500">
                          {product.description.substring(0, 50)}
                          {product.description.length > 50 ? "..." : ""}
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
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status || "active")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                        onClick={() =>
                          navigate(`/admin/products/edit/${product._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                        onClick={() => handleDelete(product._id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        ) : listProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada produk</div>
        ) : (
          listProducts.map((product) => (
            <div
              key={product._id}
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
                  onClick={() =>
                    navigate(`/admin/products/edit/${product._id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={() => handleDelete(product._id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
