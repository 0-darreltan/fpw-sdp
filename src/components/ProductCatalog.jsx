import React from "react";

const ProductCatalog = ({ products, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getProductIcon = (category) => {
    switch (category) {
      case "Aspal":
        return "🛣️";
      case "Beton":
        return "🏗️";
      case "Agregat":
        return "🪨";
      default:
        return "📦";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Katalog Produk
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Produk berkualitas tinggi untuk kebutuhan konstruksi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 text-3xl">
                {getProductIcon(product.category)}
              </div>

              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-1">
                  {product.name}
                </h4>
                <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mb-2">
                  {product.category}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  / {product.unit}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Tambah ke Pesanan
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 sm:p-8">
        <div className="text-center">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Butuh Konsultasi?
          </h4>
          <p className="text-gray-600 mb-6">
            Hubungi tim kami untuk mendapatkan penawaran terbaik
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm">
              <span className="text-xl">📞</span>
              <span className="text-gray-700 font-medium">
                +62 821-xxxx-xxxx
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm">
              <span className="text-xl">✉️</span>
              <span className="text-gray-700 font-medium">
                info@agungbeton.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
