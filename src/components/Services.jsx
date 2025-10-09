// components/Services.js
import { Card, Button } from "flowbite-react";

export default function Services() {
  const services = [
    {
      title: "Aspal & Marka Jalan",
      description:
        "Layanan pengaspalan dan pembuatan marka jalan berkualitas tinggi",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      color: "bg-red-500",
    },
    {
      title: "Beton Readymix",
      description:
        "Beton siap pakai dengan kualitas terjamin dan pengiriman tepat waktu",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
      ),
      color: "bg-blue-500",
    },
    {
      title: "Beton Precast",
      description: "Produk beton precast untuk berbagai kebutuhan konstruksi",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "bg-red-500",
    },
    {
      title: "Split / Batu Pecah",
      description:
        "Material split dan batu pecah berbagai ukuran untuk konstruksi",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "bg-red-500",
    },
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Layanan Kami
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto font-light text-gray-500 sm:text-xl">
            Kami menyediakan berbagai layanan konstruksi dan material
            berkualitas tinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 mx-auto`}
              >
                {service.icon}
              </div>
              <h5 className="text-xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h5>
              <p className="text-gray-500 mb-6">{service.description}</p>
              <Button color="failure" size="sm">
                Pesan Sekarang
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}