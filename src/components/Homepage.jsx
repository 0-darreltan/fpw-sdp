import React from "react";

const Homepage = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="/public/Gambar/LogoAgungBetonKendari.jpeg"
                  alt="agungbeton"
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">
                  PT. Agung Beton Kendari
                </h1>
                <p className="text-white/80 text-sm">
                  Konstruksi & Infrastruktur
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Login Sistem
            </button>
          </div>
        </div>
      </nav>

      {/* Video Jumbotron */}
      <section className="relative h-[75vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/Video/Video_Full_Layar_Animasi_Fade_In_Out.mp4"
              type="video/mp4"
            />
            <source
              src="/Video/_MConverter.eu_Video_Full_Layar_Animasi_Fade_In_Out.webp"
              type="video/webp"
            />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Membangun Masa Depan
            <span className="block text-yellow-300">Indonesia</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            PT. Agung Beton Kendari adalah perusahaan konstruksi terpercaya yang
            berdedikasi membangun infrastruktur berkualitas tinggi untuk
            kemajuan bangsa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToLogin}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
            >
              Mulai Proyek
            </button>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700   transition-colors duration-200">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Layanan Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kami menyediakan solusi konstruksi lengkap dengan standar kualitas
              internasional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Konstruksi Bangunan
              </h3>
              <p className="text-gray-600">
                Pembangunan gedung perkantoran, apartemen, dan fasilitas
                komersial dengan teknologi modern.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🛣️</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Jalan
              </h3>
              <p className="text-gray-600">
                Pembangunan dan perbaikan jalan raya, jembatan, dan
                infrastruktur transportasi.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Proyek Industri
              </h3>
              <p className="text-gray-600">
                Konstruksi fasilitas industri, pabrik, dan infrastruktur
                pendukung industri.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Perumahan
              </h3>
              <p className="text-gray-600">
                Pembangunan kompleks perumahan dan real estate dengan konsep
                modern dan berkelanjutan.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Air
              </h3>
              <p className="text-gray-600">
                Sistem pengairan, drainase, dan infrastruktur pengelolaan air
                bersih dan limbah.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Energi
              </h3>
              <p className="text-gray-600">
                Pembangunan infrastruktur kelistrikan, energi terbarukan, dan
                sistem utilitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
                Tentang PT. Agung Bumi Karsa
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Didirikan dengan visi menjadi perusahaan konstruksi terdepan di
                Indonesia, PT. Agung Bumi Karsa telah berpengalaman lebih dari
                15 tahun dalam menangani berbagai proyek konstruksi skala besar.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Pengalaman 15+ tahun di industri konstruksi
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Sertifikasi ISO 9001:2015 dan ISO 14001:2015
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Tim profesional bersertifikat internasional
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Teknologi konstruksi terdepan
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 border border-blue-100 shadow-md">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">
                Statistik Perusahaan
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    150+
                  </div>
                  <div className="text-gray-600">Proyek Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Klien Puas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    25+
                  </div>
                  <div className="text-gray-600">Kota di Indonesia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    1000+
                  </div>
                  <div className="text-gray-600">Tenaga Ahli</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Siap memulai proyek konstruksi Anda? Tim ahli kami siap membantu
              mewujudkan visi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Alamat Kantor
              </h3>
              <p className="text-gray-600">
                Jl. Sudirman No. 123
                <br />
                Jakarta Pusat, DKI Jakarta
                <br />
                Indonesia 10220
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Kontak</h3>
              <p className="text-gray-600">
                Tel: +62 21 1234 5678
                <br />
                Fax: +62 21 1234 5679
                <br />
                Email: info@agungbumikarsa.com
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Jam Operasional
              </h3>
              <p className="text-gray-600">
                Senin - Jumat: 08:00 - 17:00
                <br />
                Sabtu: 08:00 - 12:00
                <br />
                Minggu: Tutup
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onNavigateToLogin}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
            >
              Akses Sistem Manajemen Proyek
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black ckdrop-blur-md border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  <img
                    src="/public/Gambar/LogoAgungBetonKendari.jpeg"
                    alt="Logo Agung Beton Kendari"
                  />
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold">
                  PT. Agung Beton Kendari
                </h3>
                <p className="text-white/60 text-sm">Building the Future</p>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              © 2025 PT. Agung Beton Kendari. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
