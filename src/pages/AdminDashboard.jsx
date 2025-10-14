import React, { useState } from 'react';
import UserManagement from '../components/UserManagement';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import ProjectMonitoring from '../components/ProjectMonitoring';
import './AdminDashboard.css';

const AdminDashboard = ({ 
  user, 
  data, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onUpdateOrder,
  onAddProject,
  onUpdateProject 
}) => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Kelola Pesanan', icon: '📋', count: data.orders.length },
    { id: 'projects', label: 'Monitor Proyek', icon: '🏗️', count: data.projects.length },
    { id: 'users', label: 'Kelola User', icon: '👥', count: data.users.length },
    { id: 'products', label: 'Kelola Produk', icon: '📦', count: data.products.length }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <OrderManagement 
            orders={data.orders} 
            onUpdateOrder={onUpdateOrder}
          />
        );
      case 'projects':
        return (
          <ProjectMonitoring 
            projects={data.projects}
            orders={data.orders}
            users={data.users}
            onAddProject={onAddProject}
            onUpdateProject={onUpdateProject}
          />
        );
      case 'users':
        return (
          <UserManagement 
            users={data.users}
            onAddUser={onAddUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        );
      case 'products':
        return (
          <ProductManagement 
            products={data.products}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      default:
        return (
          <OrderManagement 
            orders={data.orders} 
            onUpdateOrder={onUpdateOrder}
          />
        );
    }
  };

  const getTabLabel = (tab) => {
    return (
      <div className="tab-content">
        <span className="tab-icon">{tab.icon}</span>
        <span className="tab-text">{tab.label}</span>
        {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Administrator</h2>
        <p>Selamat datang, {user?.name}! Panel kontrol sistem manajemen proyek</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{data.orders.length}</h3>
            <p>Total Pesanan</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{data.users.length}</h3>
            <p>Total User</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{data.products.length}</h3>
            <p>Total Produk</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏗️</div>
          <div className="stat-info">
            <h3>{data.projects.length}</h3>
            <p>Proyek Aktif</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;