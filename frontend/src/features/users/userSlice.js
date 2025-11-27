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

const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const updateUser = createAsyncThunk("users/updateUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${userData.id}`, userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const LoginUser = createAsyncThunk(
  "users/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", { username, password });
      const { token, user } = res.data;

      // ✅ simpan token & set axios header
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { token, user };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const LogOutUser = createAsyncThunk("users/LogOutUser", async () => {
  await api.post("/users/logout");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
  return null;
});

const RegisterUser = createAsyncThunk(
  "users/RegisterUser",
  async (data, { rejectWithValue }) => {
    try {
      // ✅ tambahkan default role jika tidak ada
      const payload = {
        ...data,
        role: data.role || "Customer", // default role Customer
      };
      const response = await api.post("/users/register", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  currUsers: null,
  token: "",
  loggedInUser: {},
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
        const updated =
          action.payload?.user || action.payload?.result || action.payload;
        if (!updated) return;
        const updatedId = updated._id || updated.id;

        // Update di list users
        state.listUsers = state.listUsers.map((user) =>
          (user._id || user.id) === updatedId ? updated : user
        );

        // Update oneUsers jika sedang melihat detail user yang diupdate
        if (
          state.oneUsers &&
          (state.oneUsers._id || state.oneUsers.id) === updatedId
        ) {
          state.oneUsers = updated;
        }

        // HANYA update currUsers jika yang diupdate adalah user yang sedang login
        // Cek ID dari user yang sedang login vs ID user yang diupdate
        const currentLoggedInUserId =
          state.currUsers?.user?.id || state.currUsers?.user?._id;
        if (currentLoggedInUserId === updatedId) {
          // Ini adalah self-update, update currUsers
          state.currUsers = {
            ...state.currUsers,
            user: updated,
          };
          sessionStorage.setItem("user", JSON.stringify(updated));
        }
        // Jika tidak sama, JANGAN update currUsers (admin tetap sebagai admin)
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
        state.currUsers = { user: action.payload.user };
        state.token = action.payload.token;
        state.loggedInUser = action.payload.user;
        console.log({ "Current User": action.payload.user });
        console.log({ "Current Token": action.payload.token });
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
  fetchUser: fetchUsers,
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
