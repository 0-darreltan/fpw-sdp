import React from "react";

const MaterialCatalog = ({ materials, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Katalog Material</h3>
        <p className="text-gray-600 text-sm sm:text-base">Daftar material yang tersedia di gudang</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {materials.map((mat) => (
          <div key={mat.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-1">{mat.name}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{mat.description}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-green-600">{formatPrice(mat.price)}</span>
                <span className="text-gray-500 text-sm ml-1">/ {mat.unit}</span>
              </div>

              <div className="text-center text-sm text-gray-600">Stok: {mat.stock}</div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => onAddToCart && onAddToCart({ id: mat.id, isMaterial: true })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Tambah ke Pesanan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialCatalog;
