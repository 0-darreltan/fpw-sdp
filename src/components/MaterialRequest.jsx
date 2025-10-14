import React, { useState } from 'react';
import './MaterialRequest.css';

const MaterialRequest = ({ products, user, projects }) => {
  const [requestData, setRequestData] = useState({
    projectId: '',
    projectName: '',
    requestReason: '',
    urgencyLevel: 'normal',
    items: []
  });
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter projects assigned to current PM
  const myProjects = projects.filter(project => project.projectManagerId === user.id);

  const handleInputChange = (e) => {
    setRequestData({
      ...requestData,
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
      
      setRequestData({
        ...requestData,
        items: [...requestData.items, item]
      });
      
      setCurrentItem({
        productId: '',
        quantity: '',
        notes: ''
      });
    }
  };

  const removeItem = (itemId) => {
    setRequestData({
      ...requestData,
      items: requestData.items.filter(item => item.id !== itemId)
    });
  };

  const calculateTotal = () => {
    return requestData.items.reduce((total, item) => total + item.subtotal, 0);
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
    
    if (requestData.items.length === 0) {
      alert('Mohon tambahkan minimal satu item material');
      return;
    }
    
    if (!requestData.projectId) {
      alert('Mohon pilih proyek terlebih dahulu');
      return;
    }
    
    const materialRequest = {
      ...requestData,
      requesterId: user.id,
      requesterName: user.name,
      requesterEmail: user.email,
      total: calculateTotal(),
      status: 'pending_approval',
      type: 'material_request',
      createdAt: new Date().toISOString()
    };
    
    // In a real app, this would be sent to a material request endpoint
    console.log('Material Request:', materialRequest);
    setShowSuccess(true);
    
    // Reset form
    setRequestData({
      projectId: '',
      projectName: '',
      requestReason: '',
      urgencyLevel: 'normal',
      items: []
    });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const getUrgencyBadge = (level) => {
    const urgencyConfig = {
      low: { label: 'Rendah', class: 'urgency-low' },
      normal: { label: 'Normal', class: 'urgency-normal' },
      high: { label: 'Tinggi', class: 'urgency-high' },
      critical: { label: 'Kritis', class: 'urgency-critical' }
    };

    const config = urgencyConfig[level];
    return (
      <span className={`urgency-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="material-request">
      <div className="request-header">
        <h3>Permintaan Material Proyek</h3>
        <p>Ajukan permintaan material untuk kebutuhan proyek yang sedang dikerjakan</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✅ Permintaan material berhasil diajukan! Menunggu persetujuan dari admin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-section">
          <h4>Informasi Permintaan</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Proyek *</label>
              <select
                name="projectId"
                value={requestData.projectId}
                onChange={(e) => {
                  const projectId = e.target.value;
                  const project = myProjects.find(p => p.id === parseInt(projectId));
                  setRequestData({
                    ...requestData,
                    projectId,
                    projectName: project ? project.name : ''
                  });
                }}
                required
              >
                <option value="">Pilih Proyek</option>
                {myProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Tingkat Urgensi</label>
              <select
                name="urgencyLevel"
                value={requestData.urgencyLevel}
                onChange={handleInputChange}
              >
                <option value="low">Rendah</option>
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="critical">Kritis</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Alasan Permintaan *</label>
            <textarea
              name="requestReason"
              value={requestData.requestReason}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Jelaskan mengapa material ini diperlukan untuk proyek..."
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Daftar Material yang Diperlukan</h4>
          
          <div className="add-item-form">
            <div className="form-row">
              <div className="form-group">
                <label>Material</label>
                <select
                  name="productId"
                  value={currentItem.productId}
                  onChange={handleItemChange}
                >
                  <option value="">Pilih Material</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}/{product.unit}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Jumlah Dibutuhkan</label>
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
                <label>Catatan Khusus</label>
                <input
                  type="text"
                  name="notes"
                  value={currentItem.notes}
                  onChange={handleItemChange}
                  placeholder="Spesifikasi khusus, dll"
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
          
          {requestData.items.length > 0 && (
            <div className="items-list">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Jumlah</th>
                    <th>Estimasi Harga</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData.items.map(item => (
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
                    <td colSpan="3"><strong>Total Estimasi</strong></td>
                    <td className="total-amount"><strong>{formatPrice(calculateTotal())}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="request-summary">
          {requestData.projectName && (
            <div className="summary-item">
              <strong>Proyek:</strong> {requestData.projectName}
            </div>
          )}
          {requestData.urgencyLevel && (
            <div className="summary-item">
              <strong>Urgensi:</strong> {getUrgencyBadge(requestData.urgencyLevel)}
            </div>
          )}
          {requestData.items.length > 0 && (
            <div className="summary-item">
              <strong>Total Item:</strong> {requestData.items.length} material
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Kirim Permintaan Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialRequest;