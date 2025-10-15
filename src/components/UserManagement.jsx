import React, { useState } from "react";

const UserManagement = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "customer",
    name: "",
    email: "",
    phone: "",
  });

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "customer",
      name: "",
      email: "",
      phone: "",
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData });
    } else {
      onAddUser(formData);
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      onDeleteUser(userId);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: "Administrator", class: "bg-red-100 text-red-800" },
      customer: { label: "Customer", class: "bg-blue-100 text-blue-800" },
      project_manager: {
        label: "Project Manager",
        class: "bg-green-100 text-green-800",
      },
    };

    const config = roleConfig[role] || {
      label: role,
      class: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: "👑",
      customer: "👤",
      project_manager: "👨‍💼",
    };
    return icons[role] || "👤";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Kelola User</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          onClick={() => setShowAddForm(true)}
        >
          + Tambah User
        </button>
      </div>

      {(showAddForm || editingUser) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => resetForm()}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingUser ? "Edit User" : "Tambah User Baru"}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                onClick={() => resetForm()}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Username unik"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="customer">Customer</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingUser ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mr-3">
                {getRoleIcon(user.role)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            <div className="mb-4">{getRoleBadge(user.role)}</div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">✉️</span>
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📞</span>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={() => handleEdit(user)}
              >
                ✏️ Edit
              </button>
              <button
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDelete(user.id)}
                disabled={
                  user.role === "admin" &&
                  users.filter((u) => u.role === "admin").length === 1
                }
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Ringkasan User
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Administrator</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.role === "project_manager").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Project Manager</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "customer").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Customer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
