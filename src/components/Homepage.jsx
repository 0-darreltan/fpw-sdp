import React from 'react';

const Homepage = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">🏗️</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">PT. Agung Bumi Karsa</h1>
                <p className="text-white/80 text-sm">Konstruksi & Infrastruktur</p>
              </div>
            </div>
            <button
              onClick={onNavigateToLogin}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Login Sistem
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Membangun Masa Depan
            <span className="block text-yellow-300">Indonesia</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            PT. Agung Bumi Karsa adalah perusahaan konstruksi terpercaya yang berdedikasi 
            membangun infrastruktur berkualitas tinggi untuk kemajuan bangsa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToLogin}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200"
            >
              Mulai Proyek
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Layanan Kami
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Kami menyediakan solusi konstruksi lengkap dengan standar kualitas internasional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-white mb-3">Konstruksi Bangunan</h3>
              <p className="text-white/80">
                Pembangunan gedung perkantoran, apartemen, dan fasilitas komersial dengan teknologi modern.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">🛣️</div>
              <h3 className="text-xl font-bold text-white mb-3">Infrastruktur Jalan</h3>
              <p className="text-white/80">
                Pembangunan dan perbaikan jalan raya, jembatan, dan infrastruktur transportasi.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-bold text-white mb-3">Proyek Industri</h3>
              <p className="text-white/80">
                Konstruksi fasilitas industri, pabrik, dan infrastruktur pendukung industri.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-bold text-white mb-3">Perumahan</h3>
              <p className="text-white/80">
                Pembangunan kompleks perumahan dan real estate dengan konsep modern dan berkelanjutan.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-bold text-white mb-3">Infrastruktur Air</h3>
              <p className="text-white/80">
                Sistem pengairan, drainase, dan infrastruktur pengelolaan air bersih dan limbah.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Infrastruktur Energi</h3>
              <p className="text-white/80">
                Pembangunan infrastruktur kelistrikan, energi terbarukan, dan sistem utilitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Tentang PT. Agung Bumi Karsa
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Didirikan dengan visi menjadi perusahaan konstruksi terdepan di Indonesia, 
                PT. Agung Bumi Karsa telah berpengalaman lebih dari 15 tahun dalam menangani 
                berbagai proyek konstruksi skala besar.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <span className="text-white">Pengalaman 15+ tahun di industri konstruksi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <span className="text-white">Sertifikasi ISO 9001:2015 dan ISO 14001:2015</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <span className="text-white">Tim profesional bersertifikat internasional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <span className="text-white">Teknologi konstruksi terdepan</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Statistik Perusahaan</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">150+</div>
                  <div className="text-white/80">Proyek Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                  <div className="text-white/80">Klien Puas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">25+</div>
                  <div className="text-white/80">Kota di Indonesia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
                  <div className="text-white/80">Tenaga Ahli</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hubungi Kami
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Siap memulai proyek konstruksi Anda? Tim ahli kami siap membantu mewujudkan visi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-900 text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Alamat Kantor</h3>
              <p className="text-white/80">
                Jl. Sudirman No. 123<br />
                Jakarta Pusat, DKI Jakarta<br />
                Indonesia 10220
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-900 text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kontak</h3>
              <p className="text-white/80">
                Tel: +62 21 1234 5678<br />
                Fax: +62 21 1234 5679<br />
                Email: info@agungbumikarsa.com
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-900 text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Jam Operasional</h3>
              <p className="text-white/80">
                Senin - Jumat: 08:00 - 17:00<br />
                Sabtu: 08:00 - 12:00<br />
                Minggu: Tutup
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onNavigateToLogin}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200"
            >
              Akses Sistem Manajemen Proyek
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-md border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🏗️</span>
              </div>
              <div>
                <h3 className="text-white font-bold">PT. Agung Bumi Karsa</h3>
                <p className="text-white/60 text-sm">Building the Future</p>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              © 2025 PT. Agung Bumi Karsa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;