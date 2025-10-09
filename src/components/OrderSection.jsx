// components/OrderSection.js
'use client'
import { useState } from 'react';
import {
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
  Card,
} from "flowbite-react";

export default function OrderSection() {
  const [orderData, setOrderData] = useState({
    service: "",
    quantity: "",
    location: "",
    date: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Order data:", orderData);
    alert(
      "Terima kasih! Pesanan Anda telah diterima. Tim kami akan menghubungi Anda segera."
    );
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="order" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Solusi Terbaik Untuk Proyek Anda
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto font-light text-gray-500 sm:text-xl">
            Diskusikan kebutuhan proyek Anda kepada kami, kami akan
            merekomendasikan produk yang tepat dan terbaik untuk Anda. Silahkan
            klik tombol dibawah ini untuk dapat terhubung secara langsung.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Order Form */}
          <div className="mb-8 lg:mb-0">
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Form Pemesanan
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="service" value="Jenis Layanan*" />
                  <Select
                    id="service"
                    name="service"
                    value={orderData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Layanan</option>
                    <option value="aspal">Aspal & Marka Jalan</option>
                    <option value="readymix">Beton Readymix</option>
                    <option value="precast">Beton Precast</option>
                    <option value="split">Split / Batu Pecah</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="quantity" value="Jumlah/Volume*" />
                    <TextInput
                      id="quantity"
                      name="quantity"
                      value={orderData.quantity}
                      onChange={handleChange}
                      placeholder="Contoh: 100 m³"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" value="Tanggal Kebutuhan*" />
                    <TextInput
                      type="date"
                      id="date"
                      name="date"
                      value={orderData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" value="Lokasi Proyek*" />
                  <TextInput
                    id="location"
                    name="location"
                    value={orderData.location}
                    onChange={handleChange}
                    placeholder="Alamat lengkap lokasi proyek"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" value="Nama Lengkap*" />
                    <TextInput
                      id="name"
                      name="name"
                      value={orderData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" value="No. Telepon*" />
                    <TextInput
                      type="tel"
                      id="phone"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleChange}
                      placeholder="08xx-xxxx-xxxx"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    type="email"
                    id="email"
                    name="email"
                    value={orderData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" value="Catatan Tambahan" />
                  <Textarea
                    id="notes"
                    name="notes"
                    value={orderData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Spesifikasi khusus atau permintaan tambahan..."
                  />
                </div>

                <Button type="submit" color="failure" className="w-full">
                  Kirim Pesanan
                </Button>
              </form>
            </Card>
          </div>

          {/* Quick Order Options */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Dapatkan Penawaran
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+62-xxx-xxxx-xxxx"
                className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Telepon Langsung
                  </h4>
                  <p className="text-gray-600">
                    Hubungi untuk konsultasi langsung
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/62xxx"
                className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.686z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <p className="text-gray-600">
                    Chat langsung untuk respon cepat
                  </p>
                </div>
              </a>

              <a
                href="mailto:info@agungbeton.com"
                className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">Kirim detail proyek Anda</p>
                </div>
              </a>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">
                Mengapa Memilih Kami?
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Kualitas terjamin dan bersertifikat
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pengiriman tepat waktu
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Harga kompetitif
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tim berpengalaman
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}