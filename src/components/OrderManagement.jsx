import React, { useState } from 'react';
import './OrderManagement.css';

const OrderManagement = ({ orders, onUpdateOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Menunggu Review', class: 'status-pending' },
      pending_approval: { label: 'Menunggu Persetujuan', class: 'status-pending-approval' },
      reviewed: { label: 'Sedang Ditinjau', class: 'status-reviewed' },
      approved: { label: 'Disetujui', class: 'status-approved' },
      in_progress: { label: 'Dalam Pengerjaan', class: 'status-progress' },
      completed: { label: 'Selesai', class: 'status-completed' },
      cancelled: { label: 'Dibatalkan', class: 'status-cancelled' }
    };

    const config = statusConfig[status] || { label: status, class: 'status-default' };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getOrderType = (order) => {
    return order.type === 'material_request' ? '📦 Permintaan Material' : '📋 Pesanan RAB';
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      onUpdateOrder({ ...order, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      pending_approval: orders.filter(o => o.status === 'pending_approval').length,
      approved: orders.filter(o => o.status === 'approved').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (orders.length === 0) {
    return (
      <div className="order-management">
        <div className="management-header">
          <h3>Kelola Pesanan</h3>
          <p>Belum ada pesanan yang masuk</p>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h4>Belum Ada Pesanan</h4>
          <p>Pesanan dari customer dan permintaan material dari project manager akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="management-header">
        <h3>Kelola Pesanan</h3>
        <p>Total {orders.length} pesanan masuk</p>
      </div>

      <div className="status-filters">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Semua ({statusCounts.all})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({statusCounts.pending})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending_approval' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending_approval')}
        >
          Perlu Persetujuan ({statusCounts.pending_approval})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          Disetujui ({statusCounts.approved})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'in_progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in_progress')}
        >
          Dalam Proses ({statusCounts.in_progress})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Selesai ({statusCounts.completed})
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <div className="order-type">{getOrderType(order)}</div>
                <h4 className="order-project">{order.projectName}</h4>
                <p className="order-customer">
                  {order.type === 'material_request' 
                    ? `Project Manager: ${order.requesterName}` 
                    : `Customer: ${order.customerName}`
                  }
                </p>
                <p className="order-date">📅 {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-actions-header">
                <div className="order-status-container">
                  {getStatusBadge(order.status)}
                </div>
                <div className="order-total-header">
                  {formatPrice(order.total)}
                </div>
              </div>
            </div>

            {order.projectLocation && (
              <div className="order-location">
                📍 {order.projectLocation}
              </div>
            )}

            {(order.projectDescription || order.requestReason) && (
              <div className="order-description">
                <p>{order.projectDescription || order.requestReason}</p>
              </div>
            )}

            {order.urgencyLevel && (
              <div className="urgency-info">
                <span className="urgency-label">Tingkat Urgensi:</span>
                <span className={`urgency-badge urgency-${order.urgencyLevel}`}>
                  {order.urgencyLevel === 'low' ? 'Rendah' :
                   order.urgencyLevel === 'normal' ? 'Normal' :
                   order.urgencyLevel === 'high' ? 'Tinggi' : 'Kritis'}
                </span>
              </div>
            )}

            <div className="order-items-summary">
              <h5>Material ({order.items.length} item)</h5>
              <div className="items-preview">
                {order.items.slice(0, 3).map(item => (
                  <div key={item.id} className="item-preview">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-qty">{item.quantity} {item.product.unit}</span>
                    <span className="item-price">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} item lainnya
                  </div>
                )}
              </div>
            </div>

            <div className="order-actions">
              <button
                className="btn-view-detail"
                onClick={() => setSelectedOrder(order)}
              >
                Lihat Detail
              </button>
              
              {order.status === 'pending' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => updateOrderStatus(order.id, 'approved')}
                  >
                    Setujui
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Tolak
                  </button>
                </>
              )}

              {order.status === 'pending_approval' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => updateOrderStatus(order.id, 'approved')}
                  >
                    Setujui
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Tolak
                  </button>
                </>
              )}

              {order.status === 'approved' && (
                <button
                  className="btn-start"
                  onClick={() => updateOrderStatus(order.id, 'in_progress')}
                >
                  Mulai Proses
                </button>
              )}

              {order.status === 'in_progress' && (
                <button
                  className="btn-complete"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                >
                  Selesaikan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedOrder.projectName}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Informasi {selectedOrder.type === 'material_request' ? 'Permintaan' : 'Pesanan'}</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Tipe:</span>
                    <span className="value">{getOrderType(selectedOrder)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value">{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total:</span>
                    <span className="value">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Dibuat:</span>
                    <span className="value">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.projectLocation && (
                    <div className="detail-item">
                      <span className="label">Lokasi:</span>
                      <span className="value">{selectedOrder.projectLocation}</span>
                    </div>
                  )}
                  {selectedOrder.urgencyLevel && (
                    <div className="detail-item">
                      <span className="label">Urgensi:</span>
                      <span className="value">
                        <span className={`urgency-badge urgency-${selectedOrder.urgencyLevel}`}>
                          {selectedOrder.urgencyLevel === 'low' ? 'Rendah' :
                           selectedOrder.urgencyLevel === 'normal' ? 'Normal' :
                           selectedOrder.urgencyLevel === 'high' ? 'Tinggi' : 'Kritis'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Detail Material</h4>
                <div className="modal-items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Jumlah</th>
                        <th>Harga Satuan</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.product.name}</strong>
                            {item.notes && <p className="item-notes">{item.notes}</p>}
                          </td>
                          <td>{item.quantity} {item.product.unit}</td>
                          <td>{formatPrice(item.product.price)}</td>
                          <td>{formatPrice(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td><strong>{formatPrice(selectedOrder.total)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;