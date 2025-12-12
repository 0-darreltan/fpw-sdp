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

const fetchSalesReport = createAsyncThunk(
  "order/fetchSalesReport",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.orderType) params.append("orderType", filters.orderType);
    if (filters.status) params.append("status", filters.status);

    const response = await api.get(`/orders/sales-report?${params}`);
    return response.data;
  }
);

const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.orderType) params.append("orderType", filters.orderType);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await api.get(`/orders/my-orders?${params}`);
    return response.data;
  }
);

const fetchOutgoingInventory = createAsyncThunk(
  "order/fetchOutgoingInventory",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.orderType) params.append("orderType", filters.orderType);

    const response = await api.get(`/orders/outgoing-inventory?${params}`);
    return response.data;
  }
);

const fetchCustomerLoyalty = createAsyncThunk(
  "order/fetchCustomerLoyalty",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/orders/customer-loyalty?${params}`);
    return response.data;
  }
);

const fetchProfitReport = createAsyncThunk(
  "order/fetchProfitReport",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.orderType) params.append("orderType", filters.orderType);

    const response = await api.get(`/orders/profit-report?${params}`);
    return response.data;
  }
);

const fetchTrendAnalysis = createAsyncThunk(
  "order/fetchTrendAnalysis",
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.groupBy) params.append("groupBy", filters.groupBy);

    const response = await api.get(`/orders/trend-analysis?${params}`);
    return response.data;
  }
);

const initialState = {
  oneOrder: {},
  listOrders: [],
  myOrders: [],
  salesReport: null,
  outgoingInventory: null,
  customerLoyalty: null,
  profitReport: null,
  trendReport: null,
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
        // Handle different response structures
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        } else if (payload?.result) {
          payload = payload.result;
        }
        // Ensure payload is always an array
        state.listOrders = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to fetch orders";
        state.listOrders = []; // Reset to empty array on error
      })

      // fetchOrderById (gunakan _id)
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        } else if (payload?.result) {
          payload = payload.result;
        }
        state.oneOrder = payload || {};
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || action.payload || "Failed to fetch order";
        state.oneOrder = {}; // Reset to empty object on error
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
      })

      // fetchSalesReport
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload?.data || action.payload || null;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch sales report";
        state.salesReport = null;
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        state.myOrders = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch order history";
        state.myOrders = [];
      })

      // fetchOutgoingInventory
      .addCase(fetchOutgoingInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutgoingInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.outgoingInventory =
          action.payload?.data || action.payload || null;
      })
      .addCase(fetchOutgoingInventory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch outgoing inventory";
        state.outgoingInventory = null;
      })

      // fetchCustomerLoyalty
      .addCase(fetchCustomerLoyalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerLoyalty.fulfilled, (state, action) => {
        state.loading = false;
        state.customerLoyalty = action.payload?.data || action.payload || null;
      })
      .addCase(fetchCustomerLoyalty.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch customer loyalty report";
        state.customerLoyalty = null;
      })

      // fetchProfitReport
      .addCase(fetchProfitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.profitReport = action.payload?.data || action.payload || null;
      })
      .addCase(fetchProfitReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch profit report";
        state.profitReport = null;
      })

      // fetchTrendAnalysis
      .addCase(fetchTrendAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.trendReport = action.payload?.data || action.payload || null;
      })
      .addCase(fetchTrendAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message ||
          action.payload ||
          "Failed to fetch trend analysis";
        state.trendReport = null;
      }),
});

export const actionOrder = {
  fetchOrder: fetchOrders, // Alias for Dashboard compatibility
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchSalesReport,
  fetchMyOrders,
  fetchOutgoingInventory,
  fetchCustomerLoyalty,
  fetchProfitReport,
  fetchTrendAnalysis,
};

export default orderSlice.reducer;
