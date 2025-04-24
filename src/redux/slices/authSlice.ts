// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const API_URL = "http://localhost:3000/auth";

export const loginUser = createAsyncThunk<
  { token: string; user: { id: number; username: string } },
  { username: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("login", username);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString() ,
        // body: JSON.stringify({login: username, password})
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || "Ошибка авторизации");
      }

      const data = await response.json();
      return data; // ожидаем {token, user}
    } catch (error: any) {
      return rejectWithValue(error?.message || "Ошибка сети");
    }
  }
);

export const registerUser = createAsyncThunk<
  { token: string; user: { id: number; username: string } },
  { username: string; password: string },
  { rejectValue: string }
>(
  "auth/registerUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password }), // исправлено с login на username
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || "Ошибка регистрации");
      }

      const data = await response.json();
      return data; // ожидаем {token, user}
    } catch (error: any) {
      return rejectWithValue(error?.message || "Ошибка сети");
    }
  }
);

interface User {
  id: number | null;
  username: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // добавлено поле token
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Добавляем типизацию для builder
const addAsyncThunkHandlers = (
  builder: any,
  asyncThunk: any
) => {
  builder
    .addCase(asyncThunk.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      asyncThunk.fulfilled,
      (state: AuthState, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      }
    )
    .addCase(asyncThunk.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || "Ошибка";
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
        state.user = action.payload;
      },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkHandlers(builder, loginUser);
    addAsyncThunkHandlers(builder, registerUser);
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
