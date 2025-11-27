import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { actionCart } from "../../features/cart/cartSlice";
import { actionPurchaseCart } from "../../features/purchaseCart/purchaseCartSlice";
import { initiateCheckout } from "../../features/checkout/checkoutSlice";
// SHIPPING DISABLED
// import {
//   calculateShippingCost,
//   setSelectedShipping,
//   clearShippingOptions,
// } from "../../features/shipping/shippingSlice";
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

  const { items: cartItems = [], loading } = useSelector(
    (state) => state.cart || {}
  );
  const purchaseCartItems = useSelector(
    (state) => state.purchaseCart?.items || []
  );

  // Shipping state dari Redux - DISABLED
  // const {
  //   shippingOptions = [],
  //   selectedShipping,
  //   loading: shippingLoading,
  //   error: shippingError,
  // } = useSelector((state) => state.shipping || {});

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
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
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

  const selectedItems = source === "cart" ? cartItems : purchaseCartItems;

  useEffect(() => {
    // Fetch cart on mount (backend cart for buyers)
    dispatch(actionCart.fetchCart());
  }, [dispatch]);

  // Fungsi untuk mendapatkan lokasi saat ini
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
          // Reverse geocoding menggunakan Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          const address = {
            houseNumber: data.address.house_number || "",
            street:
              data.address.road ||
              data.address.hamlet ||
              "Jalan tidak diketahui",
            rt: "",
            rw: "",
            kelurahan: data.address.village || data.address.suburb || "",
            kecamatan: data.address.suburb || data.address.city_district || "",
            city:
              data.address.city ||
              data.address.town ||
              data.address.county ||
              "",
            province: data.address.state || "",
            postalCode: data.address.postcode || "",
            country: "Indonesia",
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
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Indonesia"
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();

      setAddressSuggestions(
        data.map((item) => ({
          display_name: item.display_name,
          address: {
            houseNumber: item.address.house_number || "",
            street: item.address.road || item.address.hamlet || "",
            rt: "",
            rw: "",
            kelurahan: item.address.village || item.address.suburb || "",
            kecamatan: item.address.suburb || item.address.city_district || "",
            city:
              item.address.city ||
              item.address.town ||
              item.address.county ||
              "",
            province: item.address.state || "",
            postalCode: item.address.postcode || "",
            country: "Indonesia",
          },
        }))
      );
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching address:", error);
      setAddressSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce search alamat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressQuery) {
        searchAddress(addressQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [addressQuery]);

  // Auto-fetch lokasi saat user pilih "Lokasi Saat Ini"
  useEffect(() => {
    if (addressType === "current" && !currentLocation && !loadingLocation) {
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressType]);

  // Auto-calculate shipping saat alamat berubah - DISABLED
  // useEffect(() => {
  //   if (source !== "cart" || selectedItems.length === 0) {
  //     dispatch(clearShippingOptions());
  //     return;
  //   }

  //   let cityName = "";
  //   if (addressType === "current" && currentLocation?.city) {
  //     cityName = currentLocation.city;
  //   } else if (addressType === "custom" && customAddress.city) {
  //     cityName = customAddress.city;
  //   }

  //   if (!cityName) {
  //     dispatch(clearShippingOptions());
  //     return;
  //   }

  //   // Hitung total berat (asumsi setiap item = 1000 gram)
  //   // Anda bisa menambahkan field weight di product model
  //   const totalWeight = selectedItems.reduce(
  //     (total, item) => total + (item.quantity || 0) * 1000,
  //     0
  //   );

  //   // Panggil API untuk menghitung biaya pengiriman
  //   dispatch(calculateShippingCost({ cityName, weight: totalWeight }));
  // }, [
  //   source,
  //   addressType,
  //   currentLocation,
  //   customAddress.city,
  //   selectedItems,
  //   dispatch,
  // ]);

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

  // SHIPPING DISABLED - Set to 0
  const shippingCost = 0; // selectedShipping?.cost || 0;
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
    }

    // Validasi khusus untuk MATERIAL_PURCHASE - SHIPPING DISABLED
    // if (source === "cart") {
    //   // Validasi shipping option harus dipilih untuk pembelian material
    //   if (!selectedShipping) {
    //     alert("Mohon pilih metode pengiriman terlebih dahulu.");
    //     return;
    //   }
    // }

    // Prepare payload expected by backend
    const payload = {
      orderType: source === "cart" ? "MATERIAL_PURCHASE" : "PROJECT",
      rabId: null,
      deliveryAddress: deliveryAddress,
      shippingCost: source === "cart" ? shippingCost : 0,
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
              alert("Pembayaran sukses!");

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

              // Redirect ke dashboard
              setTimeout(() => {
                navigate("/customer");
              }, 1000);
            },
            onError: function (result) {
              console.log("Error:", result);
              alert("Terjadi kesalahan pembayaran");

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
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cari alamat (min. 3 karakter)..."
                          value={addressQuery}
                          onChange={(e) => {
                            setAddressQuery(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          className="w-full text-sm border rounded px-2 py-1"
                        />
                        {loadingSuggestions && (
                          <div className="absolute right-2 top-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          </div>
                        )}

                        {/* Dropdown suggestions */}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setCustomAddress(suggestion.address);
                                  setAddressQuery(suggestion.display_name);
                                  setShowSuggestions(false);
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
                        placeholder="Nomor Rumah / Blok"
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
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="RT"
                          value={customAddress.rt}
                          onChange={(e) =>
                            setCustomAddress({
                              ...customAddress,
                              rt: e.target.value,
                            })
                          }
                          className="w-full text-sm border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          placeholder="RW"
                          value={customAddress.rw}
                          onChange={(e) =>
                            setCustomAddress({
                              ...customAddress,
                              rw: e.target.value,
                            })
                          }
                          className="w-full text-sm border rounded px-2 py-1"
                        />
                      </div>
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

            {/* Opsi Pengiriman - DISABLED */}
            {/* {source === "cart" && (
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
                        selectedShipping?.courier === option.courier
                          ? "bg-blue-100 border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={
                          selectedShipping?.service === option.service &&
                          selectedShipping?.courier === option.courier
                        }
                        onChange={() => dispatch(setSelectedShipping(option))}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-gray-800">
                            {option.courier.toUpperCase()} - {option.service}
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
          )} */}

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

              {/* Tampilkan biaya pengiriman untuk material purchase - DISABLED */}
              {/* {source === "cart" && selectedShipping && (
              <div className="flex justify-between mt-2 text-gray-600">
                <span>Biaya Pengiriman</span>
                <span className="font-semibold">
                  {formatCurrency(shippingCost)}
                </span>
              </div>
            )} */}

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
