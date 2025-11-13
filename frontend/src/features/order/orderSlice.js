import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const response = await api.get("/orders");
  return response.data;
});

const fetchOrderById = createAsyncThunk("order/fetchOrderById", async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
});

const createOrder = createAsyncThunk("order/createOrder", async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
});

const updateOrder = createAsyncThunk("order/updateOrder", async (orderData) => {
  const id = orderData._id || orderData.id;
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
});

const deleteOrder = createAsyncThunk("order/deleteOrder", async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
});

const initialState = {
  oneOrder: {},
  listOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.result || action.payload;
        state.listOrders = payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to fetch orders";
      })

      // fetchOrderById (gunakan _id)
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.result || action.payload;
        state.oneOrder = payload || {};
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to fetch order";
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.result || action.payload;
        if (created) {
          state.listOrders.unshift(created);
          state.oneOrder = created;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to create order";
      })

      // updateOrder (cocokkan dan update berdasarkan _id)
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.result || action.payload || {};
        const id = updated._id || null;
        if (id) {
          const idx = state.listOrders.findIndex((o) => o._id === id);
          if (idx !== -1) state.listOrders[idx] = updated;
          if (state.oneOrder && state.oneOrder._id === id) {
            state.oneOrder = updated;
          }
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to update order";
      })

      // deleteOrder (hapus berdasarkan _id)
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        // prefer payload._id, fallback ke payload (string id) atau thunk arg
        const payload = action.payload?.result || action.payload;
        const deletedId = payload?._id ?? payload ?? null;
        if (deletedId) {
          state.listOrders = state.listOrders.filter(
            (o) => o._id !== deletedId
          );
          if (state.oneOrder && state.oneOrder._id === deletedId) {
            state.oneOrder = {};
          }
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to delete order";
      }),
});

export const actionOrder = {
  fetchOrder: fetchOrders, // Alias for Dashboard compatibility
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};

export default orderSlice.reducer;
