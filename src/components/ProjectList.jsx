import React from "react";

const ProjectList = ({ projects, user }) => {
  // Filter projects assigned to current PM
  const myProjects = projects.filter(
    (project) => project.projectManagerId === user.id
  );

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

  if (myProjects.length === 0) {
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
            Belum Ada Proyek
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Anda belum ditugaskan pada proyek apapun. Hubungi administrator
            untuk penugasan proyek.
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
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                Lihat Detail
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
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
