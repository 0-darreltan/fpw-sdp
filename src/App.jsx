import React, { useState, useEffect } from "react";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
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
    {
      id: 1,
      name: "Aspal & Marka Jalan",
      category: "Aspal",
      price: 500000,
      unit: "ton",
      description: "Material aspal berkualitas tinggi untuk pembangunan jalan",
    },
    {
      id: 2,
      name: "Beton Readymix",
      category: "Beton",
      price: 800000,
      unit: "m³",
      description: "Beton siap pakai dengan kualitas terjamin",
    },
    {
      id: 3,
      name: "Beton Precast",
      category: "Beton",
      price: 1200000,
      unit: "unit",
      description: "Beton precast untuk berbagai keperluan konstruksi",
    },
    {
      id: 4,
      name: "Split / Batu Pecah",
      category: "Agregat",
      price: 300000,
      unit: "m³",
      description: "Material agregat untuk campuran beton",
    },
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
  const [data, setData] = useState(initialData);
  // RAB (budget) requests submitted by customers and proposals created by PMs
  const [rabs, setRabs] = useState([]);
  const [proposals, setProposals] = useState([]);

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
  };

  const handleNavigateHome = () => {
    setShowHomepage(true);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setData((prev) => ({
      ...prev,
      orders: [...prev.orders, newOrder],
    }));
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

  // --- RAB / Budget request handlers (customers submit RABs) ---
  const addRAB = (rab) => {
    const newRAB = {
      ...rab,
      id: Date.now(),
      status: "submitted",
      createdAt: new Date().toISOString(),
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
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // Show login if not authenticated and showHomepage is false
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
            orders={data.orders}
            onAddOrder={addOrder}
            rabs={rabs}
            onAddRAB={addRAB}
          />
        );
      case "project_manager":
        return (
          <ProjectManagerDashboard
            user={currentUser}
            projects={data.projects}
            products={data.products}
            onUpdateProject={updateProject}
            rabs={rabs}
            proposals={proposals}
            onAddProposal={addProposal}
            onUpdateProposal={updateProposal}
            onSendProposal={sendProposal}
          />
        );
      case "admin":
        return (
          <AdminDashboard
            user={currentUser}
            data={data}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onUpdateOrder={updateOrder}
            onAddProject={addProject}
            onUpdateProject={updateProject}
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
