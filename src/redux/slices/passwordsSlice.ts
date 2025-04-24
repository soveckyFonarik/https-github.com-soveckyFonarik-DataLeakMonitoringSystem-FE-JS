import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
const API_URL = "http://localhost:3000/user-pass";

interface UserPassword {
  id: number;
  site: string;
  login: string;
  password: string;
  notes?: string;
}

interface PasswordsState {
  passwords: UserPassword[];
  loading: boolean;
  error: string | null;
}

const initialState: PasswordsState = {
  passwords: [],
  loading: false,
  error: null,
};

// thunk для загрузки паролей
export const fetchUserPasswords = createAsyncThunk<
  UserPassword[],
  void,
  { rejectValue: string }>
  ('passwords/fetchUserPasswords', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch( `${API_URL}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.detail || 'Ошибка загрузки паролей');
    }

    const data: UserPassword[] = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сети');
  }
});

const passwordsSlice = createSlice({
  name: 'passwords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPasswords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPasswords.fulfilled, (state, action: PayloadAction<UserPassword[]>) => {
        state.loading = false;
        state.passwords = action.payload;
      })
      .addCase(fetchUserPasswords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export default passwordsSlice.reducer;
