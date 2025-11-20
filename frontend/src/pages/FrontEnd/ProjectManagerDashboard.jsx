import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialRequest from "../../components/materials/MaterialRequest";
import ProjectList from "../../components/projects/ProjectList";
import { actionProject } from "../../features/project/projectSlice";
import { actionProduct } from "../../features/product/productSlice";
import { actionOrder } from "../../features/order/orderSlice";
import { actionRab } from "../../features/RAB/rabSlice";
import api from "../../features/api";

const ProjectManagerDashboard = ({
  user,
  projects,
  products,
  materials,
  rabs,
  onUpdateRAB,
  onAddProject,
  onUpdateProject,
  onAddMaterialRequest,
}) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [rabsFetched, setRabsFetched] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Project add/edit state
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    location: "",
    description: "",
    projectManagerId: "",
    status: "planned",
    startDate: "",
    endDate: "",
    budget: "",
  });

  // Helper function to convert ISO date to yyyy-MM-dd format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // ---- Redux connections (only used when parent doesn't pass props) ----
  const dispatch = useDispatch();

  const storeUser = useSelector((s) => s.users.currUsers?.user) || null;
  user = user || storeUser;
  const rawProjects = useSelector((s) => s.project.listProjects) || [];
  const projectsLoading = useSelector((s) => s.project.loading);
  const projectsError = useSelector((s) => s.project.error);
  const rawProducts = useSelector((s) => s.product.listProducts) || [];
  const productsLoading = useSelector((s) => s.product.loading);
  const rawRabsFromStore = useSelector((s) => s.rab.listRabs);
  const rawRabs = Array.isArray(rawRabsFromStore) ? rawRabsFromStore : [];

  // Check if essential initial data is still loading (only projects and products)
  const isLoadingInitialData =
    !initialFetchDone && (projectsLoading || productsLoading);

  // normalize backend objects to the shape used by this component
  const normProjects = rawProjects.map((p) => ({
    id: p._id || p.id,
    name: p.name,
    location: p.location,
    description: p.description,
    projectManagerId:
      p.projectManagerId && (p.projectManagerId._id || p.projectManagerId),
    status: p.status,
    startDate: p.startDate,
    endDate: p.endDate,
    budget: p.budget,
  }));

  const normProducts = rawProducts.map((pr) => ({
    id: pr._id || pr.id,
    name: pr.name,
    price: pr.price ?? pr.unitPrice ?? 0,
    unit: pr.unit || "pcs",
    ...pr,
  }));

  const normRabs = Array.isArray(rawRabs)
    ? rawRabs.map((r) => ({
        id: r._id || r.id,
        projectName: r.title || r.projectName || "",
        description: r.description || "",
        customerId: r.customerId && (r.customerId._id || r.customerId),
        location: r.location || "",
        items: r.items || [],
        totalEstimate: r.totalEstimated || r.totalEstimate || 0,
        status: r.status,
        createdAt: r.createdAt,
        proposedPrice: r.proposedPrice,
        agreedPrice: r.agreedPrice,
        ...r,
      }))
    : [];

  // Expose data either from props (parent) or from store

  // Fetch initial data - optimized with Promise.all for faster parallel loading
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Only fetch essential data initially (projects and products)
        // Other data will be fetched when needed
        await Promise.all([
          dispatch(actionProject.fetchProjects()),
          dispatch(actionProduct.fetchProduct()),
        ]);
        setInitialFetchDone(true);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setInitialFetchDone(true); // Still set to true to prevent infinite loading
      }
    };

    if (!initialFetchDone) {
      fetchAllData();
    }
  }, [initialFetchDone, dispatch]);

  // Lazy load rabs when rabs tab is active
  useEffect(() => {
    if (activeTab === "rabs" && !rabsFetched) {
      dispatch(actionRab.fetchRabs());
      setRabsFetched(true);
    }
  }, [activeTab, rabsFetched, dispatch]);

  // Handlers that dispatch to slices (used when parent doesn't pass handlers)
  const handleAddProject = async (payload) => {
    try {
      const res = await dispatch(actionProject.createProject(payload)).unwrap();
      showToast("Proyek berhasil ditambahkan", "success");
      // Refresh data
      dispatch(actionProject.fetchProjects());
      return res;
    } catch (err) {
      console.error("Failed to create project", err);
      showToast(
        "Gagal menambahkan proyek: " + (err.message || "Unknown error"),
        "error"
      );
    }
  };

  // If parent didn't pass props, fallback the param variables to our normalized data
  projects = projects || normProjects;
  products = products || normProducts;
  rabs = rabs || normRabs;

  // Use our handlers when parent didn't pass handlers (assigned after handlers defined)

  const handleUpdateProject = async (payload) => {
    try {
      console.log("Update payload:", payload);
      const res = await dispatch(actionProject.updateProject(payload)).unwrap();
      showToast("Proyek berhasil diperbarui", "success");
      // Refresh data
      dispatch(actionProject.fetchProjects());
      return res;
    } catch (err) {
      console.error("Failed to update project", err);
      console.error("Error response:", err.response?.data);
      showToast(
        "Gagal memperbarui proyek: " + (err.message || "Unknown error"),
        "error"
      );
    }
  };

  // toast local state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const showToast = (message, type = "info", timeout = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      timeout
    );
  };

  const handleAddMaterialRequest = async (payload) => {
    try {
      const res = await dispatch(actionOrder.createOrder(payload)).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to create material request", err);
    }
  };

  // Use final handlers - either from props or local
  const finalAddProject = onAddProject || handleAddProject;
  const finalUpdateProject = onUpdateProject || handleUpdateProject;
  const finalAddMaterialRequest =
    onAddMaterialRequest || handleAddMaterialRequest;

  const tabs = [
    { id: "projects", label: "Proyek Saya", icon: "🏗️" },
    { id: "materials", label: "Permintaan Material", icon: "📦" },
    { id: "rabs", label: "RAB / Penawaran", icon: "💼" },
  ];

  // Handler untuk request material dari ProjectList
  const handleRequestMaterial = () => {
    // Pindah ke tab materials
    setActiveTab("materials");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "projects":
        // project form modal / inline
        return (
          <div>
            {editingProject !== null && (
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h4 className="text-lg font-medium mb-3">
                  {editingProject?.id ? "Edit Proyek" : "Tambah Proyek"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="border rounded p-2"
                    placeholder="Nama proyek"
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="border rounded p-2"
                    placeholder="Lokasi"
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm((p) => ({
                        ...p,
                        location: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="border rounded p-2 col-span-1 sm:col-span-2"
                    rows={3}
                    placeholder="Deskripsi"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="border rounded p-2"
                    value={projectForm.startDate}
                    onChange={(e) =>
                      setProjectForm((p) => ({
                        ...p,
                        startDate: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="border rounded p-2"
                    value={projectForm.endDate}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, endDate: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    className="border rounded p-2"
                    placeholder="Budget"
                    value={projectForm.budget}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, budget: e.target.value }))
                    }
                  />
                  <select
                    className="border rounded p-2"
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded"
                    onClick={async () => {
                      const payload = {
                        ...projectForm,
                        projectManagerId: user?.id || user?._id,
                      };

                      try {
                        if (editingProject?.id) {
                          // existing project update
                          await finalUpdateProject({
                            ...payload,
                            id: editingProject.id,
                          });
                        } else {
                          // create new project
                          await finalAddProject(payload);
                        }

                        // Reset form after success
                        setEditingProject(null);
                        setProjectForm({
                          name: "",
                          location: "",
                          description: "",
                          projectManagerId: user?.id || user?._id,
                          status: "planned",
                          startDate: "",
                          endDate: "",
                          budget: "",
                        });
                      } catch (err) {
                        console.error("Error saving project:", err);
                      }
                    }}
                  >
                    Simpan
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-300 rounded"
                    onClick={() => {
                      setEditingProject(null);
                    }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Proyek Saya</h3>
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded"
                onClick={() => setEditingProject({})}
              >
                Tambah Proyek
              </button>
            </div>

            {/* Loading State */}
            {projectsLoading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-gray-600">Memuat data proyek...</p>
              </div>
            )}

            {/* Error State */}
            {projectsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  <strong>Error:</strong> {projectsError}
                </p>
                <button
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => dispatch(actionProject.fetchProjects())}
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Project List */}
            {!projectsLoading && !projectsError && (
              <ProjectList
                projects={projects}
                user={user}
                onEditProject={(p) => {
                  setEditingProject(p || {});
                  // Validate status - only use if it's a valid value
                  const validStatuses = [
                    "planned",
                    "in-progress",
                    "completed",
                    "cancelled",
                  ];
                  const validStatus = validStatuses.includes(p?.status)
                    ? p.status
                    : "planned";

                  setProjectForm({
                    name: p?.name || "",
                    location: p?.location || "",
                    description: p?.description || "",
                    projectManagerId: p?.projectManagerId || user?.id,
                    status: validStatus,
                    startDate: formatDateForInput(p?.startDate) || "",
                    endDate: formatDateForInput(p?.endDate) || "",
                    budget: p?.budget || "",
                  });
                }}
                onRequestMaterial={handleRequestMaterial}
              />
            )}
          </div>
        );
      case "materials":
        return (
          <MaterialRequest
            products={products}
            materials={materials}
            user={user}
            projects={projects}
            onAddMaterialRequest={finalAddMaterialRequest}
          />
        );
      case "rabs":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Semua Pengajuan RAB</h3>
            <div className="grid gap-4">
              {rabs.length === 0 ? (
                <div className="text-gray-500">Belum ada pengajuan RAB.</div>
              ) : (
                rabs.map((r) => (
                  <div key={r.id} className="border rounded p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{r.projectName}</div>
                        <div className="text-sm text-gray-600">
                          {r.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Diajukan oleh {r.customerName || r.customerId?.name || `user #${r.customerId?._id || r.customerId}`} •{" "}
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "-"}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          Lokasi: {r.location || "-"} • Luas: {r.area || "-"} •
                          Kategori: {r.category || "-"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm">
                          Status:{" "}
                          <span className="font-medium">{r.status}</span>
                        </div>
                        <div className="flex gap-2">
                          {onUpdateRAB && (
                            <>
                              <button
                                className="px-3 py-2 bg-green-600 text-white rounded"
                                onClick={() =>
                                  onUpdateRAB({
                                    ...r,
                                    status: "Dalam Perhitungan",
                                  })
                                }
                              >
                                Teruskan ke Estimator
                              </button>
                              <button
                                className="px-3 py-2 bg-yellow-500 text-white rounded"
                                onClick={() =>
                                  onUpdateRAB({ ...r, status: "Perlu Revisi" })
                                }
                              >
                                Tandai Perlu Revisi
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">
                        Total estimasi: Rp{" "}
                        {Number(r.totalEstimate || 0).toLocaleString()}
                      </div>
                      {r.proposedPrice && (
                        <div className="mt-2 text-sm text-blue-700">
                          Tawaran pelanggan: Rp{" "}
                          {Number(r.proposedPrice).toLocaleString()}
                        </div>
                      )}
                      {r.agreedPrice && (
                        <div className="mt-2 text-sm text-green-700">
                          Harga disepakati: Rp{" "}
                          {Number(r.agreedPrice).toLocaleString()}
                        </div>
                      )}
                      {r.proposedPrice && onUpdateRAB && (
                        <div className="mt-3 flex gap-2">
                          <button
                            className="px-3 py-2 bg-green-600 text-white rounded"
                            onClick={() =>
                              onUpdateRAB({
                                ...r,
                                status: "Disetujui",
                                agreedPrice: r.proposedPrice,
                              })
                            }
                          >
                            Setujui & Buat Kontrak
                          </button>
                          <button
                            className="px-3 py-2 bg-red-500 text-white rounded"
                            onClick={() =>
                              onUpdateRAB({ ...r, status: "Perlu Revisi" })
                            }
                          >
                            Tolak / Minta Revisi
                          </button>
                        </div>
                      )}
                      {/* itemized table */}
                      {r.items && r.items.length > 0 && (
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="py-2">Item</th>
                                <th className="py-2">Jenis</th>
                                <th className="py-2">Jumlah</th>
                                <th className="py-2">Satuan</th>
                                <th className="py-2">Harga Satuan</th>
                                <th className="py-2">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.items.map((it, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="py-2">{it.name}</td>
                                  <td className="py-2">
                                    {it.type || "Produk"}
                                  </td>
                                  <td className="py-2">{it.qty} </td>
                                  <td className="py-2">{it.unit || "-"}</td>
                                  <td className="py-2">
                                    Rp {Number(it.price || 0).toLocaleString()}
                                  </td>
                                  <td className="py-2">
                                    Rp{" "}
                                    {Number(
                                      (it.qty || 0) * (it.price || 0)
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan={5}
                                  className="py-2 font-medium text-right"
                                >
                                  Total Biaya RAB
                                </td>
                                <td className="py-2 font-medium">
                                  Rp{" "}
                                  {Number(
                                    r.totalEstimate || 0
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return <ProjectList projects={projects} user={user} />;
    }
  };

  // Show loading if user not loaded yet OR initial data is still loading
  if (!user || isLoadingInitialData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Memuat Dashboard...
          </h3>
          <p className="text-gray-600">
            {!user ? "Memuat data user..." : "Memuat data proyek..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* toast */}
      {toast.show && (
        <div
          className={`fixed right-6 top-6 z-50 p-3 rounded shadow-md ${
            toast.type === "success"
              ? "bg-green-100 text-green-800"
              : toast.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {toast.message}
        </div>
      )}
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
