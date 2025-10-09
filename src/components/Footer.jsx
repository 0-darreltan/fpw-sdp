// components/Footer.js
import { Footer } from "flowbite-react";

export default function AppFooter() {
  return (
    <Footer container className="bg-gray-900 rounded-none">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-6 sm:mb-0">
            <Footer.Brand
              href="#"
              name={
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-red-500">AGUNG</span>
                  <span className="text-2xl font-bold text-white ml-1">
                    BETON PRECAST
                  </span>
                </div>
              }
            />
            <p className="text-gray-300 mb-6 max-w-md mt-4">
              Spesialis dalam penyediaan beton readymix, precast, aspal, dan
              split berkualitas tinggi untuk semua kebutuhan konstruksi di
              Sulawesi Tenggara.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.37 0 4.15 1.55 4.15 4.9v6.2h.02z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Menu Utama" className="text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#home"
                  className="text-gray-300 hover:text-white"
                >
                  Beranda
                </Footer.Link>
                <Footer.Link
                  href="#about"
                  className="text-gray-300 hover:text-white"
                >
                  Tentang Kami
                </Footer.Link>
                <Footer.Link
                  href="#services"
                  className="text-gray-300 hover:text-white"
                >
                  Layanan
                </Footer.Link>
                <Footer.Link
                  href="#order"
                  className="text-gray-300 hover:text-white"
                >
                  Pemesanan
                </Footer.Link>
                <Footer.Link
                  href="#contact"
                  className="text-gray-300 hover:text-white"
                >
                  Kontak
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Layanan Kami" className="text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  Beton Readymix
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  Beton Precast
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  Aspal & Marka Jalan
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  Split / Batu Pecah
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-300 hover:text-white"
                >
                  Equipment Rental
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider className="border-gray-800" />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="PT. Agung Bumi Karsa. All rights reserved."
            year={2024}
            className="text-gray-400"
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Link href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Footer.Link>
            <Footer.Link href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </Footer.Link>
            <Footer.Link href="#" className="text-gray-400 hover:text-white">
              Sitemap
            </Footer.Link>
          </div>
        </div>
      </div>
    </Footer>
  );
}