import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

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
      const response = await api.post("/cart/items", itemData);
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
      const response = await api.delete(`/cart/items/${productId}`);
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
      const response = await api.delete("/cart");
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
      // Menangani semua state 'pending' secara umum
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Menangani semua state 'fulfilled' dari aksi cart
      // Pola ini sangat efisien karena backend kita selalu mengembalikan state keranjang yang utuh.
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          // API kita selalu mengembalikan { success: true, data: cartObject }
          // cartObject bisa null jika keranjang belum pernah dibuat
          state.items = action.payload.data?.items || [];
        }
      )
      // Menangani semua state 'rejected' secara umum
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
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
