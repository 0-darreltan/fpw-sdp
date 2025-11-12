import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Thunk untuk request token ke backend
export const createTransaction = createAsyncThunk(
  "payment/createTransaction",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment/create-transaction", orderData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  loading: false,
  token: null,
  error: null,
};
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
