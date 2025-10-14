import React, { useState } from 'react';
import './ProjectList.css';

const ProjectList = ({ projects, user }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Filter projects assigned to current PM
  const myProjects = projects.filter(project => project.projectManagerId === user.id);

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
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Perencanaan', class: 'status-planning' },
      in_progress: { label: 'Dalam Pengerjaan', class: 'status-progress' },
      on_hold: { label: 'Tertunda', class: 'status-hold' },
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

  const getProjectOrders = () => {
    // In real app, orders would be linked to projects
    // For now, just return empty array
    return [];
  };

  const getProgressPercentage = (project) => {
    // Simple calculation based on project dates
    if (!project.startDate || !project.endDate) return 0;
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  if (myProjects.length === 0) {
    return (
      <div className="project-list">
        <div className="list-header">
          <h3>Proyek Saya</h3>
          <p>Kelola proyek yang ditugaskan kepada Anda</p>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">🏗️</div>
          <h4>Belum Ada Proyek</h4>
          <p>Anda belum ditugaskan pada proyek apapun. Hubungi administrator untuk penugasan proyek.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="list-header">
        <h3>Proyek yang Dikelola</h3>
        <p>Daftar proyek yang sedang Anda kelola</p>
      </div>

      <div className="projects-grid">
        {myProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-info">
                <h4 className="project-name">{project.name}</h4>
                <p className="project-location">📍 {project.location}</p>
              </div>
              <div className="project-status">
                {getStatusBadge(project.status)}
              </div>
            </div>

            <div className="project-description">
              <p>{project.description}</p>
            </div>

            <div className="project-details">
              <div className="detail-row">
                <span className="detail-label">Budget:</span>
                <span className="detail-value budget">{formatPrice(project.budget)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Timeline:</span>
                <span className="detail-value">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${getProgressPercentage(project)}%`}}
                      ></div>
                    </div>
                    <span className="progress-text">{getProgressPercentage(project)}%</span>
                  </div>
                </span>
              </div>
            </div>

            <div className="project-stats">
              <div className="stat-item">
                <span className="stat-number">{getProjectOrders().length}</span>
                <span className="stat-label">Pesanan Terkait</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {Math.floor((new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="stat-label">Hari Berjalan</span>
              </div>
            </div>

            <div className="project-actions">
              <button 
                className="btn-view-detail"
                onClick={() => setSelectedProject(project)}
              >
                Lihat Detail
              </button>
              <button className="btn-update-progress">
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProject.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="project-detail-section">
                <h4>Informasi Proyek</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Lokasi:</span>
                    <span className="value">{selectedProject.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Budget:</span>
                    <span className="value">{formatPrice(selectedProject.budget)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mulai:</span>
                    <span className="value">{formatDate(selectedProject.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Selesai:</span>
                    <span className="value">{formatDate(selectedProject.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="project-detail-section">
                <h4>Pesanan Terkait</h4>
                <div className="related-orders">
                  {getProjectOrders().length > 0 ? (
                    getProjectOrders().map((order, index) => (
                      <div key={index} className="order-item">
                        <span className="order-name">{order.projectName}</span>
                        <span className="order-total">{formatPrice(order.total)}</span>
                        <span className="order-status">{getStatusBadge(order.status)}</span>
                      </div>
                    ))
                  ) : (
                    <p>Belum ada pesanan terkait dengan proyek ini</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;