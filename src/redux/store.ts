import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import passwordReducer from './slices/passwordsSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pass : passwordReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
