import React, { useState } from 'react';
import { Typography, Box, Alert, Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser, registerUser } from '../redux/slices/authSlice';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = (data: { username: string; password: string }) => {
    dispatch(loginUser(data));
  };

  const handleRegister = (data: { username: string; password: string; confirmPassword: string }) => {
    dispatch(registerUser({ username: data.username, password: data.password }));
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      p={3}
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h5" mb={2} align="center">
        {isRegister ? 'Регистрация' : 'Вход'}
      </Typography>

      {isAuthenticated && user && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Привет, {user.username}! Вы успешно авторизованы.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isRegister ? (
        <RegisterForm onSubmit={handleRegister} loading={loading} />
      ) : (
        <LoginForm onSubmit={handleLogin} loading={loading} />
      )}

      <Box mt={2} textAlign="center">
        <Link
          component="button"
          variant="body2"
          onClick={() => setIsRegister(!isRegister)}
          disabled={loading}
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </Link>
      </Box>
    </Box>
  );
};

export default AuthForm;
