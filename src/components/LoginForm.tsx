import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress } from '@mui/material';

interface ILoginInput {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<ILoginInput>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        Войти
      </Button>
    </Box>
  );
};

export default LoginForm;
