import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderForm from "../../components/orders/OrderForm";
import OrderHistory from "../../components/orders/OrderHistory";
import ProductCatalog from "../../components/products/ProductCatalog";
import { actionOrder } from "../../features/order/orderSlice";
import { actionProduct } from "../../features/product/productSlice";
import { actionCart } from "../../features/cart/cartSlice";
import { actionRab } from "../../features/RAB/rabSlice";
import MaterialPurchaseForm from "../../components/materials/MaterialPurchaseForm";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { currUsers } = useSelector((state) => state.users);
  const { listProducts } = useSelector((state) => state.product);
  const { listOrders } = useSelector((state) => state.order);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [activeTab, setActiveTab] = useState("catalog");

  // ✅ Debug cart items
  useEffect(() => {
    console.log("🛒 Cart Items from Redux:", cartItems);
  }, [cartItems]);

  // ✅ Fetch data saat component mount
  useEffect(() => {
    dispatch(actionProduct.fetchProduct());

    if (currUsers?.user?.id) {
      dispatch(actionOrder.fetchOrders());

      // ✅ Fetch cart dan log response
      dispatch(actionCart.fetchCart())
        .unwrap()
        .then((response) => {
          console.log("✅ Fetch Cart Response:", response);
        })
        .catch((error) => {
          console.error("❌ Fetch Cart Error:", error);
        });
    }
  }, [dispatch, currUsers?.user?.id]);

  const tabs = [
    { id: "catalog", label: "Katalog Produk", icon: "📦" },
    { id: "order", label: "Buat Pesanan", icon: "📝" },
    { id: "materials", label: "Beli Material", icon: "🛒" },
    { id: "history", label: "Riwayat Pesanan", icon: "📋" },
  ];

  // ✅ Handle add to cart dengan logging
  const handleAddFromCatalog = async (product) => {
    const productId = product.id ?? product._id;

    console.log("➕ Adding to cart:", { productId, product });

    try {
      const upsertResponse = await dispatch(
        actionCart.upsertItemInCart({
          productId: productId,
          quantity: 1,
        })
      ).unwrap();

      console.log("✅ Upsert Response:", upsertResponse);

      const fetchResponse = await dispatch(actionCart.fetchCart()).unwrap();
      console.log("✅ Cart after add:", fetchResponse);

      setActiveTab("order");
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      alert("Gagal menambahkan ke keranjang: " + error.message);
    }
  };

  const handleOrderComplete = async () => {
    try {
      await dispatch(actionCart.clearCart()).unwrap();
      await dispatch(actionCart.fetchCart()).unwrap();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // ✅ Handle submit RAB request
  const handleSubmitOrder = async (orderData) => {
    try {
      console.log("📤 Submitting RAB request:", orderData);

      // Validate required fields
      if (!orderData.projectName || !orderData.projectLocation) {
        alert("Nama proyek dan lokasi harus diisi");
        return;
      }

      if (!orderData.items || orderData.items.length === 0) {
        alert("Minimal harus ada 1 item dalam pesanan");
        return;
      }

      // Create RAB request
      const rabData = {
        title: orderData.projectName,
        description: orderData.projectDescription || `Proyek ${orderData.projectName}`,
        location: orderData.projectLocation,
        estimatedBudget: orderData.total,
        expectedStartDate: orderData.startDate,
        customerNotes: `Items: ${orderData.items.map(i => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}`,
      };

      console.log("📋 RAB Data:", rabData);

      await dispatch(actionRab.createRABRequest(rabData)).unwrap();

      alert("✅ Permintaan RAB berhasil diajukan! Silakan tunggu penawaran dari Project Manager.");
      
      // Clear cart after successful submission
      await handleOrderComplete();
    } catch (error) {
      console.error("❌ Failed to submit RAB:", error);
      alert("Gagal mengajukan RAB: " + (error.message || error));
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "catalog":
        return <ProductCatalog onAddToCart={handleAddFromCatalog} />;

      case "order":
        return (
          <OrderForm
            products={listProducts}
            user={currUsers?.user}
            onAddOrder={handleSubmitOrder}
            onOrderComplete={handleOrderComplete}
          />
        );

      case "history":
        return <OrderHistory user={currUsers?.user} orders={listOrders} />;

      case "material":
        return <MaterialPurchaseForm user={currUsers} />;

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
