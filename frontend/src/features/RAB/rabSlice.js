import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const fetchRabs = createAsyncThunk("rab/fetchRabs", async () => {
  const res = await api.get("/rabs");
  return res.data;
});

const initialState = {
  listRabs: [],
  oneRab: {},
  loading: false,
  error: null,
};

const rabSlice = createSlice({
  name: "rab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRabs.fulfilled, (state, action) => {
        state.loading = false;
        state.listRabs = action.payload || [];
      })
      .addCase(fetchRabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch RABs";
      });
  },
});

export const actionRab = { fetchRabs };

export default rabSlice.reducer;
