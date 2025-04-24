import React, { useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUserPasswords } from '../redux/slices/passwordsSlice';

const UserPass: React.FC = () => {
  const dispatch = useAppDispatch();
  const { passwords, loading, error } = useAppSelector((state) => state.pass);

  useEffect(() => {
    dispatch(fetchUserPasswords());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (passwords.length === 0) {
    return (
      <Typography variant="h6" mt={4} align="center">
        Пароли не найдены
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Ваши пароли
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Сайт</TableCell>
            <TableCell>Логин</TableCell>
            <TableCell>Пароль</TableCell>
            <TableCell>Примечания</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passwords.map(({ id, site, login, password, notes }) => (
            <TableRow key={id}>
              <TableCell>{site}</TableCell>
              <TableCell>{login}</TableCell>
              <TableCell>{password}</TableCell>
              <TableCell>{notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserPass;
