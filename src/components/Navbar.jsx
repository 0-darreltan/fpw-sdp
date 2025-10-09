// components/Navbar.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-gray-200 shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <div className="flex items-center">
            <span className="self-center text-2xl font-bold whitespace-nowrap text-red-600">
              AGUNG
            </span>
            <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-700 ml-1">
              BETON PRECAST
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/about")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Tentang
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/services")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Layanan
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/order")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Pesan
              </Link>
            </li>
            <li>
              <Link
                href="/project"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/project")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Proyek
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/contact")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Kontak
              </Link>
            </li>
            <li>
              <Link
                href="/certification"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 ${
                  isActive("/certification")
                    ? "text-red-600 bg-blue-700 md:bg-transparent md:text-red-600"
                    : "text-gray-900"
                }`}
              >
                Sertifikat
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
