import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarHome = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo Section */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/Gambar/LogoAgungBetonKendari.jpeg"
            className="h-10 w-10 rounded-lg object-cover"
            alt="PT Agung Beton Kendari Logo"
          />
          <div>
            <h1 className="text-white font-bold text-lg md:text-xl">
              PT. Agung Beton Kendari
            </h1>
            <p className="text-white/80 text-xs md:text-sm">
              Konstruksi & Infrastruktur
            </p>
          </div>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <ul className="flex flex-row space-x-6 font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/certification"
                className={({ isActive }) =>
                  `py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                Certification
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                Catalog
              </NavLink>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/register")}
              className="bg-transparent border-2 border-blue-500 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Login Sistem
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:hidden mt-4 transition-all duration-300`}
          id="navbar-default"
        >
          <ul className="flex flex-col space-y-2 font-medium bg-gray-800 rounded-lg p-4">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sertificat"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-900/30"
                      : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                Sertificat
              </NavLink>
            </li>
            <li className="pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
                className="w-full bg-transparent border-2 border-blue-500 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all duration-200 mb-2"
              >
                Register
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Login Sistem
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;
