import React, { useState } from "react";

const ProjectList = ({ projects, user, onEditProject, onRequestMaterial }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filter projects assigned to current PM
  // Handle both string IDs and ObjectId comparisons
  const userId = user?.id || user?._id;
  
  let myProjects = [];
  
  if (userId && projects && projects.length > 0) {
    myProjects = projects.filter((project) => {
      const projectManagerId = project.projectManagerId?._id || project.projectManagerId;
      const isMatch = String(projectManagerId) === String(userId);
      return isMatch;
    });
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: {
        label: "Perencanaan",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      active: {
        label: "Aktif",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      on_hold: {
        label: "Ditunda",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      },
      completed: {
        label: "Selesai",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      cancelled: {
        label: "Dibatalkan",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
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

  // Loading state
  if (!projects) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Memuat Data...
          </h4>
          <p className="text-gray-600">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    );
  }
  
  if (myProjects.length === 0) {
    // Check if there are projects but none match the current user
    const hasProjectsInDb = projects && projects.length > 0;
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Proyek Saya
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Kelola proyek yang ditugaskan kepada Anda
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏗️</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {hasProjectsInDb ? "Tidak Ada Proyek yang Ditugaskan" : "Belum Ada Proyek"}
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Anda belum memiliki proyek. Klik tombol "Tambah Proyek" di atas untuk membuat proyek baru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Proyek Saya
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Total {myProjects.length} proyek aktif
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {myProjects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-1">📍</span>
                  {project.location}
                </p>
              </div>
              <div className="ml-4">{getStatusBadge(project.status)}</div>
            </div>

            {project.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {project.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.startDate && (
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mulai:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {getProgressPercentage(project)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(project)}%` }}
                  ></div>
                </div>
              </div>

              {project.budget && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Budget:
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(project.budget)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-gray-200">
              <button 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                onClick={() => {
                  setSelectedProject(project);
                  setShowDetailModal(true);
                }}
              >
                Lihat Detail
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                onClick={() => {
                  if (onRequestMaterial) {
                    onRequestMaterial(project);
                  }
                }}
              >
                Minta Material
              </button>
              {onEditProject && (
                <button
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm font-medium"
                  onClick={() => onEditProject(project)}
                >
                  Edit Proyek
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Project */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Detail Proyek</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h4>
                {getStatusBadge(selectedProject.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Lokasi</p>
                  <p className="text-sm text-gray-900">{selectedProject.location}</p>
                </div>
                
                {selectedProject.startDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tanggal Mulai</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedProject.startDate)}</p>
                  </div>
                )}
                
                {selectedProject.endDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Target Selesai</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedProject.endDate)}</p>
                  </div>
                )}
                
                {selectedProject.budget && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(selectedProject.budget)}</p>
                  </div>
                )}
              </div>

              {selectedProject.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Deskripsi</p>
                  <p className="text-sm text-gray-700">{selectedProject.description}</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">Progress Proyek</p>
                  <p className="text-lg font-bold text-blue-600">{getProgressPercentage(selectedProject)}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(selectedProject)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              {onEditProject && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onEditProject(selectedProject);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium"
                >
                  Edit Proyek
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProject(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
