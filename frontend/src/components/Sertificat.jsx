import React, { useState } from "react";

const Sertificat = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [imageError, setImageError] = useState({});

  const certificates = [
    {
      id: 1,
      title: "ISO 9001:2015",
      subtitle: "Quality Management System",
      description:
        "Sertifikasi sistem manajemen mutu yang memastikan konsistensi kualitas produk dan layanan dalam industri perdagangan, konstruksi, dan pasokan material",
      issuedBy: "International Accreditation Service (IAS)",
      certificateNumber: "MSQH2110000026/1",
      year: "2023",
      validUntil: "2026",
      icon: "🏆",
      color: "blue",
      image: "/certificates/iso-9001-agung-bumi.jpg",
      scope:
        "WHOLESALE TRADE, CONSTRUCTION SERVICES, HOT MIX AND OTHER ASPHALT SUPPLIERS, READY MIX SUPPLIERS, MATERIAL SUPPLIERS, HEAVY EQUIPMENT, DISTRIBUTORS AND PRECAST SUPPLIER ACTIVITIES",
    },
    {
      id: 2,
      title: "ISO 45001:2018",
      subtitle: "Occupational Health and Safety Management System",
      description:
        "Sertifikasi sistem manajemen kesehatan dan keselamatan kerja untuk memastikan lingkungan kerja yang aman dan sehat",
      issuedBy: "International Accreditation Service (IAS)",
      certificateNumber: "MSQH2110000028/1",
      year: "2023",
      validUntil: "2026",
      icon: "🛡️",
      color: "red",
      image: "/certificates/iso-45001-agung-bumi.jpg",
      scope:
        "WHOLESALE TRADE, CONSTRUCTION SERVICES, HOT MIX AND OTHER ASPHALT SUPPLIERS, READY MIX SUPPLIERS, MATERIAL SUPPLIERS, HEAVY EQUIPMENT, DISTRIBUTORS AND PRECAST SUPPLIER ACTIVITIES",
    },
    {
      id: 3,
      title: "ISO 14001:2015",
      subtitle: "Environmental Management System",
      description:
        "Sertifikasi sistem manajemen lingkungan yang menunjukkan komitmen terhadap keberlanjutan dan tanggung jawab lingkungan",
      issuedBy: "International Accreditation Service (IAS)",
      certificateNumber: "MSQH2110000027/1",
      year: "2023",
      validUntil: "2026",
      icon: "🌿",
      color: "green",
      image: "/certificates/iso-14001-agung-bumi.jpg",
      scope:
        "WHOLESALE TRADE, CONSTRUCTION SERVICES, HOT MIX AND OTHER ASPHALT SUPPLIERS, READY MIX SUPPLIERS, MATERIAL SUPPLIERS, HEAVY EQUIPMENT, DISTRIBUTORS AND PRECAST SUPPLIER ACTIVITIES",
    },
    {
      id: 4,
      title: "SNI 7656:2012",
      subtitle: "Standar Nasional Indonesia - Beton Ready Mix",
      description:
        "Sertifikasi Beton Ready Mix sesuai dengan standar nasional Indonesia untuk kualitas dan keamanan produk",
      issuedBy: "Badan Standardisasi Nasional",
      certificateNumber: "SNI-7656-2012-001",
      year: "2023",
      validUntil: "2026",
      icon: "✅",
      color: "emerald",
      image: "/certificates/sni-beton.jpg",
      scope: "Produksi dan distribusi beton ready mix untuk konstruksi",
    },
    {
      id: 5,
      title: "SIUJK",
      subtitle: "Surat Izin Usaha Jasa Konstruksi",
      description:
        "Izin resmi dari pemerintah untuk menjalankan usaha jasa konstruksi di Indonesia",
      issuedBy: "Kementerian PUPR",
      certificateNumber: "SIUJK-2022-0001",
      year: "2022",
      validUntil: "2027",
      icon: "📜",
      color: "purple",
      image: "/certificates/siujk.jpg",
      scope: "Jasa konstruksi sipil dan infrastruktur",
    },
    {
      id: 6,
      title: "TDP",
      subtitle: "Tanda Daftar Perusahaan",
      description:
        "Tanda daftar perusahaan yang terdaftar resmi di Dinas Perindustrian dan Perdagangan",
      issuedBy: "Dinas Perindustrian dan Perdagangan",
      certificateNumber: "TDP-2021-001",
      year: "2021",
      validUntil: "Selamanya",
      icon: "🏢",
      color: "indigo",
      image: "/certificates/tdp.jpg",
      scope: "Perdagangan dan distribusi material konstruksi",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        icon: "bg-blue-500",
        badge: "bg-blue-100 text-blue-800",
        hover: "hover:border-blue-400 hover:shadow-blue-200",
      },
      green: {
        bg: "from-green-50 to-green-100",
        border: "border-green-200",
        icon: "bg-green-500",
        badge: "bg-green-100 text-green-800",
        hover: "hover:border-green-400 hover:shadow-green-200",
      },
      emerald: {
        bg: "from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        icon: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-800",
        hover: "hover:border-emerald-400 hover:shadow-emerald-200",
      },
      red: {
        bg: "from-red-50 to-red-100",
        border: "border-red-200",
        icon: "bg-red-500",
        badge: "bg-red-100 text-red-800",
        hover: "hover:border-red-400 hover:shadow-red-200",
      },
      purple: {
        bg: "from-purple-50 to-purple-100",
        border: "border-purple-200",
        icon: "bg-purple-500",
        badge: "bg-purple-100 text-purple-800",
        hover: "hover:border-purple-400 hover:shadow-purple-200",
      },
      indigo: {
        bg: "from-indigo-50 to-indigo-100",
        border: "border-indigo-200",
        icon: "bg-indigo-500",
        badge: "bg-indigo-100 text-indigo-800",
        hover: "hover:border-indigo-400 hover:shadow-indigo-200",
      },
    };
    return colors[color] || colors.blue;
  };

  const handleImageError = (certId) => {
    setImageError((prev) => ({ ...prev, [certId]: true }));
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="text-6xl">🏅</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sertifikasi & Akreditasi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              PT Agung Beton Kendari - Komitmen terhadap Kualitas, Keselamatan, dan
              Lingkungan yang Diakui Internasional
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sertifikasi Internasional & Nasional
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              PT Agung Beton Kendari telah meraih berbagai sertifikasi yang
              membuktikan komitmen kami terhadap standar kualitas tertinggi,
              keselamatan kerja, dan tanggung jawab lingkungan sesuai dengan
              standar internasional ISO dan standar nasional Indonesia.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">6+</div>
              <div className="text-blue-100">Sertifikasi Aktif</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-green-100">ISO Standards</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">IAS</div>
              <div className="text-purple-100">Accredited</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-red-100">Compliance</div>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {certificates.map((cert) => {
              const colorClasses = getColorClasses(cert.color);
              return (
                <div
                  key={cert.id}
                  className={`bg-gradient-to-br ${colorClasses.bg} rounded-2xl p-6 border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer`}
                  onClick={() => setSelectedCertificate(cert)}
                >
                  {/* Certificate Preview Image */}
                  <div className="bg-white rounded-lg mb-4 overflow-hidden shadow-md h-48 flex items-center justify-center">
                    {!imageError[cert.id] ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(cert.id)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm">Certificate Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`${colorClasses.icon} rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg mx-auto`}
                  >
                    <span className="text-3xl">{cert.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    {cert.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    {cert.subtitle}
                  </p>

                  {/* Certificate Number */}
                  <div className="bg-white/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 text-center">
                      No. Sertifikat
                    </p>
                    <p className="text-sm font-mono font-semibold text-gray-900 text-center">
                      {cert.certificateNumber}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Dikeluarkan:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClasses.badge}`}
                      >
                        {cert.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Berlaku hingga:</span>
                      <span className="font-semibold text-gray-900">
                        {cert.validUntil}
                      </span>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <button className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center">
                      Lihat Detail
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accreditation Info */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white mb-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full p-4">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Terakreditasi IAS (International Accreditation Service)
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Semua sertifikasi ISO kami terakreditasi oleh IAS (International
                Accreditation Service), lembaga akreditasi internasional yang
                diakui secara global. Ini membuktikan bahwa sistem manajemen
                kami telah memenuhi standar internasional tertinggi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <h3 className="font-bold text-lg mb-2">
                    📋 Scope of Activities
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Wholesale Trade, Construction Services, Hot Mix and Other
                    Asphalt Suppliers, Ready Mix Suppliers, Material Suppliers,
                    Heavy Equipment, Distributors and Precast Supplier
                    Activities
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <h3 className="font-bold text-lg mb-2">🏢 Company Info</h3>
                  <p className="text-blue-100 text-sm">
                    PT. Agung Beton Kendari
                    <br />
                    Jalan Suparoto, RT.06 Kendari, Indonesia
                    <br />
                    Sulawesi Tenggara - 93117
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Standards We Follow */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Standar yang Kami Ikuti
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Beroperasi sesuai dengan standar internasional dan nasional
                terbaik
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🌍</span>
                  Standar Internasional
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>ISO 9001:2015</strong> - Quality Management System
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>ISO 14001:2015</strong> - Environmental Management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>ISO 45001:2018</strong> - Occupational Health &
                      Safety
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>IAS Accredited</strong> - International
                      Recognition
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🇮🇩</span>
                  Standar Nasional Indonesia
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>SNI 7656:2012</strong> - Beton Ready Mix
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>SIUJK</strong> - Surat Izin Usaha Jasa Konstruksi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Kementerian PUPR</strong> - Peraturan Jasa
                      Konstruksi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      <strong>K3</strong> - Standar Keselamatan Kerja
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Certificate Details */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-5xl mr-4">
                    {selectedCertificate.icon}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {selectedCertificate.title}
                    </h3>
                    <p className="text-blue-100">
                      {selectedCertificate.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Certificate Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {!imageError[selectedCertificate.id] ? (
                  <img
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    className="w-full h-auto"
                    onError={() => handleImageError(selectedCertificate.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg
                      className="w-24 h-24 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p>Certificate Image</p>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📋 Nomor Sertifikat
                  </h4>
                  <p className="text-gray-700 font-mono">
                    {selectedCertificate.certificateNumber}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🏛️ Dikeluarkan oleh
                  </h4>
                  <p className="text-gray-700">
                    {selectedCertificate.issuedBy}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📅 Tahun Terbit
                  </h4>
                  <p className="text-gray-700">{selectedCertificate.year}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    ⏰ Masa Berlaku
                  </h4>
                  <p className="text-gray-700">
                    Hingga {selectedCertificate.validUntil}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Deskripsi
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCertificate.description}
                </p>
              </div>

              {/* Scope */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Scope of Activities
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCertificate.scope}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
                <div className="flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-green-800">
                    Sertifikat ini masih aktif dan berlaku sesuai dengan standar
                    yang ditetapkan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sertificat;
