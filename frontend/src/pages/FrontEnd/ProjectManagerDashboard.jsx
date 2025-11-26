import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialRequest from "../../components/materials/MaterialRequest";
import ProjectList from "../../components/projects/ProjectList";
import RABReviewPanel from "../../components/projects/RABReviewPanel";
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
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [showRABReview, setShowRABReview] = useState(false);

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
    progress: p.progress || 0, // Add progress field
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
        projectManagerId: r.projectManagerId && (r.projectManagerId._id || r.projectManagerId),
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
        // Check if token exists before fetching
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setInitialFetchDone(true);
          return;
        }

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

  // Handler untuk approve RAB
  const handleApproveRAB = async (rabId, { items, totalEstimated, pmNotes }) => {
    try {
      console.log("Approving RAB:", { rabId, items, totalEstimated, pmNotes });
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/rabs/${rabId}/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map(item => ({
              materialName: item.materialName || item.description,
              description: item.description || "",
              quantity: parseFloat(item.quantity) || 0,
              unit: item.unit || "pcs",
              unitPrice: parseFloat(item.unitPrice) || 0,
              qty: parseFloat(item.quantity) || 0,
            })),
            pmNotes,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        // Show success message with project info
        if (data.project) {
          showToast(
            `✅ RAB berhasil disetujui! Proyek "${data.project.name}" telah dibuat dan masuk ke Proyek Saya.`, 
            "success"
          );
        } else {
          showToast("✅ RAB berhasil disetujui dan quotation dikirim!", "success");
        }
        
        setShowRABReview(false);
        setSelectedRAB(null);
        
        // Refresh RAB list and projects list
        dispatch(actionRab.fetchRabs());
        dispatch(actionProject.fetchProjects());
      } else {
        throw new Error(data.message || "Gagal approve RAB");
      }
    } catch (error) {
      console.error("Failed to approve RAB:", error);
      showToast("❌ Gagal approve RAB: " + error.message, "error");
    }
  };

  // Handler untuk reject RAB
  const handleRejectRAB = async (rabId, reason) => {
    try {
      console.log("Rejecting RAB:", { rabId, reason });
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/rabs/${rabId}/reject-by-pm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        showToast("RAB berhasil ditolak", "success");
        setShowRABReview(false);
        setSelectedRAB(null);
        
        // Refresh RAB list
        dispatch(actionRab.fetchRabs());
      } else {
        throw new Error(data.message || "Gagal reject RAB");
      }
    } catch (error) {
      console.error("Failed to reject RAB:", error);
      showToast("❌ Gagal reject RAB: " + error.message, "error");
    }
  };

  // Handler untuk update items RAB
  const handleUpdateRABItems = async (rabId, items) => {
    try {
      console.log("📝 Updating RAB items:", { rabId, items });
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/rabs/${rabId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map(item => {
              const materialName = item.materialName || item.description || "Material";
              return {
                productId: item.productId || "",
                materialName: materialName,
                description: item.description || materialName, // Use materialName as fallback
                quantity: parseFloat(item.quantity) || 0,
                unit: item.unit || "pcs",
                unitPrice: parseFloat(item.unitPrice) || 0,
              };
            }),
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        showToast("✅ Material berhasil diperbarui dan disimpan", "success");
        
        // Update selectedRAB with new items from server response
        if (selectedRAB) {
          setSelectedRAB({ 
            ...selectedRAB, 
            items: data.data?.items || items 
          });
        }
        
        // Refresh RAB list from server
        dispatch(actionRab.fetchRabs());
      } else {
        throw new Error(data.message || "Failed to update items");
      }
    } catch (error) {
      console.error("❌ Failed to update RAB items:", error);
      showToast("Gagal update material: " + error.message, "error");
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
            <div className="mb-4">
              <h3 className="text-lg font-medium">Proyek Saya</h3>
              <p className="text-sm text-gray-600 mt-1">Proyek otomatis dibuat saat approve RAB</p>
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
      case "rabs": {
        // Filter RAB yang perlu direview oleh PM ini
        const currentUserId = user?._id || user?.id;
        const pmRABs = normRabs.filter((r) => {
          const rabPMId = r.projectManagerId?._id || r.projectManagerId;
          const isMyRAB = !rabPMId || rabPMId === currentUserId;
          const isValidStatus = ["pending", "reviewed", "quoted"].includes(r.status);
          
          console.log("🔍 RAB Filter Debug:", {
            rabId: r.id,
            title: r.title || r.projectName,
            status: r.status,
            rabPMId,
            currentUserId,
            isMyRAB,
            isValidStatus,
            willShow: isValidStatus && isMyRAB
          });
          
          return isValidStatus && isMyRAB;
        });

        if (showRABReview && selectedRAB) {
          return (
            <div>
              <button
                onClick={() => {
                  setShowRABReview(false);
                  setSelectedRAB(null);
                }}
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Kembali ke Daftar RAB
              </button>
              <RABReviewPanel
                rab={selectedRAB}
                onApprove={(data) => handleApproveRAB(selectedRAB._id || selectedRAB.id, data)}
                onReject={(reason) => handleRejectRAB(selectedRAB._id || selectedRAB.id, reason)}
                onUpdateItems={(items) => handleUpdateRABItems(selectedRAB._id || selectedRAB.id, items)}
              />
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Permintaan RAB untuk Review</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {pmRABs.length} Permintaan
              </span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Tugas PM:</h4>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Mereview permintaan pekerjaan pelanggan</li>
                <li>Merekomendasikan material yang benar</li>
                <li>Menambah/menghapus/mengubah material berdasarkan kebutuhan proyek</li>
                <li>Menyusun atau memperbaiki RAB</li>
                <li>Memberikan estimasi pekerjaan</li>
                <li>Menyetujui atau Menolak permintaan proyek</li>
              </ul>
            </div>

            <div className="grid gap-4">
              {pmRABs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">Tidak ada permintaan RAB yang perlu direview</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Permintaan RAB baru dari customer akan muncul di sini
                  </p>
                </div>
              ) : (
                pmRABs.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">{r.title || r.projectName}</h4>
                        <p className="text-gray-600 mt-1">{r.description}</p>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-4">
                        {r.status === "pending"
                          ? "Menunggu Review"
                          : r.status === "reviewed"
                          ? "Dalam Review"
                          : "Quotation Dikirim"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <p className="font-medium">{r.customerName || "-"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Lokasi:</span>
                        <p className="font-medium">{r.location || "-"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estimasi Budget:</span>
                        <p className="font-medium">
                          {r.estimatedBudget
                            ? `Rp ${Number(r.estimatedBudget).toLocaleString("id-ID")}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tanggal Mulai:</span>
                        <p className="font-medium">
                          {r.expectedStartDate
                            ? new Date(r.expectedStartDate).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tanggal Pengajuan:</span>
                        <p className="font-medium">
                          {r.submittedAt
                            ? new Date(r.submittedAt).toLocaleDateString("id-ID")
                            : r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("id-ID")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Material Diminta:</span>
                        <p className="font-medium">{r.items?.length || 0} item</p>
                      </div>
                    </div>

                    {r.customerNotes && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 text-sm">
                        <span className="font-medium text-gray-700">Catatan Customer:</span>
                        <p className="text-gray-600 mt-1">{r.customerNotes}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedRAB(r);
                          setShowRABReview(true);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        🔍 Review & Buat Penawaran
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

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
