import React from "react";
import { Outlet } from "react-router-dom";
import NavbarHome from "./layout/NavbarHome";

const FrontEndHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
      <NavbarHome />

      <Outlet />

      {/* Footer - akan muncul di semua halaman */}
      <footer className="bg-black backdrop-blur-md border-t border-white/20 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/Gambar/LogoAgungBetonKendari.jpeg"
                  alt="Logo Agung Beton Kendari"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">
                  PT. Agung Beton Kendari
                </h3>
                <p className="text-white/60 text-xs md:text-sm">
                  Building the Future
                </p>
              </div>
            </div>
            <div className="text-white/60 text-xs md:text-sm text-center md:text-right">
              © 2025 PT. Agung Beton Kendari. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontEndHomepage;
