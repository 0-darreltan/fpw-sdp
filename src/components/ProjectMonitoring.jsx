import React, { useState } from "react";

const ProjectMonitoring = ({
  projects,
  orders,
  users,
  onAddProject,
  onUpdateProject,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "planning",
    projectManager: "",
    description: "",
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
        progress: 0,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      client: "",
      location: "",
      startDate: "",
      endDate: "",
      budget: "",
      status: "planning",
      projectManager: "",
      description: "",
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
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      budget: project.budget?.toString() || "",
      status: project.status,
      projectManager: project.projectManager,
      description: project.description || "",
    });
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: {
        label: "Perencanaan",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      in_progress: {
        label: "Dalam Progres",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      on_hold: {
        label: "Ditunda",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      },
      completed: {
        label: "Selesai",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
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

  const getProgressBar = (progress) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
          {progress}%
        </span>
      </div>
    );
  };

  const getProjectOrders = (projectId) => {
    return orders.filter((order) => order.projectId === projectId);
  };

  const getProjectManager = (pmId) => {
    const pm = users.find((user) => user.id === pmId);
    return pm ? pm.name : "Belum ditentukan";
  };

  const projectManagers = users.filter(
    (user) => user.role === "project_manager"
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Monitor Proyek
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Kelola semua proyek konstruksi
          </p>
        </div>
        <button
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          onClick={() => setShowModal(true)}
        >
          + Tambah Proyek
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const projectOrders = getProjectOrders(project.id);

          return (
            <div
              key={project.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                  {project.name}
                </h4>
                {getStatusBadge(project.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Klien:</span>{" "}
                    {project.client}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Lokasi:</span>{" "}
                    {project.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">PM:</span>{" "}
                    {getProjectManager(project.projectManager)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">Budget:</span>{" "}
                    {formatPrice(project.budget)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mulai
                  </span>
                  <span className="text-gray-900">
                    {formatDate(project.startDate)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selesai
                  </span>
                  <span className="text-gray-900">
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                </div>
                {getProgressBar(project.progress || 0)}
              </div>

              <div className="flex justify-between items-center mb-4 py-3 bg-white rounded-lg border border-gray-200">
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {projectOrders.length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Pesanan
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-green-600">
                    {
                      projectOrders.filter((o) => o.status === "completed")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Selesai
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 text-sm font-medium">
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h4 className="text-xl font-bold text-gray-900">
                {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
              </h4>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={resetForm}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Proyek
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Klien
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="planning">Perencanaan</option>
                      <option value="in_progress">Dalam Progres</option>
                      <option value="on_hold">Ditunda</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Manager
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.projectManager}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectManager: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Pilih Project Manager</option>
                      {projectManagers.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                  onClick={resetForm}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {editingProject ? "Update" : "Tambah"}
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
