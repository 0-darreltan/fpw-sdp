import React from 'react';
import './ProjectList.css';

const ProjectList = ({ projects, user }) => {
  
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
      active: { label: 'Aktif', class: 'status-active' },
      on_hold: { label: 'Ditunda', class: 'status-hold' },
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
        <h3>Proyek Saya</h3>
        <p>Total {myProjects.length} proyek aktif</p>
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

            {project.description && (
              <div className="project-description">
                <p>{project.description}</p>
              </div>
            )}

            <div className="project-details">
              <div className="project-timeline">
                {project.startDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Mulai:</span>
                    <span className="timeline-value">{formatDate(project.startDate)}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Target:</span>
                    <span className="timeline-value">{formatDate(project.endDate)}</span>
                  </div>
                )}
              </div>

              <div className="project-progress">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{getProgressPercentage(project)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(project)}%` }}
                  ></div>
                </div>
              </div>

              {project.budget && (
                <div className="project-budget">
                  <span className="budget-label">Budget:</span>
                  <span className="budget-amount">
                    {formatPrice(project.budget)}
                  </span>
                </div>
              )}
            </div>

            <div className="project-actions">
              <button className="btn-view-detail">
                Lihat Detail
              </button>
              <button className="btn-request-material">
                Minta Material
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;