import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionProduct } from "../../features/product/productSlice";

const ProductCatalog = ({ onAddToCart }) => {
  const dispatch = useDispatch();

  // ✅ Get data from Redux
  const { listProducts, loading, error } = useSelector(
    (state) => state.product
  );

  const [localError, setLocalError] = useState(null);

  // ✅ Fetch products saat component mount
  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        console.log("🚀 Fetching products...");
        dispatch(actionProduct.fetchProduct());
        if (mounted) console.log("✅ Products loaded successfully");
      } catch (err) {
        if (mounted) {
          console.error("❌ Failed to load products:", err);
          setLocalError(err?.message || "Gagal memuat produk");
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getProductIcon = (category) => {
    switch ((category || "").toLowerCase()) {
      case "aspal":
        return "🛣️";
      case "beton":
        return "🏗️";
      case "agregat":
        return "🪨";
      default:
        return "📦";
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 h-80 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || localError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Gagal Memuat Produk
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.message || localError || "Terjadi kesalahan"}
          </p>
          <button
            onClick={() => dispatch(actionProduct.fetchProduct())}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ✅ Empty state
  if (!Array.isArray(listProducts) || listProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Katalog Produk</h3>
        <p className="text-gray-600 mb-6">
          Belum ada produk tersedia saat ini.
        </p>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">Produk akan segera ditambahkan</p>
        </div>
      </div>
    );
  }

  // ✅ Render products
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Katalog Produk
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Produk berkualitas tinggi untuk kebutuhan konstruksi Anda
        </p>
        <p className="text-sm text-blue-600 mt-2">
          📊 Menampilkan {listProducts.length} produk
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {listProducts.map((product, idx) => {
          const id = product?.id ?? product?._id ?? `product-${idx}`;
          const bom = Array.isArray(product?.bom) ? product.bom : [];

          return (
            <div
              key={id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mx-auto mb-4 text-4xl">
                  {getProductIcon(product?.category)}
                </div>

                <div className="text-center mb-3">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {product?.name || "Produk"}
                  </h4>
                  {product?.category && (
                    <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">
                      {product.category}
                    </p>
                  )}
                  {product?.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="text-center mb-3 mt-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(Number(product?.price || 0))}
                  </span>
                  {product?.unit && (
                    <span className="text-gray-500 text-sm ml-1">
                      / {product.unit}
                    </span>
                  )}
                </div>

                {bom.length > 0 && (
                  <div className="text-left mt-3 px-2 bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      📋 Material:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bom.map((b, i) => (
                        <li
                          key={b?.materialId || i}
                          className="flex justify-between"
                        >
                          <span>{b?.materialName || `Material ${i + 1}`}</span>
                          <span className="font-medium">{b?.qty || 0}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={() =>
                    onAddToCart &&
                    onAddToCart({
                      ...product,
                      id, // ✅ ensure consistent id
                    })
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  <span>Tambah ke Pesanan</span>
                </button>
              </div>
            </div>
          );
        })}
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
