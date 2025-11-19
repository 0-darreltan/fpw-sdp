import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async thunk untuk fetch activities
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activities?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activities"
      );
    }
  }
);

// Async thunk untuk fetch activity stats
export const fetchActivityStats = createAsyncThunk(
  "activity/fetchActivityStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/activities/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity stats"
      );
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    listActivities: [],
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.listActivities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch activity stats
      .addCase(fetchActivityStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchActivityStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = activitySlice.actions;

export const activityActions = {
  fetchActivities,
  fetchActivityStats,
  clearError,
};

export default activitySlice.reducer;
