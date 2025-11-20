import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ✅ Helper function to transform cart items from backend format
const transformCartItems = (items) => {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map((item) => {
    // Handle populated productId (object) vs non-populated (string)
    const product = item.productId;
    
    if (typeof product === "object" && product !== null) {
      // Populated - extract data from product object
      return {
        productId: product._id || product.id,
        productName: product.name || "",
        price: product.price || 0,
        unit: product.unit || "",
        image: product.image || "",
        quantity: item.quantity || 0,
      };
    } else {
      // Not populated - product is just an ID string
      // This shouldn't happen normally, but handle gracefully
      return {
        productId: product,
        productName: "Unknown Product",
        price: 0,
        unit: "",
        image: "",
        quantity: item.quantity || 0,
      };
    }
  });
};

// THUNKS (Aksi Asinkron)

export const fetchCart = createAsyncThunk(
  "cart/fetch-cart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      // API mengembalikan: { success: true, data: { items: [...] } }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Menggabungkan 'add' dan 'update' karena backend menangani keduanya (upsert)
export const upsertItemInCart = createAsyncThunk(
  "cart/upsert-item",
  async (itemData, { rejectWithValue }) => {
    // itemData = { productId, quantity }
    try {
      const response = await api.post("/cart", itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/delete-item",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear-cart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/cart/clear/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// INITIAL STATE
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// SLICE DEFINITION
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Reducer sinkron bisa ditambahkan di sini jika perlu
    // Contoh: membersihkan error secara manual
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const rawItems = action.payload.data?.items || [];
        state.items = transformCartItems(rawItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
        state.items = [];
      })
      
      // upsertItemInCart
      .addCase(upsertItemInCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upsertItemInCart.fulfilled, (state, action) => {
        state.loading = false;
        const rawItems = action.payload.data?.items || [];
        state.items = transformCartItems(rawItems);
      })
      .addCase(upsertItemInCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
      })
      
      // deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const rawItems = action.payload.data?.items || [];
        state.items = transformCartItems(rawItems);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete item";
      })
      
      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to clear cart";
      });
  },
});

// Ekspor aksi sinkron
export const actionCart = {
  fetchCart,
  upsertItemInCart,
  deleteCartItem,
  clearCart,
  ...cartSlice.actions,
};

// Ekspor reducer
export default cartSlice.reducer;
