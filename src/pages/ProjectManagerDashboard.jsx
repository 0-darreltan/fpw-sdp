import React, { useState } from 'react';
import ProjectList from '../components/ProjectListNew';
import MaterialRequest from '../components/MaterialRequest';
import './ProjectManagerDashboard.css';

const ProjectManagerDashboard = ({ user, projects, products }) => {
  const [activeTab, setActiveTab] = useState('projects');

  const tabs = [
    { id: 'projects', label: 'Proyek Saya', icon: '🏗️' },
    { id: 'materials', label: 'Permintaan Material', icon: '📦' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectList projects={projects} user={user} />;
      case 'materials':
        return <MaterialRequest products={products} user={user} projects={projects} />;
      default:
        return <ProjectList projects={projects} user={user} />;
    }
  };

  return (
    <div className="pm-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Project Manager</h2>
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

export default ProjectManagerDashboard;