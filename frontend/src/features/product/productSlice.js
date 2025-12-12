import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchProduct = createAsyncThunk("product/fetch", async () => {
  const response = await api.get(`/products`);
  return response.data;
});

const fetchProductById = createAsyncThunk("product/fetchById", async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
});

const createProduct = createAsyncThunk(
  "product/create",
  async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  }
);

const updateProduct = createAsyncThunk(
  "product/update",
  async (productData) => {
    const id = productData._id || productData.id;

    // Remove _id and id from body, hanya kirim di URL
    const { _id, ...bodyData } = productData;
    if (bodyData.id) delete bodyData.id;

    const response = await api.put(`/products/${id}`, bodyData);
    return response.data;
  }
);

const deleteProduct = createAsyncThunk("product/delete", async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
});

const fetchInventoryReport = createAsyncThunk(
  "product/fetchInventoryReport",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.lowStock) params.append("lowStock", filters.lowStock);

    const response = await api.get(`/products/inventory-report?${params}`);
    return response.data;
  }
);

const fetchLowStockReport = createAsyncThunk(
  "product/fetchLowStockReport",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.threshold) params.append("threshold", filters.threshold);
    if (filters.category) params.append("category", filters.category);

    const response = await api.get(`/products/low-stock-report?${params}`);
    return response.data;
  }
);

const initialState = {
  oneProduct: {},
  listProducts: [],
  inventoryReport: null,
  lowStockReport: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProduct
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.listProducts = action.payload?.data ?? [];
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchProductById - gunakan _id (ObjectId)
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload?.result || action.payload;
        state.oneProduct = product || {};
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.result || action.payload;
        state.listProducts.push(created);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // updateProduct - update berdasarkan _id (ObjectId)
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.result || action.payload;
        if (!updated || !updated._id) return;

        const updatedId = updated._id;

        // Update di listProducts
        state.listProducts = state.listProducts.map((product) =>
          product._id === updatedId ? updated : product
        );

        // Update oneProduct jika sedang dilihat
        if (state.oneProduct && state.oneProduct._id === updatedId) {
          state.oneProduct = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // deleteProduct - hapus berdasarkan _id (ObjectId)
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Backend bisa return ID yang dihapus atau object produk
        const deletedId = action.meta?.arg ?? action.payload?._id ?? null;
        if (!deletedId) return;

        // Hapus dari listProducts
        state.listProducts = state.listProducts.filter(
          (product) => product._id !== deletedId
        );

        // Clear oneProduct jika yang dihapus sedang dilihat
        if (state.oneProduct && state.oneProduct._id === deletedId) {
          state.oneProduct = {};
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchInventoryReport
      .addCase(fetchInventoryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryReport = action.payload?.data || action.payload || null;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.inventoryReport = null;
      })

      // fetchLowStockReport
      .addCase(fetchLowStockReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockReport.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockReport = action.payload?.data || action.payload || null;
      })
      .addCase(fetchLowStockReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.lowStockReport = null;
      });
  },
});

export const actionProduct = {
  fetchProduct,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchInventoryReport,
  fetchLowStockReport,
};
export default productSlice.reducer;
