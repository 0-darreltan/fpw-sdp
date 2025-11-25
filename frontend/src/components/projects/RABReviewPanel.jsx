import React, { useState, useEffect } from "react";

const RABReviewPanel = ({ rab, onApprove, onReject, onUpdateItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("🔑 Token:", token ? "exists" : "missing");
        
        const response = await fetch("http://localhost:3000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("📡 Response Status:", response.status);
        const result = await response.json();
        console.log("📦 API Response:", result);
        
        // Handle the API response structure: { success: true, data: [...] }
        if (result.success && Array.isArray(result.data)) {
          console.log("✅ Products loaded:", result.data.length);
          console.log("📦 Sample Product:", result.data[0]);
          setProducts(result.data);
        } else if (Array.isArray(result)) {
          // Fallback for direct array response
          console.log("✅ Products loaded (direct array):", result.length);
          setProducts(result);
        } else {
          console.warn("⚠️ Unexpected response format:", result);
          setProducts([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
        setProducts([]);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Initialize items with proper fallback for unitPrice
  const normalizeItems = (items) => {
    if (!items || items.length === 0) return [];
    
    return items.map(item => {
      // Try to find matching product by name to get productId if not already set
      const matchingProduct = products.find(p => p.name === (item.materialName || item.description));
      
      // Preserve existing productId or find matching one
      const productId = item.productId || (matchingProduct ? (matchingProduct._id || matchingProduct.id) : "");
      
      // Preserve existing unitPrice or get from matched product
      let unitPrice = item.unitPrice;
      if (!unitPrice || unitPrice === "" || unitPrice === 0) {
        // If no price, try to get from matched product
        if (matchingProduct) {
          unitPrice = matchingProduct.price || 0;
        } else {
          unitPrice = 0;
        }
      }
      
      const quantity = parseFloat(item.quantity || item.qty) || 0;
      const price = parseFloat(unitPrice) || 0;
      
      return {
        productId,
        materialName: item.materialName || item.description || "",
        description: item.description || "",
        quantity,
        unit: item.unit || "pcs",
        unitPrice: price, // Always store as number
        totalPrice: quantity * price,
      };
    });
  };
  
  const [editedItems, setEditedItems] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [notes, setNotes] = useState("");
  
  // Update editedItems when products are loaded or rab changes
  React.useEffect(() => {
    if (products.length > 0 || rab.items) {
      setEditedItems(normalizeItems(rab.items || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, rab.items]);
  
  // Debug log
  console.log("RAB Items:", rab.items);
  console.log("Normalized Items with ProductIds:", editedItems);
  
  // Auto-enable edit mode if items don't have prices
  const needsPricing = editedItems.some(item => !item.unitPrice || item.unitPrice === 0 || item.unitPrice === "");
  
  // Set editing mode on mount if pricing is needed
  React.useEffect(() => {
    if (needsPricing && !isEditing && editedItems.length > 0) {
      setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsPricing, editedItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Handle material item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...editedItems];
    
    // If selecting product from dropdown by ID
    if (field === "productId" && value !== "") {
      const selectedProduct = products.find(p => (p._id || p.id) === value);
      console.log("🔍 Selected Product:", selectedProduct);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          productId: value, // Store the selected product ID
          materialName: selectedProduct.name,
          unit: selectedProduct.unit || "pcs",
          unitPrice: selectedProduct.price || 0,
        };
        
        // Recalculate total
        const quantity = parseFloat(newItems[index].quantity) || 0;
        const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
        newItems[index].totalPrice = quantity * unitPrice;
        
        console.log("💰 Updated Item:", newItems[index]);
        setEditedItems(newItems);
        return;
      }
    }
    
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate total price if quantity or unitPrice changed
    if (field === "quantity" || field === "unitPrice") {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].totalPrice = quantity * unitPrice;
    }
    
    setEditedItems(newItems);
  };

  const handleAddItem = () => {
    setEditedItems([
      ...editedItems,
      {
        materialName: "",
        description: "",
        quantity: 0,
        unit: "pcs",
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (window.confirm("Hapus material ini?")) {
      setEditedItems(editedItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return editedItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);
  };

  const handleSaveItems = () => {
    if (editedItems.some((item) => !item.materialName || item.quantity <= 0)) {
      alert("Semua material harus memiliki nama dan jumlah yang valid!");
      return;
    }
    
    // Ensure all items have proper number values before saving
    const itemsToSave = editedItems.map(item => ({
      ...item,
      productId: item.productId || "",
      quantity: parseFloat(item.quantity) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
      totalPrice: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
    }));
    
    console.log("💾 Saving items:", itemsToSave);
    onUpdateItems(itemsToSave);
    setIsEditing(false);
  };

  const handleApproveClick = () => {
    if (editedItems.length === 0) {
      alert("RAB harus memiliki minimal 1 material!");
      return;
    }
    
    // Validate all items have prices
    const itemsWithoutPrice = editedItems.filter(item => !item.unitPrice || parseFloat(item.unitPrice) <= 0);
    if (itemsWithoutPrice.length > 0) {
      alert("Semua material harus memiliki harga satuan! Silakan isi harga terlebih dahulu.");
      setIsEditing(true);
      return;
    }
    
    setShowApproveModal(true);
  };

  const handleConfirmApprove = () => {
    const totalEstimated = calculateTotal();
    onApprove({
      items: editedItems,
      totalEstimated,
      pmNotes: notes,
    });
    setShowApproveModal(false);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan harus diisi!");
      return;
    }
    onReject(rejectReason);
    setShowRejectModal(false);
  };

  // Debug log products state on every render
  console.log("🔄 RABReviewPanel Render - Products State:", products);
  console.log("🔄 Products Count:", products.length);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{rab.title}</h3>
            <p className="text-gray-600 mt-1">{rab.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Status</div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Dalam Review
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="text-sm text-gray-600">Customer:</span>
            <p className="font-medium">{rab.customerName || "-"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Email:</span>
            <p className="font-medium">{rab.customerEmail || "-"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Lokasi:</span>
            <p className="font-medium">{rab.location || "-"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Tanggal Mulai:</span>
            <p className="font-medium">{formatDate(rab.expectedStartDate)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Estimasi Budget Customer:</span>
            <p className="font-medium">{formatCurrency(rab.estimatedBudget)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Tanggal Pengajuan:</span>
            <p className="font-medium">{formatDate(rab.submittedAt)}</p>
          </div>
        </div>

        {rab.customerNotes && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <span className="text-sm font-medium text-yellow-800">Catatan Customer:</span>
            <p className="text-sm text-gray-700 mt-1">{rab.customerNotes}</p>
          </div>
        )}
      </div>

      {/* Materials Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-gray-900">
            Material yang Diminta & RAB
          </h4>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📝 Edit Material
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveItems}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✓ Simpan
                </button>
                <button
                  onClick={() => {
                    setEditedItems(normalizeItems(rab.items || []));
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ✕ Batal
                </button>
              </>
            )}
          </div>
        </div>

        {/* Alert untuk PM mengisi harga */}
        {needsPricing && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-orange-900">Harga Material Belum Lengkap</p>
                <p className="text-sm text-orange-800 mt-1">
                  Beberapa material belum memiliki harga satuan. Silakan isi harga untuk semua material sebelum approve RAB.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jumlah
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Satuan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Harga Satuan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                {isEditing && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Belum ada material. Klik "Edit Material" untuk menambah.
                  </td>
                </tr>
              ) : (
                editedItems.map((item, index) => (
                  <tr key={index} className={isEditing ? "bg-blue-50" : ""}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={item.productId || ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              console.log("🎯 Selected Product ID:", e.target.value);
                              handleItemChange(index, "productId", e.target.value);
                            }
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Pilih Produk ({products.length} tersedia)</option>
                          {products.length > 0 ? (
                            products.map((product) => (
                              <option key={product._id || product.id} value={product._id || product.id}>
                                {product.name} ({product.unit || "pcs"}) - Rp {product.price?.toLocaleString("id-ID") || 0}
                              </option>
                            ))
                          ) : (
                            <option disabled>Memuat produk...</option>
                          )}
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.materialName || item.description || "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity || 0}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.quantity || 0}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.unit || "pcs"}
                          onChange={(e) =>
                            handleItemChange(index, "unit", e.target.value)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          placeholder="pcs"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.unit || "pcs"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", e.target.value)
                          }
                          className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="1000"
                          placeholder="Isi harga"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.unitPrice && parseFloat(item.unitPrice) > 0 
                            ? formatCurrency(parseFloat(item.unitPrice))
                            : <span className="text-red-500 italic">Belum diisi</span>
                          }
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(
                        (item.quantity || 0) * (item.unitPrice || 0)
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus material"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan={isEditing ? "5" : "5"}
                  className="px-4 py-3 text-right font-bold text-gray-900"
                >
                  Total Estimasi:
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(calculateTotal())}
                </td>
                {isEditing && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>

        {isEditing && (
          <div className="mt-4">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Tambah Material
            </button>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan PM (opsional):
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Tambahkan catatan atau rekomendasi untuk customer..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleApproveClick}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
          disabled={isEditing}
        >
          ✅ SETUJU - Approve RAB
        </button>
        <button
          onClick={handleRejectClick}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          disabled={isEditing}
        >
          ❌ TOLAK - Reject RAB
        </button>
      </div>

      {isEditing && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800">
            ⚠️ Simpan atau batalkan perubahan material sebelum approve/reject
          </p>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Konfirmasi Persetujuan RAB</h3>
            <div className="mb-4 space-y-2">
              <p className="text-gray-700">
                Anda akan menyetujui RAB dengan total estimasi:
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(calculateTotal())}
              </p>
              <p className="text-sm text-gray-600">
                Jumlah material: {editedItems.length} item
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-sm text-blue-800">
                  ✓ Status akan berubah ke "Approved by PM"<br />
                  ✓ RAB final akan disimpan<br />
                  ✓ Proyek masuk daftar proyek aktif Anda
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmApprove}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Ya, Setujui
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Konfirmasi Penolakan RAB
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan: <span className="text-red-500">*</span>
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-3"
              >
                <option value="">Pilih alasan...</option>
                <option value="Data tidak lengkap">Data tidak lengkap</option>
                <option value="Material tidak sesuai realita">
                  Material tidak sesuai realita
                </option>
                <option value="Budget tidak realistis">
                  Budget tidak realistis
                </option>
                <option value="Lokasi proyek tidak memungkinkan">
                  Lokasi proyek tidak memungkinkan
                </option>
                <option value="Kapasitas PM sudah penuh">
                  Kapasitas PM sudah penuh
                </option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {rejectReason === "Lainnya" && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Jelaskan alasan penolakan..."
                />
              )}
              <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
                <p className="text-sm text-red-800">
                  ⚠️ Status akan berubah ke "Ditolak PM"<br />
                  ⚠️ Customer akan menerima notifikasi penolakan
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmReject}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Ya, Tolak
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RABReviewPanel;
