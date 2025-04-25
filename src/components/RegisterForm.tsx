import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress } from '@mui/material';

interface IRegisterInput {
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: SubmitHandler<IRegisterInput>;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegisterInput>();

  const password = watch('password', '');

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

      <TextField
        label="Подтвердите пароль"
        type="password"
        fullWidth
        margin="normal"
        {...register('confirmPassword', {
          required: 'Подтвердите пароль',
          validate: value =>
            value === password || 'Пароли не совпадают',
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
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
        Зарегистрироваться
      </Button>
    </Box>
  );
};

export default RegisterForm;
