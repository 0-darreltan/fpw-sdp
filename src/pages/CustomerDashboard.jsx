import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import OrderHistory from '../components/OrderHistory';
import ProductCatalog from '../components/ProductCatalog';
import './CustomerDashboard.css';

const CustomerDashboard = ({ user, products, orders, onAddOrder }) => {
  const [activeTab, setActiveTab] = useState('catalog');

  const tabs = [
    { id: 'catalog', label: 'Katalog Produk', icon: '📦' },
    { id: 'order', label: 'Buat Pesanan', icon: '📝' },
    { id: 'history', label: 'Riwayat Pesanan', icon: '📋' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'catalog':
        return <ProductCatalog products={products} />;
      case 'order':
        return <OrderForm products={products} user={user} onAddOrder={onAddOrder} />;
      case 'history':
        return <OrderHistory orders={orders} user={user} />;
      default:
        return <ProductCatalog products={products} />;
    }
  };

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Customer</h2>
        <p>Selamat datang, {user?.name}!</p>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default CustomerDashboard;