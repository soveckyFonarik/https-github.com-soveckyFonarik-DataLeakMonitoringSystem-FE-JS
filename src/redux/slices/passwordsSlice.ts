import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const API_URL = "http://localhost:3000/user-pass";

interface UserPassword {
  id: number;
  host: string;
  login: string;
  password: string;
  isLeaked: boolean;
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

// Загрузка всех паролей пользователя
export const fetchUserPasswords = createAsyncThunk<
  UserPassword[],
  void,
  { rejectValue: string; state: RootState }
>('passwords/fetchUserPasswords', async (idUser, { rejectWithValue, getState }) => {
  const state = getState();
  const token = state.auth.token; // достаем токен из authSlice
  try {
    const response = await fetch(`${API_URL}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Ошибка загрузки паролей');
    }

    const data = await response.json();

    const passwords: UserPassword[] = data.map((item: any) => ({
      id: item.id,
      host: item.host,
      login: item.login,
      password: item.hashPass,
      isLeaked: item.isLeaked,
    }));

    return passwords;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сети');
  }
});

// Добавление нового пароля
export const addUserPassword = createAsyncThunk<
  UserPassword,
  { host: string; login: string; password: string },
  { rejectValue: string; state: RootState }
>('passwords/addUserPassword', async (newPass, { rejectWithValue, getState }) => {
  try {
    const state = getState();
  const token = state.auth.token; // достаем токен из authSlice
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        host: newPass.host,
        login: newPass.login,
        hashPass: newPass.password, // отправляем как hashPass
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Ошибка при добавлении пароля');
    }

    const item = await response.json();

    return {
      id: item.id,
      host: item.host,
      login: item.login,
      password: item.hashPass,
      isLeaked: item.isLeaked,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сети');
  }
});

// Обновление пароля
export const updateUserPassword = createAsyncThunk<
  UserPassword,
  { id: number; host?: string; login?: string; password?: string; isLeaked?: boolean },
  { rejectValue: string ; state: RootState}
>('passwords/updateUserPassword', async (updateData, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const token = state.auth.token; // достаем токен из authSlice
    const { id, ...data } = updateData;

    // Преобразуем поле password в hashPass, если есть
    const bodyData: any = {};
    if (data.host !== undefined) bodyData.host = data.host;
    if (data.login !== undefined) bodyData.login = data.login;
    if (data.password !== undefined) bodyData.hashPass = data.password;
    if (data.isLeaked !== undefined) bodyData.isLeaked = data.isLeaked;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Ошибка при обновлении пароля');
    }

    const item = await response.json();

    return {
      id: item.id,
      host: item.host,
      login: item.login,
      password: item.hashPass,
      isLeaked: item.isLeaked,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сети');
  }
});

// Удаление пароля
export const deleteUserPassword = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>('passwords/deleteUserPassword', async (id, { rejectWithValue, getState }) => {
  const state = getState();
  const token = state.auth.token; // достаем токен из authSlice
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Ошибка при удалении пароля');
    }

    // Возвращаем id удалённого элемента
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка сети');
  }
});

const handlePending = (state: PasswordsState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: PasswordsState, action: any) => {
  state.loading = false;
  state.error = action.payload || 'Неизвестная ошибка';
};

const handleFulfilledFetch = (state: PasswordsState, action: PayloadAction<UserPassword[]>) => {
  state.loading = false;
  state.passwords = action.payload;
};

const handleFulfilledAdd = (state: PasswordsState, action: PayloadAction<UserPassword>) => {
  state.loading = false;
  state.passwords.push(action.payload);
};

const handleFulfilledUpdate = (state: PasswordsState, action: PayloadAction<UserPassword>) => {
  state.loading = false;
  const index = state.passwords.findIndex(p => p.id === action.payload.id);
  if (index !== -1) {
    state.passwords[index] = action.payload;
  }
};

const handleFulfilledDelete = (state: PasswordsState, action: PayloadAction<number>) => {
  state.loading = false;
  state.passwords = state.passwords.filter(p => p.id !== action.payload);
};

const passwordsSlice = createSlice({
  name: 'passwords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Загрузка
      .addCase(fetchUserPasswords.pending, handlePending)
      .addCase(fetchUserPasswords.fulfilled, handleFulfilledFetch)
      .addCase(fetchUserPasswords.rejected, handleRejected)

      // Добавление
      .addCase(addUserPassword.pending, handlePending)
      .addCase(addUserPassword.fulfilled, handleFulfilledAdd)
      .addCase(addUserPassword.rejected, handleRejected)

      // Обновление
      .addCase(updateUserPassword.pending, handlePending)
      .addCase(updateUserPassword.fulfilled, handleFulfilledUpdate)
      .addCase(updateUserPassword.rejected, handleRejected)

      // Удаление
      .addCase(deleteUserPassword.pending, handlePending)
      .addCase(deleteUserPassword.fulfilled, handleFulfilledDelete)
      .addCase(deleteUserPassword.rejected, handleRejected);
  },
});


export default passwordsSlice.reducer;
