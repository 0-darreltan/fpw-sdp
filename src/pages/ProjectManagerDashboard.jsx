import React, { useState } from 'react';
import ProjectList from "../components/ProjectList";
import MaterialRequest from "../components/MaterialRequest";

const ProjectManagerDashboard = ({
  user,
  projects,
  products,
  rabs = [],
  proposals = [],
  onAddProposal,
  onUpdateProposal,
  onSendProposal,
}) => {
  const [activeTab, setActiveTab] = useState("projects");

  // RAB / proposal local UI state
  const [selectedRAB, setSelectedRAB] = useState(null);
  const [proposalItems, setProposalItems] = useState([]);
  const [pItemName, setPItemName] = useState("");
  const [pItemQty, setPItemQty] = useState(1);
  const [pItemPrice, setPItemPrice] = useState(0);
  const [proposalNote, setProposalNote] = useState("");

  const tabs = [
    { id: "projects", label: "Proyek Saya", icon: "🏗️" },
    { id: "materials", label: "Permintaan Material", icon: "📦" },
    { id: "rabs", label: "RAB / Penawaran", icon: "💼" },
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
                          {new Date(r.createdAt).toLocaleString()}
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
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">
                        Total estimasi: Rp{" "}
                        {Number(r.totalEstimate || 0).toLocaleString()}
                      </div>
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