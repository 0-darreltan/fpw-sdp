import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchProposals = createAsyncThunk("proposal/fetchProposals", async () => {
  const response = await api.get("/proposals");
  return response.data;
});

const fetchProposalById = createAsyncThunk(
  "proposal/fetchProposalById",
  async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  }
);

const createProposal = createAsyncThunk(
  "proposal/createProposal",
  async (proposalData) => {
    const response = await api.post("/proposals", proposalData);
    return response.data;
  }
);
const updateProposal = createAsyncThunk(
  "proposal/updateProposal",
  async (proposalData) => {
    const id = proposalData._id || proposalData.id;
    const response = await api.put(`/proposals/${id}`, proposalData);
    return response.data;
  }
);
const deleteProposal = createAsyncThunk(
  "proposal/deleteProposal",
  async (id) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
  }
);

const initialState = {
  oneProposal: {},
  listProposals: [],
  loading: false,
  error: null,
};

const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProposals
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.listProposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProposalById
      .addCase(fetchProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.loading = false;
        const proposal = action.payload?.result || action.payload;
        state.oneProposal = proposal || {};
      })
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createProposal
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.result || action.payload;
        state.listProposals.push(created);
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateProposal
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.result || action.payload;
        if (!updated) return;
        const updatedId = updated._id;

        state.listProposals = state.listProposals.map((proposal) =>
          proposal._id === updatedId ? updated : proposal
        );
        if (state.oneProposal && state.oneProposal._id === updatedId) {
          state.oneProposal = updated;
        }
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteProposal
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?._id ?? action.payload ?? null;
        if (!deletedId) return;

        state.listProposals = state.listProposals.filter(
          (proposal) => proposal._id !== deletedId
        );
        if (state.oneProposal && state.oneProposal._id === deletedId) {
          state.oneProposal = {};
        }
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const actionProposal = {
  fetchProposals,
  fetchProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
};

export default proposalSlice.reducer;
