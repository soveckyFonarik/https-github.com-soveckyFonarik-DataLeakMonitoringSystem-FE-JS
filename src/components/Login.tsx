import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser, registerUser } from '../redux/slices/authSlice';

import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';

interface IFormInput {
  username: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (isRegister) {
      if (data.password !== data.confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      dispatch(registerUser({ username: data.username, password: data.password }));
    } else {
      dispatch(loginUser({ username: data.username, password: data.password }));
    }
    reset();
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      p={3}
      borderRadius={2}
      boxShadow={3}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" mb={2} align="center">
        {isRegister ? 'Регистрация' : 'Вход'}
      </Typography>

      {isAuthenticated && user ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Привет, {user.username}! Вы успешно авторизованы.
        </Alert>
      ) : null}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Имя пользователя"
        fullWidth
        margin="normal"
        {...register('username', { required: 'Введите имя пользователя' })}
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={loading}
      />

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register('password', { required: 'Введите пароль' })}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={loading}
      />

      {isRegister && (
        <TextField
          label="Подтвердите пароль"
          type="password"
          fullWidth
          margin="normal"
          {...register('confirmPassword', { required: 'Подтвердите пароль' })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={loading}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {isRegister ? 'Зарегистрироваться' : 'Войти'}
      </Button>

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
