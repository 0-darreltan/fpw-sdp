// components/About.js
export default function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="mb-8 lg:mb-0">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
              Tentang Agung Beton Kendari
            </h2>
            <div className="w-20 h-1 bg-red-600 mb-6"></div>
            <p className="mb-4 font-light text-gray-500 sm:text-xl">
              <span className="font-medium italic text-gray-700">Spesialis Beton - Aspal - Split - Equipment Rental</span>
            </p>
            <p className="mb-6 font-light text-gray-500">
              Merupakan bagian dari PT Agung Bumi Karsa berdiri pada tahun 2019 di Kota Kendari Provinsi Sulawesi Tenggara berfokus pada penyediaan material proyek seperti Aspal Hot & ColdMix, Beton Readymix, Beton Precast, Batu pecah (Split), Alat Berat dan material pendukung lainnya untuk semua wilayah di Sulawesi Tenggara khususnya di Kota Kendari.
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center px-6 py-3 text-base font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
            >
              Company Profile
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}