import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const response = await api.get("/projects");
  return response.data;
});

const fetchProjectById = createAsyncThunk("projects/fetchById", async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
});
const createProject = createAsyncThunk(
  "projects/create",
  async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
  }
);
const updateProject = createAsyncThunk("projects/update", async (data) => {
  const { id, ...projectData } = data;
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
});
const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  await api.delete(`/projects/${id}`);
  return id;
});

const initialState = {
  oneProject: {},
  listProjects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response format { success: true, data: [...] }
        state.listProjects = action.payload?.data || action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchProjectById - gunakan _id (ObjectId)
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response format { success: true, data: {...} }
        const project = action.payload?.data || action.payload?.result || action.payload;
        state.oneProject = project || {};
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // createProject
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response format { success: true, data: {...} }
        const created = action.payload?.data || action.payload?.result || action.payload;
        if (created) {
          state.listProjects.push(created);
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // updateProject - update berdasarkan _id (ObjectId)
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response format { success: true, data: {...} }
        const updated = action.payload?.data || action.payload?.result || action.payload;
        if (!updated || !updated._id) return;

        const updatedId = updated._id;

        // Update di listProjects
        state.listProjects = state.listProjects.map((project) =>
          project._id === updatedId ? updated : project
        );

        // Update oneProject jika sedang dilihat
        if (state.oneProject && state.oneProject._id === updatedId) {
          state.oneProject = updated;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // deleteProject - hapus berdasarkan _id (ObjectId)
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?._id ?? action.payload ?? null;
        if (!deletedId) return;

        // Hapus dari listProjects
        state.listProjects = state.listProjects.filter(
          (project) => project._id !== deletedId
        );

        // Clear oneProject jika yang dihapus sedang dilihat
        if (state.oneProject && state.oneProject._id === deletedId) {
          state.oneProject = {};
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const actionProject = {
  fetchProject: fetchProjects, // Alias for Dashboard compatibility
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectSlice.reducer;
