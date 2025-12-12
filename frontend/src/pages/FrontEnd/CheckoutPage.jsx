import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { actionCart } from "../../features/cart/cartSlice";
import { actionPurchaseCart } from "../../features/purchaseCart/purchaseCartSlice";
import { actionOrder } from "../../features/order/orderSlice";
import {
  initiateCheckout,
  updateCheckoutStatus,
} from "../../features/checkout/checkoutSlice";
import {
  calculateShippingCost,
  setSelectedShipping,
  clearShippingOptions,
} from "../../features/shipping/shippingSlice";
import { useState } from "react";

const formatCurrency = (value) => {
  if (!value && value !== 0) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const url = import.meta.env.VITE_BACKEND_URL;

  console.log(url);

  const { items: cartItems = [], loading } = useSelector(
    (state) => state.cart || {}
  );
  const purchaseCartItems = useSelector(
    (state) => state.purchaseCart?.items || []
  );

  // Shipping state dari Redux
  const {
    shippingOptions = [],
    selectedShipping,
    loading: shippingLoading,
    error: shippingError,
  } = useSelector((state) => state.shipping || {});

  // source: 'cart' | 'purchase'
  // Cek URL parameter, jika ada ?source=purchase maka set ke 'purchase'
  const urlSource = searchParams.get("source");
  const [source, setSource] = useState(
    urlSource === "purchase" ? "purchase" : "cart"
  );

  // State untuk alamat pengiriman (hanya untuk cart)
  const [addressType, setAddressType] = useState("custom"); // current, custom
  const [customAddress, setCustomAddress] = useState({
    houseNumber: "",
    street: "",
    kelurahan: "",
    kecamatan: "",
    district: "", // Add district field for shipping calculation
    city: "",
    province: "",
    postalCode: "",
    country: "Indonesia",
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState("");

  // State untuk autocomplete alamat
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const selectedItems = source === "cart" ? cartItems : purchaseCartItems;

  useEffect(() => {
    // Fetch cart on mount (backend cart for buyers)
    dispatch(actionCart.fetchCart());
  }, [dispatch]);

  // Fungsi untuk mendapatkan lokasi saat ini
  // Replace existing getCurrentLocation with this version
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Call backend proxy for reverse geocoding
          const resp = await fetch(
            `${url}/geocode/reverse?lat=${latitude}&lon=${longitude}`
          );
          const data = await resp.json();

          console.log("Reverse geocoding data:", data); // Debug

          const addrObj = data.address || {};

          const address = {
            houseNumber: addrObj.house_number || "",
            street:
              addrObj.road ||
              addrObj.hamlet ||
              addrObj.neighbourhood ||
              "Jalan tidak diketahui",
            kelurahan: addrObj.village || "",
            kecamatan: addrObj.municipality || addrObj.city_district || "",
            city: addrObj.city || addrObj.town || addrObj.county || "",
            province: addrObj.state || "",
            postalCode: addrObj.postcode || "",
            country: addrObj.country || "Indonesia",
          };

          setCurrentLocation(address);
          setLoadingLocation(false);
        } catch (error) {
          console.error("Gagal mendapatkan alamat:", error);
          setCurrentLocation({
            houseNumber: "",
            street: `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(
              6
            )}`,
            rt: "",
            rw: "",
            kelurahan: "",
            kecamatan: "",
            district: "", // Add district field
            city: "Auto-detect gagal",
            province: "",
            postalCode: "",
            country: "Indonesia",
          });
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Validasi kode pos Indonesia (5 digit)
  const validatePostalCode = (code) => {
    const postalRegex = /^\d{5}$/;
    if (!code) {
      setPostalCodeError("");
      return true;
    }
    if (!postalRegex.test(code)) {
      setPostalCodeError("Kode pos harus 5 digit angka");
      return false;
    }
    setPostalCodeError("");
    return true;
  };

  // Fungsi untuk search alamat (autocomplete)
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    console.log("🔍 Searching address for query:", query); // Debug
    try {
      // 🔍 Query backend yang meneruskan ke Nominatim
      const response = await fetch(
        `${url}/geocode/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("✅ Geocoding API response:", data); // Debug

      if (!Array.isArray(data)) {
        console.error("❌ Response is not an array:", data);
        setAddressSuggestions([]);
        return;
      }

      const suggestions = (data || []).map((item) => {
        const addr = item.address || {};

        // Mapping untuk struktur alamat Indonesia
        // Kelurahan/Desa: village > suburb > neighbourhood
        const kelurahan =
          addr.village || addr.suburb || addr.neighbourhood || "";

        // Kecamatan: city_district > municipality > county
        const kecamatan =
          addr.city_district ||
          addr.municipality ||
          addr.county ||
          addr.kecamatan ||
          "";

        // Kota/Kabupaten: city > town > county (jika belum dipakai untuk kecamatan)
        const city =
          addr.city ||
          addr.town ||
          (addr.county && !addr.city_district ? addr.county : "") ||
          addr.municipality ||
          "";

        // Buat label suggestion yang lebih pendek dan relevan
        const parts = [
          addr.road,
          kelurahan,
          kecamatan,
          city,
          addr.state,
        ].filter(Boolean);

        const shortLabel = parts.join(", ");

        return {
          display_name: shortLabel || item.display_name, // fallback bila minim data
          full_display_name: item.display_name, // simpan juga versi panjang
          address: {
            houseNumber: addr.house_number || "",
            street: addr.road || addr.pedestrian || "",
            kelurahan: addr.village || addr.suburb || addr.neighbourhood || "",
            kecamatan: kecamatan,
            city: city,
            province: addr.state || "",
            postalCode: addr.postcode || "",
            country: addr.country || "Indonesia",
          },
        };
      });

      console.log("✅ Processed suggestions:", suggestions); // Debug
      setAddressSuggestions(suggestions);
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("❌ Error searching address:", error);
      alert(
        "Gagal mencari alamat. Pastikan backend berjalan dan koneksi internet aktif."
      );
      setAddressSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce search alamat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressQuery.trim().length >= 3) {
        searchAddress(addressQuery);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [addressQuery]);

  // Handle click outside untuk menutup dropdown suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-fetch lokasi saat user pilih "Lokasi Saat Ini"
  useEffect(() => {
    if (addressType === "current" && !currentLocation && !loadingLocation) {
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressType]);

  // Auto-calculate shipping saat alamat berubah
  useEffect(() => {
    if (source !== "cart" || selectedItems.length === 0) {
      dispatch(clearShippingOptions());
      return;
    }
    // Tentukan provinceName dari alamat
    let provinceName = "";
    if (addressType === "current" && currentLocation?.province) {
      provinceName = currentLocation.province;
    } else if (addressType === "custom" && customAddress.province) {
      provinceName = customAddress.province;
    }

    let cityName = "";
    if (addressType === "current" && currentLocation?.city) {
      cityName = currentLocation.city;
    } else if (addressType === "custom" && customAddress.city) {
      cityName = customAddress.city;
    }

    let districtName = "";
    if (addressType === "current" && currentLocation?.kecamatan) {
      districtName = currentLocation.kecamatan;
    } else if (addressType === "custom" && customAddress.district) {
      districtName = customAddress.district;
    }

    if (!cityName) {
      dispatch(clearShippingOptions());
      return;
    }

    // Hitung total berat (asumsi setiap item = 1000 gram)
    // Anda bisa menambahkan field weight di product model
    const totalWeight = selectedItems.reduce(
      (total, item) => total + (item.quantity || 0) * 1000,
      0
    );

    // Panggil API untuk menghitung biaya pengiriman
    dispatch(
      calculateShippingCost({
        provinceName,
        cityName,
        districtName,
        weight: totalWeight,
      })
    );
  }, [
    source,
    addressType,
    currentLocation,
    customAddress.province,
    customAddress.city,
    customAddress.district,
    selectedItems,
    dispatch,
  ]);

  const handleIncrease = (item) => {
    if (source === "cart") {
      dispatch(
        actionCart.upsertItemInCart({
          productId: item.productId,
          quantity: item.quantity + 1,
        })
      );
    } else {
      dispatch(
        actionPurchaseCart.updateQuantity({
          productId: item.productId,
          quantity: (item.quantity || 0) + 1,
        })
      );
    }
  };

  const handleDecrease = (item) => {
    const newQty = (item.quantity || 0) - 1;
    if (newQty <= 0) {
      if (!confirm("Hapus item dari keranjang?")) return;

      if (source === "cart") {
        dispatch(actionCart.deleteCartItem(item.productId));
      } else {
        dispatch(actionPurchaseCart.removeItem(item.productId));
      }

      return;
    }

    if (source === "cart") {
      dispatch(
        actionCart.upsertItemInCart({
          productId: item.productId,
          quantity: newQty,
        })
      );
    } else {
      dispatch(
        actionPurchaseCart.updateQuantity({
          productId: item.productId,
          quantity: newQty,
        })
      );
    }
  };

  const handleRemove = (item) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    if (source === "cart") {
      dispatch(actionCart.deleteCartItem(item.productId));
    } else {
      dispatch(actionPurchaseCart.removeItem(item.productId));
    }
  };

  const subtotal = selectedItems.reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
    0
  );

  // Shipping cost hanya untuk MATERIAL_PURCHASE (cart), tidak untuk PROJECT (purchase)
  const shippingCost = source === "cart" ? selectedShipping?.cost || 0 : 0;
  const totalAmount = subtotal + shippingCost;

  const handlePay = () => {
    if (selectedItems.length === 0) {
      alert("Keranjang kosong.");
      return;
    }

    // Prepare delivery address - selalu kumpulkan untuk semua tipe order
    let deliveryAddress = {};

    if (addressType === "current") {
      if (!currentLocation) {
        alert("Sedang mendapatkan lokasi Anda. Mohon tunggu sebentar.");
        return;
      }
      deliveryAddress = currentLocation;
    } else if (addressType === "custom") {
      if (
        !customAddress.street ||
        !customAddress.kelurahan ||
        !customAddress.kecamatan ||
        !customAddress.city ||
        !customAddress.province
      ) {
        alert(
          "Mohon lengkapi alamat pengiriman (minimal jalan, kelurahan, kecamatan, kota, provinsi)."
        );
        return;
      }
      if (!validatePostalCode(customAddress.postalCode)) {
        alert("Kode pos tidak valid. Harus 5 digit angka.");
        return;
      }
      deliveryAddress = customAddress;
      console.log("📦 Alamat pengiriman yang akan digunakan:", deliveryAddress);
    }

    // Validasi khusus untuk MATERIAL_PURCHASE
    if (source === "cart") {
      // Validasi shipping option harus dipilih untuk pembelian material
      if (!selectedShipping) {
        alert("Mohon pilih metode pengiriman terlebih dahulu.");
        return;
      }
    }

    // Prepare payload expected by backend
    const payload = {
      orderType: source === "cart" ? "MATERIAL_PURCHASE" : "PROJECT",
      rabId: null,
      deliveryAddress: deliveryAddress,
      shippingCost: source === "cart" ? shippingCost : 0, // Shipping cost hanya untuk MATERIAL_PURCHASE
      discount: 0,
    };

    // Validasi dan set rabId untuk PROJECT order
    if (source === "purchase") {
      // Try to obtain RAB id from sessionStorage or ask the user
      const storedRabId = sessionStorage.getItem("selectedRabId");
      if (storedRabId) {
        payload.rabId = storedRabId;
      } else {
        const asked = prompt("Masukkan ID RAB yang ingin dibayar (required):");
        if (!asked || asked.trim() === "") {
          alert("RAB ID diperlukan untuk melakukan pembayaran RAB.");
          return;
        }
        payload.rabId = asked.trim();
      }
    }

    // Dispatch checkout initiation to backend
    dispatch(initiateCheckout(payload))
      .unwrap()
      .then((res) => {
        const data = res?.data || res;

        // ---- Tambahkan ini ----
        if (window.snap) {
          window.snap.pay(data.token, {
            onSuccess: function (result) {
              console.log("Success:", result);
              // Update checkout status di database
              dispatch(
                updateCheckoutStatus({
                  checkoutId: data.checkoutId,
                  status: "paid",
                  transactionId: result.transaction_id,
                })
              );
              // Kosongkan keranjang setelah pembayaran berhasil
              if (source === "cart") {
                dispatch(actionCart.clearCart());
              } else {
                dispatch(actionPurchaseCart.clearCart());
              }
              // Redirect ke dashboard setelah pembayaran sukses
              setTimeout(() => {
                navigate("/customer");
              }, 1000);
            },
            onPending: function (result) {
              console.log("Pending:", result);
              alert("Menunggu pembayaran...");

              // Update checkout status di database
              dispatch(
                updateCheckoutStatus({
                  checkoutId: data.checkoutId,
                  status: "pending",
                  transactionId: result.transaction_id,
                })
              );

              // Order tetap dengan status payment_confirmed (menunggu)
              if (data.orderId) {
                dispatch(
                  actionOrder.updateOrder({
                    _id: data.orderId,
                    status: "payment_confirmed",
                  })
                );
              }

              // Kosongkan keranjang walaupun pending
              if (source === "cart") {
                dispatch(actionCart.clearCart());
              } else {
                dispatch(actionPurchaseCart.clearCart());
              }

              // Redirect ke dashboard
              setTimeout(() => {
                navigate("/customer");
              }, 1000);
            },
            onError: function (result) {
              console.log("Error:", result);
              alert("Terjadi kesalahan pembayaran");

              // Update checkout status di database
              dispatch(
                updateCheckoutStatus({
                  checkoutId: data.checkoutId,
                  status: "failed",
                  transactionId: result.transaction_id,
                })
              );

              // Update order status ke cancelled
              if (data.orderId) {
                dispatch(
                  actionOrder.updateOrder({
                    _id: data.orderId,
                    status: "cancelled",
                  })
                );
              }

              // Redirect ke dashboard
              setTimeout(() => {
                navigate("/customer");
              }, 1000);
            },
            onClose: function () {
              console.log("Popup pembayaran ditutup");
              // Redirect ke dashboard jika user menutup popup
              navigate("/customer");
            },
          });
        } else {
          alert("Midtrans Snap gagal dimuat.");
        }
      })
      .catch((err) => {
        console.error("Failed to initiate checkout:", err);
        alert(
          "Gagal memulai checkout: " + (err.message || JSON.stringify(err))
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate("/customer")}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Kembali ke Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Checkout
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSource("cart")}
                    className={`px-3 py-1 rounded ${
                      source === "cart"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Keranjang
                  </button>
                  <button
                    onClick={() => setSource("purchase")}
                    className={`px-3 py-1 rounded ${
                      source === "purchase"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    RAB (Approved)
                  </button>
                </div>
              </div>

              {source === "purchase" && (
                <p className="text-sm text-green-600 mb-3">
                  Menggunakan RAB yang sudah di-acc oleh admin
                </p>
              )}

              {loading && source === "cart" ? (
                <p className="text-gray-500">Memuat keranjang...</p>
              ) : selectedItems.length === 0 ? (
                <p className="text-gray-500">Keranjang Anda kosong.</p>
              ) : (
                <ul className="space-y-4">
                  {selectedItems.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-4 border rounded-md p-3"
                    >
                      <img
                        src={item.image || "/public/Gambar/default.png"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => (e.target.src = "/Gambar/default.png")}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 text-sm hover:underline ml-3"
                            aria-label={`Hapus ${item.productName}`}
                          >
                            Hapus
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.unit || "pcs"} • {formatCurrency(item.price)}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                              aria-label={`Kurangi ${item.productName}`}
                            >
                              −
                            </button>
                            <div className="px-4 py-1">{item.quantity}</div>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                              aria-label={`Tambah ${item.productName}`}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-sm text-gray-700">
                            Subtotal:{" "}
                            <span className="font-semibold">
                              {formatCurrency(
                                (item.price || 0) * (item.quantity || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800">
              Ringkasan Pesanan
            </h3>

            {/* Alamat Pengiriman - hanya untuk cart (MATERIAL_PURCHASE) */}
            {source === "cart" && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  📍 Alamat Pengiriman
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="current"
                      checked={addressType === "current"}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Lokasi Saat Ini</span>
                  </label>
                  {addressType === "current" && (
                    <div className="text-xs ml-6 bg-gray-50 p-2 rounded">
                      {loadingLocation ? (
                        <p className="text-blue-600">
                          🔍 Mendapatkan lokasi...
                        </p>
                      ) : currentLocation ? (
                        <div className="text-gray-600 space-y-1">
                          <p>
                            {currentLocation.houseNumber &&
                              `No. ${currentLocation.houseNumber}, `}
                            {currentLocation.street}
                          </p>
                          {(currentLocation.rt || currentLocation.rw) && (
                            <p className="text-xs">
                              {currentLocation.rt && `RT ${currentLocation.rt}`}
                              {currentLocation.rt &&
                                currentLocation.rw &&
                                " / "}
                              {currentLocation.rw && `RW ${currentLocation.rw}`}
                            </p>
                          )}
                          <p className="text-xs">
                            {currentLocation.kelurahan &&
                              `Kel. ${currentLocation.kelurahan}, `}
                            {currentLocation.kecamatan &&
                              `Kec. ${currentLocation.kecamatan}, `}
                            {currentLocation.city}
                            {currentLocation.province &&
                              `, ${currentLocation.province}`}
                            {currentLocation.postalCode &&
                              ` ${currentLocation.postalCode}`}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={getCurrentLocation}
                          className="text-blue-600 hover:underline"
                        >
                          Klik untuk mendapatkan lokasi
                        </button>
                      )}
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="custom"
                      checked={addressType === "custom"}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Alamat Lain</span>
                  </label>

                  {addressType === "custom" && (
                    <div className="ml-6 space-y-2 mt-2">
                      <p className="text-xs text-gray-500 mb-2">
                        * Wajib diisi
                      </p>

                      {/* Preview alamat yang tersimpan */}
                      {(customAddress.street || customAddress.city) && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                          <p className="text-xs font-medium text-blue-700 mb-1">
                            📍 Alamat Tersimpan:
                          </p>
                          <div className="text-xs text-blue-600">
                            {customAddress.houseNumber && (
                              <span>No. {customAddress.houseNumber}, </span>
                            )}
                            {customAddress.street && (
                              <span>{customAddress.street}</span>
                            )}
                            {customAddress.kelurahan && (
                              <span>, Kel. {customAddress.kelurahan}</span>
                            )}
                            {customAddress.kecamatan && (
                              <span>, Kec. {customAddress.kecamatan}</span>
                            )}
                            {customAddress.city && (
                              <span>, {customAddress.city}</span>
                            )}
                            {customAddress.province && (
                              <span>, {customAddress.province}</span>
                            )}
                            {customAddress.postalCode && (
                              <span> {customAddress.postalCode}</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative" ref={suggestionRef}>
                        <input
                          type="text"
                          placeholder="Cari alamat (min. 3 karakter)..."
                          value={addressQuery}
                          onChange={(e) => {
                            setAddressQuery(e.target.value);
                            if (e.target.value.length >= 3) {
                              setShowSuggestions(true);
                            }
                          }}
                          onFocus={() => {
                            if (
                              addressQuery.length >= 3 &&
                              addressSuggestions.length > 0
                            ) {
                              setShowSuggestions(true);
                            }
                          }}
                          className="w-full text-sm border rounded px-2 py-1"
                        />
                        {loadingSuggestions && (
                          <div className="absolute right-2 top-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          </div>
                        )}

                        {/* Debug info */}
                        {addressQuery.length >= 3 && !loadingSuggestions && (
                          <p className="text-xs text-gray-400 mt-1">
                            {addressSuggestions.length} hasil ditemukan
                          </p>
                        )}

                        {/* Dropdown suggestions */}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  // Simpan semua data dari suggestion
                                  setCustomAddress({
                                    houseNumber:
                                      suggestion.address.houseNumber || "",
                                    street: suggestion.address.street || "",
                                    kelurahan:
                                      suggestion.address.kelurahan || "",
                                    kecamatan:
                                      suggestion.address.kecamatan || "",
                                    district:
                                      suggestion.address.kecamatan || "",
                                    city: suggestion.address.city || "",
                                    province: suggestion.address.province || "",
                                    postalCode:
                                      suggestion.address.postalCode || "",
                                    country:
                                      suggestion.address.country || "Indonesia",
                                  });
                                  setAddressQuery(suggestion.display_name);
                                  setShowSuggestions(false);
                                  console.log(
                                    "✅ Alamat tersimpan:",
                                    suggestion.address
                                  );
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b last:border-b-0"
                              >
                                <p className="font-medium text-gray-800">
                                  {suggestion.address.street ||
                                    "Jalan tidak diketahui"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {suggestion.display_name}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="No. Rumah / Gedung"
                        value={customAddress.houseNumber}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            houseNumber: e.target.value,
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        placeholder="Jalan / Gang *"
                        value={customAddress.street}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            street: e.target.value,
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Kelurahan / Desa *"
                        value={customAddress.kelurahan}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            kelurahan: e.target.value,
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Kecamatan *"
                        value={customAddress.kecamatan}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            kecamatan: e.target.value,
                            district: e.target.value, // Sync kecamatan to district
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Kota / Kabupaten *"
                        value={customAddress.city}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            city: e.target.value,
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Provinsi *"
                        value={customAddress.province}
                        onChange={(e) =>
                          setCustomAddress({
                            ...customAddress,
                            province: e.target.value,
                          })
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                        required
                      />
                      <div>
                        <input
                          type="text"
                          placeholder="Kode Pos (5 digit)"
                          value={customAddress.postalCode}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCustomAddress({
                              ...customAddress,
                              postalCode: value,
                            });
                            validatePostalCode(value);
                          }}
                          maxLength="5"
                          className={`w-full text-sm border rounded px-2 py-1 ${
                            postalCodeError ? "border-red-500" : ""
                          }`}
                        />
                        {postalCodeError && (
                          <p className="text-xs text-red-500 mt-1">
                            {postalCodeError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Opsi Pengiriman */}
            {source === "cart" && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  🚚 Metode Pengiriman
                </h4>

                {shippingLoading && (
                  <div className="text-sm text-blue-600">
                    Menghitung biaya pengiriman...
                  </div>
                )}

                {shippingError && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {shippingError}
                  </div>
                )}

                {!shippingLoading &&
                  !shippingError &&
                  shippingOptions.length === 0 && (
                    <div className="text-sm text-gray-500 italic">
                      Pilih alamat untuk melihat opsi pengiriman
                    </div>
                  )}

                {shippingOptions.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {shippingOptions.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-blue-50 transition ${
                          selectedShipping?.service === option.service &&
                          selectedShipping?.code === option.code
                            ? "bg-blue-100 border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={
                            selectedShipping?.service === option.service &&
                            selectedShipping?.code === option.code
                          }
                          onChange={() => dispatch(setSelectedShipping(option))}
                          className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-800">
                              {option.name || option.code} - {option.service}
                            </span>

                            <span className="font-semibold text-sm text-blue-600">
                              {formatCurrency(option.cost)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            Estimasi: {option.etd}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Jumlah item</span>
                <span>
                  {selectedItems.reduce((c, it) => c + (it.quantity || 0), 0)}
                </span>
              </div>

              <div className="flex justify-between mt-2 text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Tampilkan biaya pengiriman hanya untuk material purchase */}
              {source === "cart" && selectedShipping && (
                <div className="flex justify-between mt-2 text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold">
                    {formatCurrency(shippingCost)}
                  </span>
                </div>
              )}

              {/* Info untuk PROJECT: tidak ada biaya pengiriman */}
              {source === "purchase" && (
                <div className="flex justify-between mt-2 text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold text-green-600">
                    Gratis (RAB Project)
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between mt-3 pt-3 border-t text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-blue-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePay}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Bayar Sekarang
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Pembayaran menggunakan Midtrans Payment Gateway.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
