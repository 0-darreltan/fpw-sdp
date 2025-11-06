import React, { useState, useEffect } from "react";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProjectManagerDashboard from "./pages/ProjectManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Mock data
const initialData = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Administrator",
      email: "admin@agungbeton.com",
    },
    {
      id: 2,
      username: "customer1",
      password: "customer123",
      role: "customer",
      name: "John Doe",
      email: "john@example.com",
      phone: "081234567890",
    },
    {
      id: 3,
      username: "pm1",
      password: "pm123",
      role: "project_manager",
      name: "Jane Smith",
      email: "jane@agungbeton.com",
      phone: "081234567891",
    },
  ],
  products: [
    // Products represent finished works / service packages
    {
      id: 101,
      name: "Pembuatan Jalan Raya (per km)",
      category: "Jasa Konstruksi",
      price: 25000000,
      unit: "paket",
      description: "Paket pengerjaan pembangunan jalan raya termasuk pondasi, lapisan aspal, dan marka.",
      status: "active",
      bom: [
        { materialId: 1, qty: 12 }, // Aspal (ton) per km (example)
        { materialId: 4, qty: 50 }, // Split (m3) per km (example)
      ],
    },
    {
      id: 102,
      name: "Pembangunan Jembatan (small)",
      category: "Jasa Konstruksi",
      price: 750000000,
      unit: "paket",
      description: "Paket pembangunan jembatan skala kecil hingga menengah, termasuk struktur dan finishing.",
      status: "active",
      bom: [
        { materialId: 2, qty: 200 }, // Beton Readymix m3
        { materialId: 3, qty: 20 }, // Beton Precast units
        { materialId: 4, qty: 100 },
      ],
    },
    {
      id: 103,
      name: "Renovasi Kamar Mandi",
      category: "Jasa Renovasi",
      price: 15000000,
      unit: "paket",
      description: "Renovasi lengkap kamar mandi (plester, instalasi, lantai, sanitari).",
      status: "active",
      bom: [
        { materialId: 3, qty: 2 },
        { materialId: 4, qty: 0.5 },
      ],
    },
    {
      id: 104,
      name: "Pemasangan Atap Baja Ringan",
      category: "Jasa Pemasangan",
      price: 35000000,
      unit: "paket",
      description: "Paket pemasangan atap baja ringan untuk rumah tinggal hingga 100 m2.",
      status: "active",
      bom: [
        { materialId: 4, qty: 1 },
      ],
    },
    {
      id: 105,
      name: "Kitchen Set Siap Pasang",
      category: "Interior",
      price: 45000000,
      unit: "paket",
      description: "Kitchen set prefabrikasi lengkap dengan pemasangan.",
      status: "active",
      bom: [],
    },
  ],
  materials: [
    { id: 1, name: 'Aspal & Marka Jalan', category: 'Aspal', unit: 'ton', price: 500000, stock: 200, description: 'Material aspal berkualitas tinggi untuk pembangunan jalan', status: 'Aktif' },
    { id: 2, name: 'Beton Readymix', category: 'Beton', unit: 'm³', price: 800000, stock: 150, description: 'Beton siap pakai dengan kualitas terjamin', status: 'Aktif' },
    { id: 3, name: 'Beton Precast', category: 'Beton', unit: 'unit', price: 1200000, stock: 80, description: 'Beton precast untuk berbagai keperluan konstruksi', status: 'Aktif' },
    { id: 4, name: 'Split / Batu Pecah', category: 'Agregat', unit: 'm³', price: 300000, stock: 300, description: 'Material agregat untuk campuran beton', status: 'Aktif' },
  ],
  orders: [],
  projects: [
    {
      id: 1,
      name: "Pembangunan Jalan Raya Kendari",
      location: "Kendari, Sulawesi Tenggara",
      description: "Proyek pembangunan jalan raya sepanjang 5 km",
      projectManagerId: 3,
      status: "active",
      startDate: "2025-01-15",
      endDate: "2025-06-15",
      budget: 5000000000,
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ],
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHomepage, setShowHomepage] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [data, setData] = useState(initialData);
  // RAB (budget) requests submitted by customers and proposals created by PMs
  const [rabs, setRabs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [materialTransactions, setMaterialTransactions] = useState([]);

  // Load saved user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowHomepage(false);
    }
  }, []);

  const handleLogin = (username, password) => {
    const user = data.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowHomepage(false);
      return { success: true, user };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowHomepage(true);
  };

  const handleNavigateToLogin = () => {
    setShowHomepage(false);
    setShowRegister(false);
  };

  const handleNavigateToRegister = () => {
    setShowHomepage(false);
    setShowRegister(true);
  }

  const handleNavigateHome = () => {
    setShowHomepage(true);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setShowRegister(false);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setData((prev) => ({ ...prev, orders: [...prev.orders, newOrder] }));
    // Also create a corresponding RAB submission from the order items
    try {
      const rabFromOrder = {
        projectName: order.projectName || order.projectName,
        location: order.projectLocation || "",
        area: "",
        category: "",
        description: order.projectDescription || "",
        items: (order.items || []).map((it) => ({
          name: it.product?.name || it.name || "",
          type: "Produk",
          unit: it.product?.unit || "unit",
          qty: it.quantity || 0,
          price: it.product?.price || 0,
        })),
        totalEstimate: order.total || 0,
        customerId: order.customerId || (order.customerId === undefined ? (order.customerId) : order.customerId),
        status: "Menunggu Perhitungan",
        createdAt: new Date().toISOString(),
      };
      addRAB(rabFromOrder);
    } catch (err) {
      // non-fatal: if mapping fails, just skip creating RAB
      console.error("Failed to auto-create RAB from order:", err);
    }
    return newOrder;
  };

  const updateOrder = (order) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === order.id ? order : o)),
    }));
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "active",
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    return newProject;
  };

  // --- Material request handlers (PM submits requests to admin/warehouse) ---
  const addMaterialRequest = (request) => {
    const newReq = {
      ...request,
      id: Date.now(),
      status: request.status || "pending_approval",
      createdAt: request.createdAt || new Date().toISOString(),
    };
    setMaterialRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const updateMaterialRequest = (updated) => {
    // Update requests and if approved, deduct stock and create transactions
    setMaterialRequests((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));

    const existing = materialRequests.find((r) => r.id === updated.id) || null;
    if (existing && existing.status !== "approved" && updated.status === "approved") {
      // Check availability first
      const insufficient = (updated.items || []).find((it) => {
        const matId = it.product?.id || it.productId || it.product?.productId;
        const mat = data.materials.find((m) => m.id === matId);
        return !mat || (mat.stock < (it.quantity || it.qty || 0));
      });
      if (insufficient) {
        // mark as rejected due to insufficient stock
        setMaterialRequests((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated, status: "rejected", note: "Stok tidak mencukupi untuk beberapa item" } : r)));
        return;
      }

      // Deduct stock and record transactions
      const transactionsToAdd = [];
      const newMaterials = data.materials.map((m) => {
        const reqItem = (updated.items || []).find((it) => (it.product?.id || it.productId) === m.id);
        if (reqItem) {
          const qty = reqItem.quantity || reqItem.qty || 0;
          const prevStock = m.stock;
          const newStock = Math.max(0, prevStock - qty);
          transactionsToAdd.push({
            materialId: m.id,
            type: "out",
            qty: qty,
            prevStock,
            newStock,
            relatedRequestId: updated.id,
            userId: updated.requesterId || existing.requesterId,
            note: `Penuhi permintaan #${updated.id}`,
            timestamp: new Date().toISOString(),
          });
          return { ...m, stock: newStock };
        }
        return m;
      });

      setData((prevData) => ({ ...prevData, materials: newMaterials }));

      // push transactions
      setMaterialTransactions((prev) => [
        ...transactionsToAdd.map((t) => ({ id: Date.now() + Math.random(), ...t })),
        ...prev,
      ]);
    }
  };

  const updateProject = (project) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    return newUser;
  };

  const updateUser = (user) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === user.id ? user : u)),
    }));
  };

  const deleteUser = (userId) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== userId),
    }));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
    return newProduct;
  };

  // --- Materials management ---
  const addMaterial = (material) => {
    const newMaterial = { ...material, id: Date.now() };
    setData((prev) => ({ ...prev, materials: [...(prev.materials || []), newMaterial] }));
    return newMaterial;
  };

  const updateMaterial = (material) => {
    setData((prev) => {
      const prevMat = prev.materials.find((m) => m.id === material.id);
      const newMaterials = prev.materials.map((m) => (m.id === material.id ? material : m));
      // If stock changed, record a transaction
      if (prevMat && prevMat.stock !== material.stock) {
        const qty = Math.abs(material.stock - prevMat.stock);
        const tx = {
          id: Date.now() + Math.random(),
          materialId: material.id,
          type: material.stock > prevMat.stock ? "in" : "out",
          qty,
          prevStock: prevMat.stock,
          newStock: material.stock,
          relatedRequestId: null,
          userId: currentUser?.id,
          note: "Manual stock update",
          timestamp: new Date().toISOString(),
        };
        setMaterialTransactions((prevTx) => [tx, ...prevTx]);
      }
      return { ...prev, materials: newMaterials };
    });
  };

  const deleteMaterial = (materialId) => {
    setData((prev) => ({ ...prev, materials: prev.materials.filter((m) => m.id !== materialId) }));
  };

  // --- RAB / Budget request handlers (customers submit RABs) ---
  const addRAB = (rab) => {
    const newRAB = {
      ...rab,
      id: Date.now(),
      status: rab.status || "submitted",
      createdAt: rab.createdAt || new Date().toISOString(),
    };
    setRabs((prev) => [newRAB, ...prev]);
    return newRAB;
  };

  const updateRAB = (updated) => {
    setRabs((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
  };

  // --- Proposal handlers (PM creates proposals in response to RABs) ---
  const addProposal = (proposal) => {
    const newProposal = {
      ...proposal,
      id: Date.now(),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setProposals((prev) => [newProposal, ...prev]);
    return newProposal;
  };

  const updateProposal = (updated) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  const sendProposal = (proposalId) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, status: "sent", sentAt: new Date().toISOString() }
          : p
      )
    );
  };

  const updateProduct = (product) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === product.id ? product : p)),
    }));
  };

  const deleteProduct = (productId) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  // Show homepage if not authenticated and showHomepage is true
  if (!isAuthenticated && showHomepage) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} onNavigateToRegister={handleNavigateToRegister} />;
  }

  // Show register if user clicked register from homepage
  if (!isAuthenticated && showRegister) {
    return <Register onRegistered={() => setShowRegister(false)} />;
  }

  // Show login if not authenticated (default when not showing homepage or register)
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "customer":
        return (
          <CustomerDashboard
            user={currentUser}
            products={data.products}
            materials={data.materials}
            orders={data.orders}
            onAddOrder={addOrder}
            rabs={rabs}
            onAddRAB={addRAB}
            onUpdateRAB={updateRAB}
          />
        );
      case "project_manager":
        return (
          <ProjectManagerDashboard
            user={currentUser}
            projects={data.projects}
            products={data.products}
            materials={data.materials}
            onUpdateProject={updateProject}
            onAddProject={addProject}
            rabs={rabs}
            proposals={proposals}
            onAddProposal={addProposal}
            onUpdateProposal={updateProposal}
            onSendProposal={sendProposal}
            onUpdateRAB={updateRAB}
            onAddMaterialRequest={addMaterialRequest}
          />
        );
      case "admin":
        return (
          <AdminDashboard
            user={currentUser}
            data={data}
            materialRequests={materialRequests}
            materialTransactions={materialTransactions}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onUpdateOrder={updateOrder}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onAddMaterial={addMaterial}
            onUpdateMaterial={updateMaterial}
            onDeleteMaterial={deleteMaterial}
            onUpdateMaterialRequest={updateMaterialRequest}
          />
        );
      default:
        return <div>Role tidak dikenali</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onNavigateHome={handleNavigateHome}
      />
      <main>{renderDashboard()}</main>
    </div>
  );
}

export default App;
