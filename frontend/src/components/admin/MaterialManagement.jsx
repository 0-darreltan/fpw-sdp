import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionProduct } from "../../features/product/productSlice";

const MaterialManagement = () => {
  const dispatch = useDispatch();
  const { listProducts, loading } = useSelector((state) => state.product);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({ productId: null, quantity: "", type: "" });

  useEffect(() => {
    dispatch(actionProduct.fetchProduct());
  }, [dispatch]);

  const formatPrice = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  const handleStockAdjustment = async (product, type) => {
    const quantity = prompt(`${type === 'add' ? 'Tambah' : 'Kurangi'} stok (qty):`, '1');
    const qty = Number(quantity);
    
    if (isNaN(qty) || qty <= 0) return;

    const currentStock = product.stock || 0;
    const newStock = type === 'add' 
      ? currentStock + qty 
      : Math.max(0, currentStock - qty);

    try {
      await dispatch(actionProduct.updateProduct({
        _id: product._id,
        stock: newStock
      })).unwrap();
      
      alert(`Stock berhasil ${type === 'add' ? 'ditambah' : 'dikurangi'}!`);
      dispatch(actionProduct.fetchProduct());
    } catch (err) {
      alert(`Gagal mengupdate stock: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Material / Stock</h3>
          <p className="text-sm text-gray-600 mt-1">Kelola stok produk dengan menambah atau mengurangi jumlah</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat data...</div>
      ) : listProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Belum ada produk</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Nama Produk</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Kategori</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Satuan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Harga</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Stock Saat Ini</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b">Kelola Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 mt-1">{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{product.unit}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{formatPrice(product.price || 0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{(product.stock || 0).toLocaleString('id-ID')}</span>
                      <span className="text-sm text-gray-500">{product.unit}</span>
                      {(product.stock || 0) > 0 ? (
                        <span className="text-xs text-green-600">✓</span>
                      ) : (
                        <span className="text-xs text-red-600">✗</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        onClick={() => handleStockAdjustment(product, 'reduce')}
                        title="Kurangi stock"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        Kurangi
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        onClick={() => handleStockAdjustment(product, 'add')}
                        title="Tambah stock"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaterialManagement;
