import React, { useState } from 'react';
import ProjectList from "../components/ProjectList";
import MaterialRequest from "../components/MaterialRequest";

const ProjectManagerDashboard = ({ user, projects, products }) => {
  const [activeTab, setActiveTab] = useState("projects");

  const tabs = [
    { id: "projects", label: "Proyek Saya", icon: "🏗️" },
    { id: "materials", label: "Permintaan Material", icon: "📦" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "projects":
        return <ProjectList projects={projects} user={user} />;
      case "materials":
        return (
          <MaterialRequest
            products={products}
            user={user}
            projects={projects}
          />
        );
      default:
        return <ProjectList projects={projects} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Project Manager
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Selamat datang, {user?.name}!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;