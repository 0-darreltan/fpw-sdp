import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderForm from "../../components/orders/OrderForm";
import OrderHistory from "../../components/orders/OrderHistory";
import ProductCatalog from "../../components/products/ProductCatalog";
import { actionOrder } from "../../features/order/orderSlice";

const CustomerDashboard = ({ onAddOrder }) => {
  const dispatch = useDispatch();
  const { currUsers } = useSelector((state) => state.users);
  const { listProducts } = useSelector((state) => state.product);
  const { listOrders } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState("catalog");
  const [cartItems, setCartItems] = useState([]);

  // Fetch orders when component mounts or when switching to history tab
  useEffect(() => {
    if (currUsers?.id) {
      dispatch(actionOrder.fetchOrders());
    }
  }, [dispatch, currUsers?.id]);

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
  ];

  const handleAddFromCatalog = (product) => {
    const productId = product.id ?? product._id;

    setCartItems((prev) => {
      // Cari item yang sudah ada berdasarkan productId
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex !== -1) {
        // Jika sudah ada, update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      // Jika belum ada, tambahkan item baru
      return [
        ...prev,
        {
          id: productId, // Gunakan productId sebagai id cart item
          productId: productId,
          quantity: 1,
          meta: product,
        },
      ];
    });

    setActiveTab("order");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "catalog":
        return <ProductCatalog onAddToCart={handleAddFromCatalog} />;

      case "order":
        return (
          <OrderForm
            products={listProducts}
            user={currUsers}
            onAddOrder={(order) => {
              if (onAddOrder) onAddOrder(order);
              setCartItems([]);
            }}
            initialItems={cartItems}
          />
        );
      case "history":
        return <OrderHistory user={currUsers} orders={listOrders} />;

      default:
        return <ProductCatalog onAddToCart={handleAddFromCatalog} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Customer
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Selamat datang, {currUsers?.user?.name || currUsers?.user?.username}
            !
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
