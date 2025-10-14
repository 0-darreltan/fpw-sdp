import React, { useState } from 'react';
import './ProjectMonitoring.css';

const ProjectMonitoring = ({ projects, orders, users, onAddProject, onUpdateProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    projectManager: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      budget: parseFloat(formData.budget),
    };

    if (editingProject) {
      onUpdateProject(editingProject.id, projectData);
    } else {
      onAddProject({
        id: Date.now(),
        ...projectData,
        createdAt: new Date().toISOString(),
        progress: 0
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'planning',
      projectManager: '',
      description: ''
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client: project.client,
      location: project.location,
      startDate: project.startDate?.split('T')[0] || '',
      endDate: project.endDate?.split('T')[0] || '',
      budget: project.budget?.toString() || '',
      status: project.status,
      projectManager: project.projectManager,
      description: project.description || ''
    });
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Perencanaan', class: 'status-planning' },
      in_progress: { label: 'Dalam Progres', class: 'status-progress' },
      on_hold: { label: 'Ditunda', class: 'status-hold' },
      completed: { label: 'Selesai', class: 'status-completed' },
      cancelled: { label: 'Dibatalkan', class: 'status-cancelled' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getProgressBar = (progress) => {
    return (
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <span className="progress-text">{progress}%</span>
      </div>
    );
  };

  const getProjectOrders = (projectId) => {
    return orders.filter(order => order.projectId === projectId);
  };

  const getProjectManager = (pmId) => {
    const pm = users.find(user => user.id === pmId);
    return pm ? pm.name : 'Belum ditentukan';
  };

  const projectManagers = users.filter(user => user.role === 'project_manager');

  return (
    <div className="project-monitoring">
      <div className="management-header">
        <h3>Monitor Proyek</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Tambah Proyek
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => {
          const projectOrders = getProjectOrders(project.id);
          
          return (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.name}</h4>
                {getStatusBadge(project.status)}
              </div>
              
              <div className="project-info">
                <p><strong>Klien:</strong> {project.client}</p>
                <p><strong>Lokasi:</strong> {project.location}</p>
                <p><strong>PM:</strong> {getProjectManager(project.projectManager)}</p>
                <p><strong>Budget:</strong> {formatPrice(project.budget)}</p>
              </div>

              <div className="project-timeline">
                <p><strong>Mulai:</strong> {formatDate(project.startDate)}</p>
                <p><strong>Selesai:</strong> {formatDate(project.endDate)}</p>
              </div>

              <div className="project-progress">
                <p><strong>Progress:</strong></p>
                {getProgressBar(project.progress || 0)}
              </div>

              <div className="project-stats">
                <div className="stat">
                  <span className="stat-value">{projectOrders.length}</span>
                  <span className="stat-label">Pesanan</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {projectOrders.filter(o => o.status === 'completed').length}
                  </span>
                  <span className="stat-label">Selesai</span>
                </div>
              </div>

              <div className="project-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button className="btn btn-sm btn-outline">
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h4>{editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h4>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Proyek</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Klien</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Lokasi</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="planning">Perencanaan</option>
                    <option value="in_progress">Dalam Progres</option>
                    <option value="on_hold">Ditunda</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Project Manager</label>
                  <select
                    value={formData.projectManager}
                    onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                    required
                  >
                    <option value="">Pilih Project Manager</option>
                    {projectManagers.map(pm => (
                      <option key={pm.id} value={pm.id}>{pm.name}</option>
                    ))}
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
                  {editingProject ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMonitoring;