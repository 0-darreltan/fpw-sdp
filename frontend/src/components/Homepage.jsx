import React from "react";
import { useNavigate } from "react-router";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Video Jumbotron */}
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[75vh] overflow-hidden">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in">
            Membangun Masa Depan
            <span className="block text-yellow-300 mt-2">Indonesia</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            PT. Agung Beton Kendari adalah perusahaan konstruksi terpercaya yang
            berdedikasi membangun infrastruktur berkualitas tinggi untuk
            kemajuan bangsa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full sm:w-auto px-4">
            <button
              onClick={() => navigate("/customer")}
              className="bg-red-600 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
            >
              Mulai Proyek
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-blue-600 text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-3 md:mb-4">
              Layanan Kami
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
              Kami menyediakan solusi konstruksi lengkap dengan standar kualitas
              internasional
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Service Card 1 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Konstruksi Bangunan
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Pembangunan gedung perkantoran, apartemen, dan fasilitas
                komersial dengan teknologi modern.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">🛣️</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Jalan
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Pembangunan dan perbaikan jalan raya, jembatan, dan
                infrastruktur transportasi.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Proyek Industri
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Konstruksi fasilitas industri, pabrik, dan infrastruktur
                pendukung industri.
              </p>
            </div>

            {/* Service Card 4 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Perumahan
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Pembangunan kompleks perumahan dan real estate dengan konsep
                modern dan berkelanjutan.
              </p>
            </div>

            {/* Service Card 5 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Air
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Sistem pengairan, drainase, dan infrastruktur pengelolaan air
                bersih dan limbah.
              </p>
            </div>

            {/* Service Card 6 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:bg-blue-100 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                Infrastruktur Energi
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Pembangunan infrastruktur kelistrikan, energi terbarukan, dan
                sistem utilitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-4 md:mb-6">
                Tentang PT. Agung Bumi Karsa
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">
                Didirikan dengan visi menjadi perusahaan konstruksi terdepan di
                Indonesia, PT. Agung Bumi Karsa telah berpengalaman lebih dari
                15 tahun dalam menangani berbagai proyek konstruksi skala besar.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">
                    Pengalaman 15+ tahun di industri konstruksi
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">
                    Sertifikasi ISO 9001:2015 dan ISO 14001:2015
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">
                    Tim profesional bersertifikat internasional
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">
                    Teknologi konstruksi terdepan
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 md:p-8 border border-blue-100 shadow-md">
              <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 md:mb-6">
                Statistik Perusahaan
              </h3>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                    150+
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Proyek Selesai
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Klien Puas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                    25+
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Kota di Indonesia
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                    1000+
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    Tenaga Ahli
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-3 md:mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
              Siap memulai proyek konstruksi Anda? Tim ahli kami siap membantu
              mewujudkan visi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📍</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-2">
                Alamat Kantor
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
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
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-2">
                Kontak
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
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
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-2">
                Jam Operasional
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Senin - Jumat: 08:00 - 17:00
                <br />
                Sabtu: 08:00 - 12:00
                <br />
                Minggu: Tutup
              </p>
            </div>
          </div>

          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
            >
              Akses Sistem Manajemen Proyek
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
