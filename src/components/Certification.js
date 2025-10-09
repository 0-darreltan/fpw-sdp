// components/Certification.js
export default function Certification() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Sertifikasi & Kredibilitas
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto font-light text-gray-500 sm:text-xl">
            Perusahaan kami telah melalui serangkaian proses akreditasi untuk mendapatkan sertifikat sesuai dengan komitmen kami terhadap mutu produk, persyaratan lingkungan, keselamatan dan kesehatan kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Certificate Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Certificate of Registration
                  </h3>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full text-white mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">PT. AGUNG BUMI KARSA</h4>
                    <p className="text-gray-600 text-sm mb-4">Quality System for Supply of Quality</p>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-semibold text-gray-900">ISO 45001:2018</p>
                      <p className="text-gray-600 text-sm">(Occupational Health and Safety Management Systems)</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">WHOLESALE TRADE; CONSTRUCTION SERVICES, HOT MIX AND COLD MIX ASPHALT SUPPLIER; READY MIX SUPPLIERS, MATERIAL SUPPLIERS, HEAVY EQUIPMENT CONTRACTORS AND STONE CRUSHER CONTRACTORS</p>
                    <p className="font-semibold">Certificate Number: 45M0211/GM/AM/01</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">ISO 45001:2018</h4>
                  <p className="text-gray-600">Sistem Manajemen Keselamatan dan Kesehatan Kerja yang memastikan lingkungan kerja yang aman dan sehat.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Kualitas Terjamin</h4>
                  <p className="text-gray-600">Produk dan layanan kami telah memenuhi standar kualitas internasional dengan sertifikasi resmi.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm6 2a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Layanan Terakreditasi</h4>
                  <p className="text-gray-600">Semua layanan kami mulai dari perdagangan, konstruksi, hingga penyediaan material telah terakreditasi.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Komitmen Berkelanjutan</h4>
                  <p className="text-gray-600">Kami berkomitmen untuk terus meningkatkan kualitas dan mempertahankan standar internasional.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}