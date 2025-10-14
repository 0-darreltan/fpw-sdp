import React from 'react';
import './OrderHistory.css';

const OrderHistory = ({ orders, user }) => {
  
  // Filter orders for current customer
  const customerOrders = orders.filter(order => order.customerId === user.id);

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

  if (customerOrders.length === 0) {
    return (
      <div className="order-history">
        <div className="history-header">
          <h3>Riwayat Pesanan</h3>
          <p>Pantau status pesanan RAB Anda</p>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h4>Belum Ada Pesanan</h4>
          <p>Anda belum membuat pesanan apapun. Mulai dengan membuat pesanan RAB di tab "Buat Pesanan".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="history-header">
        <h3>Riwayat Pesanan</h3>
        <p>Total {customerOrders.length} pesanan</p>
      </div>

      <div className="orders-list">
        {customerOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h4 className="order-project">{order.projectName}</h4>
                <p className="order-location">📍 {order.projectLocation}</p>
                <p className="order-date">📅 {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status">
                {getStatusBadge(order.status)}
              </div>
            </div>

            {order.projectDescription && (
              <div className="order-description">
                <p>{order.projectDescription}</p>
              </div>
            )}

            <div className="order-details">
              <div className="project-timeline">
                {order.startDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Mulai:</span>
                    <span className="timeline-value">
                      {new Date(order.startDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
                {order.endDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Selesai:</span>
                    <span className="timeline-value">
                      {new Date(order.endDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              <div className="order-items">
                <h5>Detail Material ({order.items.length} item)</h5>
                <div className="items-summary">
                  {order.items.map(item => (
                    <div key={item.id} className="item-summary">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-qty">{item.quantity} {item.product.unit}</span>
                      <span className="item-price">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total">
                <span className="total-label">Total RAB:</span>
                <span className="total-amount">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="order-actions">
              <button className="btn-view-detail">
                Lihat Detail
              </button>
              <button className="btn-contact">
                Hubungi Tim
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;