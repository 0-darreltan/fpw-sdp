import React from "react";

const Header = ({ user, onLogout, onNavigateHome }) => {
  const handleLogout = () => {
    onLogout();
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "customer":
        return "Customer";
      case "project_manager":
        return "Project Manager";
      default:
        return role;
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={handleNavigateHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src="/public/Gambar/LogoAgungBetonKendari.jpeg"
                alt="Agung Beton"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  PT. Agung Beton Kendari
                </h1>
                <p className="text-sm text-gray-600">Sistem Manajemen Proyek</p>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="block text-sm font-medium text-gray-900">
                {user?.name}
              </span>
              <span className="block text-xs text-gray-600">
                ({getRoleDisplayName(user?.role)})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
