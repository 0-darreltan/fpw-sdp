// components/Contact.js
export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Hubungi Kami
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto font-light text-gray-500 sm:text-xl">
            Siap melayani kebutuhan proyek Anda dengan profesional dan berkualitas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Alamat Kantor</h4>
                  <p className="text-gray-600">
                    Jl. Raya Kendari<br />
                    Kota Kendari, Sulawesi Tenggara<br />
                    Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Telepon</h4>
                  <p className="text-gray-600">
                    <a href="tel:+62-xxx-xxxx-xxxx" className="hover:text-red-600 transition-colors">
                      +62-xxx-xxxx-xxxx
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a href="tel:+62-xxx-xxxx-xxxx" className="hover:text-red-600 transition-colors">
                      +62-xxx-xxxx-xxxx
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">
                    <a href="mailto:info@agungbeton.com" className="hover:text-red-600 transition-colors">
                      info@agungbeton.com
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a href="mailto:sales@agungbeton.com" className="hover:text-red-600 transition-colors">
                      sales@agungbeton.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg text-white mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Jam Operasional</h4>
                  <p className="text-gray-600">
                    Senin - Jumat: 08:00 - 17:00<br />
                    Sabtu: 08:00 - 15:00<br />
                    Minggu: Tutup
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block mb-2 text-sm font-medium text-gray-900">
                      Nama Lengkap*
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block mb-2 text-sm font-medium text-gray-900">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-phone" className="block mb-2 text-sm font-medium text-gray-900">
                      No. Telepon*
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                      placeholder="08xx-xxxx-xxxx"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="block mb-2 text-sm font-medium text-gray-900">
                      Perusahaan
                    </label>
                    <input
                      type="text"
                      id="contact-company"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                      placeholder="Nama perusahaan (opsional)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block mb-2 text-sm font-medium text-gray-900">
                    Subjek*
                  </label>
                  <select
                    id="contact-subject"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                    required
                  >
                    <option value="">Pilih subjek</option>
                    <option value="quotation">Permintaan Penawaran</option>
                    <option value="information">Informasi Produk</option>
                    <option value="partnership">Kerjasama</option>
                    <option value="complaint">Keluhan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block mb-2 text-sm font-medium text-gray-900">
                    Pesan*
                  </label>
                  <textarea
                    id="contact-message"
                    rows="6"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lokasi Kami</h3>
          <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600">Peta Lokasi</p>
                <p className="text-sm text-gray-500">Kendari, Sulawesi Tenggara</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}