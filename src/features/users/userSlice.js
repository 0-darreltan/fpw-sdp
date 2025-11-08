import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await api.get("/users");
  return response.data;
});

const fetchUserById = createAsyncThunk("users/fetchUserById", async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
});

const createUser = createAsyncThunk("users/createUser", async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
});

const updateUser = createAsyncThunk("users/updateUser", async (userData) => {
  const response = await api.put(`/users/${userData.id}`, userData);
  return response.data;
});

const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
});

const LoginUser = createAsyncThunk(
  "users/LoginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", data);
      return response.data;
    } catch (err) {
      // kembalikan message dari server atau err.message untuk debugging
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const LogOutUser = createAsyncThunk("users/LogOutUser", async () => {
  await api.post("users/logout");
});

const RegisterUser = createAsyncThunk("users/RegisterUser", async (data) => {
  const response = await api.post("users/register", data);
  return response.data;
});

const initialState = {
  currUsers: null,
  oneUsers: {},
  listUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchusers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fechUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUsers = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.result || action.payload;
        if (!updated) return;
        const updatedId = updated._id;

        state.listUsers = state.listUsers.map((user) =>
          user._id === updatedId ? updated : user
        );
        if (state.oneUsers && state.oneUsers._id === updatedId) {
          state.oneUsers = updated;
        }
        if (state.currUsers && state.currUsers._id === updatedId) {
          state.currUsers = updated;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?._id ?? action.payload ?? null;
        if (!deletedId) return;
        // filter by _id only (you use ObjectId)
        state.listUsers = state.listUsers.filter(
          (user) => user._id !== deletedId
        );
        if (state.currUsers && state.currUsers._id === deletedId) {
          state.currUsers = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // LoginUser
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currUsers = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // LogOutUser
      .addCase(LogOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LogOutUser.fulfilled, (state) => {
        state.loading = false;
        state.currUsers = null;
      })
      .addCase(LogOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // RegisterUser
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers.push(action.payload);
        state.currentUser = action.payload;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const actionUser = {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  LoginUser,
  LogOutUser,
  RegisterUser,
};

export default userSlice.reducer;
