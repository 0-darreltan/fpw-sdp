import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import CustomerDashboard from './pages/CustomerDashboard';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Mock data
const initialData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@agungbeton.com'
    },
    {
      id: 2,
      username: 'customer1',
      password: 'customer123',
      role: 'customer',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890'
    },
    {
      id: 3,
      username: 'pm1',
      password: 'pm123',
      role: 'project_manager',
      name: 'Jane Smith',
      email: 'jane@agungbeton.com',
      phone: '081234567891'
    }
  ],
  products: [
    {
      id: 1,
      name: 'Aspal & Marka Jalan',
      category: 'Aspal',
      price: 500000,
      unit: 'ton',
      description: 'Material aspal berkualitas tinggi untuk pembangunan jalan'
    },
    {
      id: 2,
      name: 'Beton Readymix',
      category: 'Beton',
      price: 800000,
      unit: 'm³',
      description: 'Beton siap pakai dengan kualitas terjamin'
    },
    {
      id: 3,
      name: 'Beton Precast',
      category: 'Beton',
      price: 1200000,
      unit: 'unit',
      description: 'Beton precast untuk berbagai keperluan konstruksi'
    },
    {
      id: 4,
      name: 'Split / Batu Pecah',
      category: 'Agregat',
      price: 300000,
      unit: 'm³',
      description: 'Material agregat untuk campuran beton'
    }
  ],
  orders: [],
  projects: [
    {
      id: 1,
      name: 'Pembangunan Jalan Raya Kendari',
      location: 'Kendari, Sulawesi Tenggara',
      description: 'Proyek pembangunan jalan raya sepanjang 5 km',
      projectManagerId: 3,
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      budget: 5000000000,
      createdAt: '2025-01-01T00:00:00.000Z'
    }
  ]
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(initialData);

  // Load saved user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username, password) => {
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setData(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
    return newOrder;
  };

  const updateOrder = (order) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === order.id ? order : o)
    }));
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    return newProject;
  };

  const updateProject = (project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === project.id ? project : p)
    }));
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now()
    };
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    return newUser;
  };

  const updateUser = (user) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === user.id ? user : u)
    }));
  };

  const deleteUser = (userId) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now()
    };
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
    return newProduct;
  };

  const updateProduct = (product) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === product.id ? product : p)
    }));
  };

  const deleteProduct = (productId) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'customer':
        return (
          <CustomerDashboard
            user={currentUser}
            products={data.products}
            orders={data.orders}
            onAddOrder={addOrder}
          />
        );
      case 'project_manager':
        return (
          <ProjectManagerDashboard
            user={currentUser}
            projects={data.projects}
            products={data.products}
            onUpdateProject={updateProject}
          />
        );
      case 'admin':
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
    <div className="app">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="main-content">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default App;
