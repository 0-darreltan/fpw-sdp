import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialRequest from "../../components/materials/MaterialRequest";
import { actionProject } from "../../features/project/projectSlice";
import { actionProduct } from "../../features/product/productSlice";
import { actionProposal } from "../../features/proposal/proposalSlice";
import { actionOrder } from "../../features/order/orderSlice";
import { actionRab } from "../../features/RAB/rabSlice";
import api from "../../features/api";

const ProjectManagerDashboard = ({
  user,
  projects,
  products,
  materials,
  rabs,
  proposals,
  onAddProposal,
  onUpdateProposal,
  onSendProposal,
  onUpdateRAB,
  onAddProject,
  onUpdateProject,
  onAddMaterialRequest,
}) => {
  const [activeTab, setActiveTab] = useState("projects");

  // RAB / proposal local UI state
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [proposalItems, setProposalItems] = useState([]);
  const [pItemName, setPItemName] = useState("");
  const [pItemQty, setPItemQty] = useState(1);
  const [pItemPrice, setPItemPrice] = useState(0);
  const [proposalNote, setProposalNote] = useState("");
  // Project add/edit state
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    location: "",
    description: "",
    projectManagerId: user?.id,
    status: "planning",
    startDate: "",
    endDate: "",
    budget: "",
  });

  // ---- Redux connections (only used when parent doesn't pass props) ----
  const dispatch = useDispatch();

  const storeUser = useSelector((s) => s.users.currUsers?.user) || null;
  user = user || storeUser;
  const rawProjects = useSelector((s) => s.project.listProjects) || [];
  const rawProducts = useSelector((s) => s.product.listProducts) || [];
  const rawProposals = useSelector((s) => s.proposal.listProposals) || [];
  const rawRabs = useSelector((s) => s.rab.listRabs) || [];

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

  const normProposals = rawProposals.map((pf) => ({
    id: pf._id || pf.id,
    projectName: pf.projectName || pf.rabId?.projectId?.name || "",
    createdAt: pf.createdAt,
    total: pf.total,
    status: pf.status,
    ...pf,
  }));

  const normRabs = rawRabs.map((r) => ({
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
  }));

  // Expose data either from props (parent) or from store

  // Fetch initial data if parent didn't provide them
  useEffect(() => {
    if (!projects) dispatch(actionProject.fetchProjects());
    if (!products) dispatch(actionProduct.fetchProduct());
    if (typeof proposals === "undefined")
      dispatch(actionProposal.fetchProposals());
    if (!rabs) dispatch(actionRab.fetchRabs());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers that dispatch to slices (used when parent doesn't pass handlers)
  const handleAddProject = async (payload) => {
    if (onAddProject) return onAddProject(payload);
    try {
      const res = await dispatch(actionProject.createProject(payload)).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  // If parent didn't pass props, fallback the param variables to our normalized data
  projects = projects || normProjects;
  products = products || normProducts;
  proposals = typeof proposals !== "undefined" ? proposals : normProposals;
  materials = typeof materials !== "undefined" ? materials : normProducts;
  rabs = rabs || normRabs;

  // Use our handlers when parent didn't pass handlers (assigned after handlers defined)

  const handleUpdateProject = async (payload) => {
    if (onUpdateProject) return onUpdateProject(payload);
    try {
      const res = await dispatch(actionProject.updateProject(payload)).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const handleAddProposal = async (payload) => {
    if (onAddProposal) return onAddProposal(payload);
    try {
      const res = await dispatch(
        actionProposal.createProposal(payload)
      ).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to create proposal", err);
    }
  };

  const handleUpdateProposal = async (payload) => {
    if (onUpdateProposal) return onUpdateProposal(payload);
    try {
      const res = await dispatch(
        actionProposal.updateProposal(payload)
      ).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to update proposal", err);
    }
  };

  const handleSendProposal = async (id) => {
    if (onSendProposal) return onSendProposal(id);
    try {
      // set status to sent
      const existing = rawProposals.find((p) => (p._id || p.id) === id);
      if (!existing) return;
      const payload = { ...(existing || {}), status: "sent" };
      const res = await dispatch(
        actionProposal.updateProposal(payload)
      ).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to send proposal", err);
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

  const handleAcceptProposal = async (id) => {
    try {
      const res = await api.post(`/users/accept-proposal`, { proposalId: id });
      showToast("Proposal berhasil disetujui", "success");
      // refresh proposals
      dispatch(actionProposal.fetchProposals());
      return res.data;
    } catch (err) {
      console.error("accept error", err);
      showToast("Gagal menyetujui proposal", "error");
    }
  };

  const handleRejectProposal = async (id) => {
    try {
      const res = await api.post(`/users/reject-proposal`, { proposalId: id });
      showToast("Proposal berhasil ditolak", "success");
      dispatch(actionProposal.fetchProposals());
      return res.data;
    } catch (err) {
      console.error("reject error", err);
      showToast("Gagal menolak proposal", "error");
    }
  };

  const handleAddMaterialRequest = async (payload) => {
    if (onAddMaterialRequest) return onAddMaterialRequest(payload);
    try {
      const res = await dispatch(actionOrder.createOrder(payload)).unwrap();
      return res;
    } catch (err) {
      console.error("Failed to create material request", err);
    }
  };

  // Fallback: wire prop handlers to our local handlers when parent didn't provide them
  onAddProject = onAddProject || handleAddProject;
  onUpdateProject = onUpdateProject || handleUpdateProject;
  onAddProposal = onAddProposal || handleAddProposal;
  onUpdateProposal = onUpdateProposal || handleUpdateProposal;
  onSendProposal = onSendProposal || handleSendProposal;
  onAddMaterialRequest = onAddMaterialRequest || handleAddMaterialRequest;

  const tabs = [
    { id: "projects", label: "Proyek Saya", icon: "🏗️" },
    { id: "materials", label: "Permintaan Material", icon: "📦" },
    { id: "rabs", label: "RAB / Penawaran", icon: "💼" },
  ];

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
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded"
                    onClick={() => {
                      const payload = {
                        ...projectForm,
                        projectManagerId: user?.id,
                      };
                      if (editingProject?.id) {
                        // existing project update
                        if (onUpdateProject)
                          onUpdateProject({ ...editingProject, ...payload });
                      } else {
                        if (onAddProject) onAddProject(payload);
                      }
                      setEditingProject(null);
                      setProjectForm({
                        name: "",
                        location: "",
                        description: "",
                        projectManagerId: user?.id,
                        status: "planning",
                        startDate: "",
                        endDate: "",
                        budget: "",
                      });
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
            <ProjectList
              projects={projects}
              user={user}
              onEditProject={(p) => {
                setEditingProject(p || {});
                setProjectForm({
                  name: p?.name || "",
                  location: p?.location || "",
                  description: p?.description || "",
                  projectManagerId: p?.projectManagerId || user?.id,
                  status: p?.status || "planning",
                  startDate: p?.startDate || "",
                  endDate: p?.endDate || "",
                  budget: p?.budget || "",
                });
              }}
            />
          </div>
        );
      case "materials":
        return (
          <MaterialRequest
            products={products}
            materials={materials}
            user={user}
            projects={projects}
            onAddMaterialRequest={onAddMaterialRequest}
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
                          Diajukan oleh user #{r.customerId} •{" "}
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
                          <button
                            className="px-3 py-2 bg-blue-600 text-white rounded"
                            onClick={() => {
                              setSelectedRAB(r);
                              setProposalItems([]);
                              setProposalNote("");
                            }}
                          >
                            Buat Penawaran
                          </button>
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

            {selectedRAB && (
              <div className="mt-4 border rounded p-4 bg-gray-50">
                <h4 className="font-medium">
                  Buat Penawaran untuk: {selectedRAB.projectName}
                </h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    className="border rounded p-2"
                    placeholder="Nama item"
                    value={pItemName}
                    onChange={(e) => setPItemName(e.target.value)}
                  />
                  <input
                    className="border rounded p-2"
                    type="number"
                    min={1}
                    value={pItemQty}
                    onChange={(e) => setPItemQty(Number(e.target.value))}
                  />
                  <input
                    className="border rounded p-2"
                    type="number"
                    min={0}
                    value={pItemPrice}
                    onChange={(e) => setPItemPrice(Number(e.target.value))}
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded"
                    onClick={() => {
                      if (!pItemName) return;
                      setProposalItems((prev) => [
                        ...prev,
                        { name: pItemName, qty: pItemQty, price: pItemPrice },
                      ]);
                      setPItemName("");
                      setPItemQty(1);
                      setPItemPrice(0);
                    }}
                  >
                    Tambah Item
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-300 rounded"
                    onClick={() => setSelectedRAB(null)}
                  >
                    Batal
                  </button>
                </div>

                <div className="mt-3">
                  <h5 className="font-medium">Item Penawaran</h5>
                  {proposalItems.length === 0 ? (
                    <div className="text-sm text-gray-500">Belum ada item.</div>
                  ) : (
                    <ul className="space-y-2 mt-2">
                      {proposalItems.map((it, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-center bg-white border p-2 rounded"
                        >
                          <div>
                            <div className="font-medium">{it.name}</div>
                            <div className="text-sm text-gray-600">
                              {it.qty} x Rp {it.price?.toLocaleString()}
                            </div>
                          </div>
                          <button
                            className="text-red-600 text-sm"
                            onClick={() =>
                              setProposalItems((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                          >
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-3">
                  <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    placeholder="Catatan penawaran"
                    value={proposalNote}
                    onChange={(e) => setProposalNote(e.target.value)}
                  />
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => {
                      const total = proposalItems.reduce(
                        (s, it) => s + it.qty * (it.price || 0),
                        0
                      );
                      const payload = {
                        rabId: selectedRAB.id,
                        projectName: selectedRAB.projectName,
                        pmId: user?.id,
                        items: proposalItems,
                        total: total,
                        note: proposalNote,
                      };
                      if (onAddProposal) {
                        const created = onAddProposal(payload);
                        // optionally send immediately
                        if (created && onSendProposal) {
                          onSendProposal(created.id);
                        }
                      }
                      // reset form
                      setSelectedRAB(null);
                      setProposalItems([]);
                      setProposalNote("");
                    }}
                  >
                    Buat & Kirim Penawaran
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-lg font-medium">Penawaran Terbaru</h4>
              {proposals.length === 0 ? (
                <div className="text-gray-500 mt-2">Belum ada penawaran.</div>
              ) : (
                <div className="space-y-3 mt-3">
                  {proposals.map((p) => (
                    <div
                      key={p.id}
                      className="border rounded p-3 bg-white flex justify-between items-start"
                    >
                      <div>
                        <div className="font-medium">
                          Penawaran untuk: {p.projectName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Dibuat: {new Date(p.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm">
                          Total: Rp {Number(p.total || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Status: {p.status}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {onUpdateProposal && (
                          <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                            onClick={() =>
                              onUpdateProposal({ ...p, status: "approved" })
                            }
                          >
                            Tandai Disetujui
                          </button>
                        )}
                        {onSendProposal && p.status !== "sent" && (
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                            onClick={() => onSendProposal(p.id)}
                          >
                            Kirim
                          </button>
                        )}
                        {/* Accept / Reject - only visible to customer or admin */}
                        {(user?.role === "Administrator" ||
                          ((user?.id || user?._id) &&
                            (user?.id || user?._id) ===
                              (p.customerId?._id || p.customerId))) && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded"
                              onClick={() => handleAcceptProposal(p.id)}
                            >
                              Setujui
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded"
                              onClick={() => handleRejectProposal(p.id)}
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <ProjectList projects={projects} user={user} />;
    }
  };

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
