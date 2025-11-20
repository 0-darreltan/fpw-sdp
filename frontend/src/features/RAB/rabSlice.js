import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// Fetch all RABs
export const fetchRabs = createAsyncThunk("rab/fetchRabs", async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await api.get(`/rabs${queryParams ? `?${queryParams}` : ''}`);
  return res.data;
});

// Fetch RAB by ID
export const fetchRabById = createAsyncThunk("rab/fetchRabById", async (id) => {
  const res = await api.get(`/rabs/${id}`);
  return res.data;
});

// Customer: Create RAB request
export const createRABRequest = createAsyncThunk(
  "rab/createRABRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      const res = await api.post("/rabs/request", requestData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create RAB request"
      );
    }
  }
);

// PM: Assign RAB to self
export const assignRABToMe = createAsyncThunk(
  "rab/assignRABToMe",
  async (rabId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/rabs/${rabId}/assign`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign RAB"
      );
    }
  }
);

// PM: Send RAB quotation
export const sendRABQuotation = createAsyncThunk(
  "rab/sendRABQuotation",
  async ({ rabId, quotationData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/rabs/${rabId}/quotation`, quotationData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send quotation"
      );
    }
  }
);

// Customer: Accept RAB quotation
export const acceptRABQuotation = createAsyncThunk(
  "rab/acceptRABQuotation",
  async (rabId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/rabs/${rabId}/accept`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept quotation"
      );
    }
  }
);

// Customer: Reject RAB quotation
export const rejectRABQuotation = createAsyncThunk(
  "rab/rejectRABQuotation",
  async ({ rabId, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/rabs/${rabId}/reject`, { reason });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject quotation"
      );
    }
  }
);

const initialState = {
  listRabs: [],
  oneRab: {},
  loading: false,
  error: null,
};

const rabSlice = createSlice({
  name: "rab",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOneRab: (state) => {
      state.oneRab = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch RABs
      .addCase(fetchRabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRabs.fulfilled, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        state.listRabs = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchRabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch RABs";
        state.listRabs = [];
      })
      
      // Fetch RAB by ID
      .addCase(fetchRabById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRabById.fulfilled, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        state.oneRab = payload || {};
      })
      .addCase(fetchRabById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch RAB";
        state.oneRab = {};
      })
      
      // Create RAB Request
      .addCase(createRABRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRABRequest.fulfilled, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        if (payload) {
          state.listRabs.unshift(payload);
        }
      })
      .addCase(createRABRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create RAB request";
      })
      
      // Assign RAB
      .addCase(assignRABToMe.fulfilled, (state, action) => {
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        if (payload) {
          const index = state.listRabs.findIndex(r => r._id === payload._id);
          if (index !== -1) {
            state.listRabs[index] = payload;
          }
        }
      })
      
      // Send Quotation
      .addCase(sendRABQuotation.fulfilled, (state, action) => {
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        if (payload) {
          const index = state.listRabs.findIndex(r => r._id === payload._id);
          if (index !== -1) {
            state.listRabs[index] = payload;
          }
        }
      })
      
      // Accept/Reject Quotation
      .addCase(acceptRABQuotation.fulfilled, (state, action) => {
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        if (payload) {
          const index = state.listRabs.findIndex(r => r._id === payload._id);
          if (index !== -1) {
            state.listRabs[index] = payload;
          }
        }
      })
      .addCase(rejectRABQuotation.fulfilled, (state, action) => {
        let payload = action.payload;
        if (payload?.data) {
          payload = payload.data;
        }
        if (payload) {
          const index = state.listRabs.findIndex(r => r._id === payload._id);
          if (index !== -1) {
            state.listRabs[index] = payload;
          }
        }
      });
  },
});

export const { clearError, clearOneRab } = rabSlice.actions;

export const actionRab = {
  fetchRabs,
  fetchRabById,
  createRABRequest,
  assignRABToMe,
  sendRABQuotation,
  acceptRABQuotation,
  rejectRABQuotation,
  clearError,
  clearOneRab,
};

export default rabSlice.reducer;
