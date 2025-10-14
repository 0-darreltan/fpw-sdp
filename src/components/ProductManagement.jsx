import React, { useState } from 'react';
import './ProductManagement.css';

const ProductManagement = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    description: '',
    stock: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct({
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      price: '',
      description: '',
      stock: '',
      status: 'active'
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
      stock: product.stock?.toString() || '',
      status: product.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      onDeleteProduct(productId);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'active' ? 'Aktif' : 'Non-aktif'}
      </span>
    );
  };

  return (
    <div className="product-management">
      <div className="management-header">
        <h3>Kelola Produk</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Tambah Produk
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Satuan</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    {product.description && (
                      <div className="product-desc">{product.description}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td>{product.unit}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock || 'N/A'}</td>
                <td>{getStatusBadge(product.status || 'active')}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h4>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
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
              <div className="form-row">
                <div className="form-group">
                  <label>Satuan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, m³, pcs, dll"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-aktif</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update' : 'Tambah'}
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