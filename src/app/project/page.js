// app/project/page.js
'use client'
import { useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

export default function ProjectPage() {
  const [formData, setFormData] = useState({
    // Data Proyek
    projectName: '',
    projectType: '',
    location: '',
    landArea: '',
    buildingArea: '',
    floors: '',
    rooms: '',
    
    // Data Klien
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientType: 'individu',
    
    // Detail Proyek
    projectDescription: '',
    designStyle: '',
    budget: '',
    timeline: '',
    startDate: '',
    
    // Kebutuhan Khusus
    specialRequirements: [],
    materials: [],
    services: [],
    
    // File Upload
    designFile: null,
    sitePhoto: null,
    
    // Preferensi
    consultationPreference: 'online',
    contactPreference: 'whatsapp'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    'Rumah Tinggal',
    'Ruko/Rukan',
    'Gedung Perkantoran',
    'Pabrik/Industri',
    'Jalan & Infrastruktur',
    'Jembatan',
    'Fasilitas Umum',
    'Renovasi',
    'Lainnya'
  ];

  const designStyles = [
    'Modern Minimalis',
    'Klasik',
    'Industrial',
    'Tradisional',
    'Contemporary',
    'Mediterania',
    'Tropis',
    'Custom Design'
  ];

  const specialRequirements = [
    'Tahan Gempa',
    'Ramah Lingkungan',
    'Smart Building',
    'Aksesibilitas Difabel',
    'Anti Banjir',
    'Hemat Energi',
    'Kedap Suara',
    'Fire Resistant'
  ];

  const materialsOptions = [
    'Beton Readymix',
    'Beton Precast',
    'Baja Ringan',
    'Baja Konvensional',
    'Batu Bata',
    'Batako',
    'Hebel',
    'Paving Block'
  ];

  const servicesOptions = [
    'Desain Arsitektur',
    'Desain Struktur',
    'Desain MEP',
    'Izin Mendirikan Bangunan (IMB)',
    'Survey Tanah',
    'Pengawasan Konstruksi',
    'Quality Control',
    'Project Management'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'specialRequirements') {
        setFormData(prev => ({
          ...prev,
          specialRequirements: checked 
            ? [...prev.specialRequirements, value]
            : prev.specialRequirements.filter(item => item !== value)
        }));
      } else if (name === 'materials') {
        setFormData(prev => ({
          ...prev,
          materials: checked 
            ? [...prev.materials, value]
            : prev.materials.filter(item => item !== value)
        }));
      } else if (name === 'services') {
        setFormData(prev => ({
          ...prev,
          services: checked 
            ? [...prev.services, value]
            : prev.services.filter(item => item !== value)
        }));
      }
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi submit
    setTimeout(() => {
      alert('Permintaan RAB berhasil dikirim! Tim kami akan menghubungi Anda dalam 1x24 jam.');
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        projectName: '',
        projectType: '',
        location: '',
        landArea: '',
        buildingArea: '',
        floors: '',
        rooms: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientType: 'individu',
        projectDescription: '',
        designStyle: '',
        budget: '',
        timeline: '',
        startDate: '',
        specialRequirements: [],
        materials: [],
        services: [],
        designFile: null,
        sitePhoto: null,
        consultationPreference: 'online',
        contactPreference: 'whatsapp'
      });
      setCurrentStep(1);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Permintaan RAB Proyek
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Wujudkan proyek impian Anda bersama PT. Agung Beton Kendari. 
            Kami siap membantu dari perencanaan hingga penyelesaian.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Konsultasi Gratis
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              RAB Profesional
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Garansi Kualitas
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-20 h-1 ${
                        currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {currentStep === 1 && 'Informasi Proyek'}
                    {currentStep === 2 && 'Data Klien'}
                    {currentStep === 3 && 'Detail & Kebutuhan'}
                    {currentStep === 4 && 'Review & Submit'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              {/* Step 1: Project Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Proyek</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Proyek *
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        required
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contoh: Rumah Keluarga Budi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Proyek *
                      </label>
                      <select
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Pilih Jenis Proyek</option>
                        {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Proyek *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Alamat lengkap lokasi proyek"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Luas Tanah (m²)
                      </label>
                      <input
                        type="number"
                        name="landArea"
                        value={formData.landArea}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contoh: 200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Luas Bangunan (m²) *
                      </label>
                      <input
                        type="number"
                        name="buildingArea"
                        required
                        value={formData.buildingArea}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contoh: 120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Lantai
                      </label>
                      <input
                        type="number"
                        name="floors"
                        value={formData.floors}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contoh: 2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Ruangan
                      </label>
                      <input
                        type="number"
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contoh: 5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Client Data */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Klien</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        required
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipe Klien *
                      </label>
                      <select
                        name="clientType"
                        required
                        value={formData.clientType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="individu">Individu</option>
                        <option value="perusahaan">Perusahaan</option>
                        <option value="developer">Developer</option>
                        <option value="pemerintah">Pemerintah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        required
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        name="clientPhone"
                        required
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="081234567890"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        name="clientAddress"
                        required
                        value={formData.clientAddress}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Alamat lengkap klien"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details & Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail & Kebutuhan Proyek</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Proyek *
                      </label>
                      <textarea
                        name="projectDescription"
                        required
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Jelaskan detail proyek yang diinginkan..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gaya Desain
                        </label>
                        <select
                          name="designStyle"
                          value={formData.designStyle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Pilih Gaya Desain</option>
                          {designStyles.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimasi Budget (Rp)
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Pilih Range Budget</option>
                          <option value="< 500 juta">&lt; 500 Juta</option>
                          <option value="500 juta - 1 miliar">500 Juta - 1 Miliar</option>
                          <option value="1 - 5 miliar">1 - 5 Miliar</option>
                          <option value="5 - 10 miliar">5 - 10 Miliar</option>
                          <option value="> 10 miliar">&gt; 10 Miliar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline Proyek
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Pilih Timeline</option>
                          <option value="< 3 bulan">&lt; 3 Bulan</option>
                          <option value="3-6 bulan">3-6 Bulan</option>
                          <option value="6-12 bulan">6-12 Bulan</option>
                          <option value="> 12 bulan">&gt; 12 Bulan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Mulai Proyek
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Kebutuhan Khusus
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {specialRequirements.map(req => (
                          <label key={req} className="flex items-center">
                            <input
                              type="checkbox"
                              name="specialRequirements"
                              value={req}
                              checked={formData.specialRequirements.includes(req)}
                              onChange={handleInputChange}
                              className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{req}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Materials */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Material yang Diinginkan
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {materialsOptions.map(material => (
                          <label key={material} className="flex items-center">
                            <input
                              type="checkbox"
                              name="materials"
                              value={material}
                              checked={formData.materials.includes(material)}
                              onChange={handleInputChange}
                              className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{material}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Layanan yang Dibutuhkan
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {servicesOptions.map(service => (
                          <label key={service} className="flex items-center">
                            <input
                              type="checkbox"
                              name="services"
                              value={service}
                              checked={formData.services.includes(service)}
                              onChange={handleInputChange}
                              className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Desain/Sketsa (Optional)
                        </label>
                        <input
                          type="file"
                          name="designFile"
                          accept=".pdf,.jpg,.jpeg,.png,.dwg"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format: PDF, JPG, PNG, DWG (Max 10MB)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Foto Lokasi (Optional)
                        </label>
                        <input
                          type="file"
                          name="sitePhoto"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format: JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferensi Konsultasi
                        </label>
                        <select
                          name="consultationPreference"
                          value={formData.consultationPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="online">Online (Video Call)</option>
                          <option value="offline">Offline (Tatap Muka)</option>
                          <option value="site-visit">Kunjungan Lokasi</option>
                          <option value="office-visit">Kunjungan ke Kantor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Metode Kontak Utama
                        </label>
                        <select
                          name="contactPreference"
                          value={formData.contactPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="phone">Telepon</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Submit</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Informasi Proyek</h3>
                        <p><strong>Nama:</strong> {formData.projectName}</p>
                        <p><strong>Jenis:</strong> {formData.projectType}</p>
                        <p><strong>Lokasi:</strong> {formData.location}</p>
                        <p><strong>Luas Bangunan:</strong> {formData.buildingArea} m²</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Data Klien</h3>
                        <p><strong>Nama:</strong> {formData.clientName}</p>
                        <p><strong>Email:</strong> {formData.clientEmail}</p>
                        <p><strong>Telepon:</strong> {formData.clientPhone}</p>
                        <p><strong>Tipe:</strong> {formData.clientType}</p>
                      </div>
                    </div>

                    {formData.specialRequirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Kebutuhan Khusus</h3>
                        <p>{formData.specialRequirements.join(', ')}</p>
                      </div>
                    )}

                    {formData.materials.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Material</h3>
                        <p>{formData.materials.join(', ')}</p>
                      </div>
                    )}

                    {formData.services.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Layanan</h3>
                        <p>{formData.services.join(', ')}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Langkah Selanjutnya:</h3>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Tim kami akan menghubungi Anda dalam 1x24 jam</li>
                      <li>Konsultasi gratis untuk memahami kebutuhan detail</li>
                      <li>Survey lokasi (jika diperlukan)</li>
                      <li>Penyusunan RAB dan proposal</li>
                      <li>Presentasi dan diskusi RAB</li>
                      <li>Revisi dan finalisasi</li>
                      <li>Penandatanganan kontrak</li>
                      <li>Pelaksanaan proyek</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Sebelumnya
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Permintaan RAB'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mengapa Memilih PT. Agung Beton Kendari?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pengalaman puluhan tahun dalam industri konstruksi dengan komitmen kualitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bersertifikat</h3>
              <p className="text-gray-600 text-sm">
                Tim profesional dengan sertifikasi nasional dan internasional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tepat Waktu</h3>
              <p className="text-gray-600 text-sm">
                Komitmen penyelesaian proyek sesuai timeline yang disepakati
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Harga Kompetitif</h3>
              <p className="text-gray-600 text-sm">
                RAB transparan dengan harga terbaik di kelasnya
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">After Sales</h3>
              <p className="text-gray-600 text-sm">
                Garansi dan layanan purna jual untuk kepuasan pelanggan
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}