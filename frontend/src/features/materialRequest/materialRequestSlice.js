import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchMaterialRequests = createAsyncThunk(
  "materialRequest/fetchAll",
  async () => {
    const response = await api.get("/material-requests");
    return response.data;
  }
);

const fetchMaterialRequestById = createAsyncThunk(
  "materialRequest/fetchById",
  async (id) => {
    const response = await api.get(`/material-requests/${id}`);
    return response.data;
  }
);

const createMaterialRequest = createAsyncThunk(
  "materialRequest/create",
  async (requestData) => {
    const response = await api.post("/material-requests", requestData);
    return response.data;
  }
);

const updateMaterialRequest = createAsyncThunk(
  "materialRequest/update",
  async (data) => {
    const { id, ...requestData } = data;
    const response = await api.put(`/material-requests/${id}`, requestData);
    return response.data;
  }
);

const deleteMaterialRequest = createAsyncThunk(
  "materialRequest/delete",
  async (id) => {
    await api.delete(`/material-requests/${id}`);
    return id;
  }
);

const initialState = {
  oneMaterialRequest: {},
  listMaterialRequests: [],
  loading: false,
  error: null,
};

const materialRequestSlice = createSlice({
  name: "materialRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMaterialRequests
      .addCase(fetchMaterialRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialRequests.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data || action.payload;
        state.listMaterialRequests = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchMaterialRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchMaterialRequestById
      .addCase(fetchMaterialRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.oneMaterialRequest = action.payload?.data || action.payload;
      })
      .addCase(fetchMaterialRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createMaterialRequest
      .addCase(createMaterialRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaterialRequest.fulfilled, (state, action) => {
        state.loading = false;
        const newRequest = action.payload?.data || action.payload;
        state.listMaterialRequests.unshift(newRequest);
      })
      .addCase(createMaterialRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateMaterialRequest
      .addCase(updateMaterialRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaterialRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data || action.payload;
        const updatedId = updated._id || updated.id;
        state.listMaterialRequests = state.listMaterialRequests.map((req) =>
          (req._id || req.id) === updatedId ? updated : req
        );
        if (
          state.oneMaterialRequest &&
          (state.oneMaterialRequest._id || state.oneMaterialRequest.id) ===
            updatedId
        ) {
          state.oneMaterialRequest = updated;
        }
      })
      .addCase(updateMaterialRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteMaterialRequest
      .addCase(deleteMaterialRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterialRequest.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.listMaterialRequests = state.listMaterialRequests.filter(
          (req) => (req._id || req.id) !== deletedId
        );
      })
      .addCase(deleteMaterialRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const actionMaterialRequest = {
  fetchMaterialRequests,
  fetchMaterialRequestById,
  createMaterialRequest,
  updateMaterialRequest,
  deleteMaterialRequest,
};

export default materialRequestSlice.reducer;
