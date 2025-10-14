import React, { useState } from 'react';
import './OrderForm.css';

const OrderForm = ({ products, user, onAddOrder }) => {
  const [orderData, setOrderData] = useState({
    projectName: '',
    projectLocation: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    items: []
  });
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (e) => {
    setCurrentItem({
      ...currentItem,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    if (currentItem.productId && currentItem.quantity) {
      const product = products.find(p => p.id === parseInt(currentItem.productId));
      const item = {
        id: Date.now(),
        product,
        quantity: parseFloat(currentItem.quantity),
        notes: currentItem.notes,
        subtotal: product.price * parseFloat(currentItem.quantity)
      };
      
      setOrderData({
        ...orderData,
        items: [...orderData.items, item]
      });
      
      setCurrentItem({
        productId: '',
        quantity: '',
        notes: ''
      });
    }
  };

  const removeItem = (itemId) => {
    setOrderData({
      ...orderData,
      items: orderData.items.filter(item => item.id !== itemId)
    });
  };

  const calculateTotal = () => {
    return orderData.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (orderData.items.length === 0) {
      alert('Mohon tambahkan minimal satu item');
      return;
    }
    
    const order = {
      ...orderData,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      total: calculateTotal(),
      status: 'pending'
    };
    
    onAddOrder(order);
    setShowSuccess(true);
    
    // Reset form
    setOrderData({
      projectName: '',
      projectLocation: '',
      projectDescription: '',
      startDate: '',
      endDate: '',
      items: []
    });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="order-form">
      <div className="form-header">
        <h3>Buat Pesanan RAB</h3>
        <p>Rencana Anggaran Biaya untuk Proyek Konstruksi</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✅ Pesanan berhasil dibuat! Tim kami akan segera menghubungi Anda.
        </div>
      )}

      <form onSubmit={handleSubmit} className="rab-form">
        <div className="form-section">
          <h4>Informasi Proyek</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nama Proyek *</label>
              <input
                type="text"
                name="projectName"
                value={orderData.projectName}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Pembangunan Jalan Raya"
              />
            </div>
            
            <div className="form-group">
              <label>Lokasi Proyek *</label>
              <input
                type="text"
                name="projectLocation"
                value={orderData.projectLocation}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Kendari, Sulawesi Tenggara"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Deskripsi Proyek</label>
            <textarea
              name="projectDescription"
              value={orderData.projectDescription}
              onChange={handleInputChange}
              rows="3"
              placeholder="Jelaskan detail proyek yang akan dikerjakan..."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Mulai</label>
              <input
                type="date"
                name="startDate"
                value={orderData.startDate}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Tanggal Selesai</label>
              <input
                type="date"
                name="endDate"
                value={orderData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Daftar Material</h4>
          
          <div className="add-item-form">
            <div className="form-row">
              <div className="form-group">
                <label>Produk</label>
                <select
                  name="productId"
                  value={currentItem.productId}
                  onChange={handleItemChange}
                >
                  <option value="">Pilih Produk</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}/{product.unit}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Jumlah</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentItem.quantity}
                  onChange={handleItemChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label>Catatan</label>
                <input
                  type="text"
                  name="notes"
                  value={currentItem.notes}
                  onChange={handleItemChange}
                  placeholder="Catatan tambahan"
                />
              </div>
              
              <div className="form-group">
                <label>&nbsp;</label>
                <button type="button" onClick={addItem} className="btn-add-item">
                  Tambah
                </button>
              </div>
            </div>
          </div>
          
          {orderData.items.length > 0 && (
            <div className="items-list">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="item-info">
                          <strong>{item.product.name}</strong>
                          {item.notes && <p className="item-notes">{item.notes}</p>}
                        </div>
                      </td>
                      <td>{item.quantity} {item.product.unit}</td>
                      <td>{formatPrice(item.product.price)}</td>
                      <td className="subtotal">{formatPrice(item.subtotal)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="btn-remove"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="3"><strong>Total RAB</strong></td>
                    <td className="total-amount"><strong>{formatPrice(calculateTotal())}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Kirim Pesanan RAB
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;