import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionProduct } from "../../features/product/productSlice";

const ShopCatalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listProducts, isLoading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(actionProduct.fetchProduct());
  }, [dispatch]);

  // Filter products by status active
  const activeProducts = listProducts.filter(
    (product) => product.status === "active"
  );

  // Filter products by search and category
  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "All",
    ...new Set(
      activeProducts.map((product) => product.category).filter(Boolean)
    ),
  ];

  const handleViewDetails = (productId) => {
    navigate(`/catalog/${productId}`);
  };

  const handleBuyNow = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/catalog" } });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="text-6xl">🏗️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Katalog Produk Beton
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Solusi beton berkualitas tinggi untuk berbagai kebutuhan
              konstruksi Anda
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search & Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              Menampilkan {filteredProducts.length} produk
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-2xl">🏗️</span>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
                        {product.category === "Beton Ready Mix" && "🏗️"}
                        {product.category === "Beton Precast" && "🧱"}
                        {product.category === "Mortar" && "⚒️"}
                        {![
                          "Beton Ready Mix",
                          "Beton Precast",
                          "Mortar",
                        ].includes(product.category) && "📦"}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Tersedia
                      </span>
                    </div>

                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(product.price || 0)}
                      </span>
                      {product.unit && (
                        <span className="text-sm text-gray-500 ml-1">
                          /{product.unit}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(product._id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Detail
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada produk ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopCatalog;
