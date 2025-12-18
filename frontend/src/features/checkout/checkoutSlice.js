import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async thunk to initiate checkout via backend
export const initiateCheckout = createAsyncThunk(
  "checkout/initiateCheckout",
  async (payload, { rejectWithValue }) => {
    try {
      // Use centralized api instance which injects auth token and baseURL
      const res = await api.post("/checkout/initiate", payload);
      return res.data;
    } catch (err) {
      // Return a normalized error payload
      return rejectWithValue(
        err.response?.data || { message: err.message || "Network error" }
      );
    }
  }
);

// Async thunk to fetch checkout history
export const fetchCheckoutHistory = createAsyncThunk(
  "checkout/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/checkout/history");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Network error" }
      );
    }
  }
);

// Async thunk to update checkout status
export const updateCheckoutStatus = createAsyncThunk(
  "checkout/updateStatus",
  async ({ checkoutId, status, transactionId }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/checkout/status/${checkoutId}`, {
        status,
        transactionId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Network error" }
      );
    }
  }
);

// Async thunk to update delivery status
export const updateDeliveryStatus = createAsyncThunk(
  "checkout/updateDeliveryStatus",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/checkout/delivery/${checkoutId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Network error" }
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  data: null,
  history: [],
  historyLoading: false,
  historyError: null,
  updateLoading: false,
  updateError: null,
  deliveryUpdateLoading: false,
  deliveryUpdateError: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.loading = false;
        // backend returns { success, message, data: { token, checkoutId } }
        state.data = action.payload?.data || action.payload;
      })
      .addCase(initiateCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || action.payload || action.error;
      })
      // fetchCheckoutHistory
      .addCase(fetchCheckoutHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchCheckoutHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload?.data || [];
      })
      .addCase(fetchCheckoutHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload?.message || action.error?.message || "Failed to fetch history";
      })
      // updateCheckoutStatus
      .addCase(updateCheckoutStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCheckoutStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update checkout in history if exists
        const updatedCheckout = action.payload?.data;
        if (updatedCheckout) {
          const index = state.history.findIndex(c => c._id === updatedCheckout._id);
          if (index !== -1) {
            state.history[index] = updatedCheckout;
          }
        }
      })
      .addCase(updateCheckoutStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload?.message || action.error?.message || "Failed to update status";
      })
      // updateDeliveryStatus
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.deliveryUpdateLoading = true;
        state.deliveryUpdateError = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.deliveryUpdateLoading = false;
        // Update checkout in history if exists
        const updatedCheckout = action.payload?.data;
        if (updatedCheckout && updatedCheckout.checkoutId) {
          const index = state.history.findIndex(c => c._id === updatedCheckout.checkoutId);
          if (index !== -1) {
            state.history[index].delivery = updatedCheckout.currentStatus;
          }
        }
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.deliveryUpdateLoading = false;
        state.deliveryUpdateError = action.payload?.message || action.error?.message || "Failed to update delivery status";
      });
  },
});

export const { clearCheckoutState } = checkoutSlice.actions;

export default checkoutSlice.reducer;