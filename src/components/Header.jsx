import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'customer':
        return 'Customer';
      case 'project_manager':
        return 'Project Manager';
      default:
        return role;
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-section">
          <img src="/agung-logo.png" alt="Agung Beton" className="header-logo" />
          <div>
            <h1>Agung Beton Kendari</h1>
            <p>Sistem Manajemen Proyek</p>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">({getRoleDisplayName(user?.role)})</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;