import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer',
    name: '',
    email: '',
    phone: ''
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'customer',
      name: '',
      email: '',
      phone: ''
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData });
    } else {
      onAddUser(formData);
    }
    
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      onDeleteUser(userId);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Administrator', class: 'role-admin' },
      customer: { label: 'Customer', class: 'role-customer' },
      project_manager: { label: 'Project Manager', class: 'role-pm' }
    };

    const config = roleConfig[role] || { label: role, class: 'role-default' };
    
    return (
      <span className={`role-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: '👑',
      customer: '👤',
      project_manager: '👨‍💼'
    };
    return icons[role] || '👤';
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h3>Kelola User</h3>
        <button 
          className="btn-add-user"
          onClick={() => setShowAddForm(true)}
        >
          + Tambah User
        </button>
      </div>

      {(showAddForm || editingUser) && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Tambah User Baru'}</h3>
              <button 
                className="modal-close"
                onClick={() => resetForm()}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Username unik"
                  />
                </div>
                
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nama lengkap"
                  />
                </div>
                
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label>No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {getRoleIcon(user.role)}
            </div>
            
            <div className="user-info">
              <h4 className="user-name">{user.name}</h4>
              <p className="user-username">@{user.username}</p>
              <div className="user-role">
                {getRoleBadge(user.role)}
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <span className="detail-text">{user.email}</span>
              </div>
              {user.phone && (
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <span className="detail-text">{user.phone}</span>
                </div>
              )}
            </div>

            <div className="user-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEdit(user)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(user.id)}
                disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="users-summary">
        <div className="summary-card">
          <h4>Ringkasan User</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
              <span className="stat-label">Administrator</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.role === 'project_manager').length}</span>
              <span className="stat-label">Project Manager</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.role === 'customer').length}</span>
              <span className="stat-label">Customer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;