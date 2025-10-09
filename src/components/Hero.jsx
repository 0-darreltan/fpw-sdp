// components/Hero.jsx
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 min-h-screen flex items-center"
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"%3E%3Cpath fill="%23666" d="M0 0h1200v800H0z"/%3E%3C/svg%3E\')',
        }}
      ></div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-8 lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="text-center lg:text-left">
          <h1 className="max-w-4xl mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl xl:text-6xl">
            Visi Luas Layanan
            <br />
            <span className="text-red-500">Jujur Kualitas</span>
            <br />
            Andalan
          </h1>
          <p className="max-w-2xl mb-8 font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
            Tujuan kami dari dulu hingga sekarang menjadi perusahaan kontraktor,
            beton readymix dan precast terbaik di Sulawesi Tenggara
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
            >
              Lihat Produk
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
