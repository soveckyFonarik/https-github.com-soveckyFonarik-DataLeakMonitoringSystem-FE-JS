import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../hooks';
import { addUserPassword, deleteUserPassword, fetchUserPasswords, updateUserPassword } from '../redux/slices/passwordsSlice';

import PasswordCard from '../components/PasswordCard';
import EditPasswordDialog from '../components/EditPasswordDialog';
import DeletePasswordDialog from '../components/DeletePasswordDialog';

interface Password {
  id: number;
  host: string;
  login: string;
  password: string;
  notes?: string;
}

const UserPass: React.FC = () => {
  const dispatch = useAppDispatch();
  const { passwords, loading, error } = useAppSelector((state) => state.pass);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState<Password | null>(null);

  useEffect(() => {
    dispatch(fetchUserPasswords());
  }, [dispatch]);

  const handleEditOpen = (pass: Password) => {
    setCurrentPass(pass);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentPass(null);
  };

  const handleDeleteOpen = (pass: Password) => {
    setCurrentPass(pass);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setCurrentPass(null);
  };

  const handleAddOpen = () => {
    setAddOpen(true);
    setCurrentPass(null); // сбрасываем выбранный пароль
  };
  
  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleAddSave = (data: { host: string; login: string; password: string; notes: string }) => {
    dispatch(addUserPassword(data));
  };

  const handleSave = (data: { host?: string; login: string; password: string; notes: string }) => {
    if (!currentPass) return;
    dispatch(updateUserPassword({
      id: currentPass.id, // добавляем id
      host: data.host,
      login: data.login,
      password: data.password,
      // isLeaked: currentPass.isLeaked, // если нужно
    }));
    setEditOpen(false);
  };

  //  const handleLogin = (data: { username: string; password: string }) => {
  //     dispatch(loginUser(data));
  //   };

  const handleDelete = () => {
    if (!currentPass) return;
    // TODO: dispatch delete action
    dispatch(deleteUserPassword(currentPass.id))
    // alert(`Удалить пароль с id: ${currentPass.id}`);
    setDeleteOpen(false);
  };

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

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Ваши пароли</Typography>
        <Button variant="contained" color="primary" onClick={handleAddOpen}>
          Добавить пароль
        </Button>
      </Box>

      {passwords.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          Пароли не найдены
        </Typography>
      ) : (
        <Box>
          {passwords.map((pass: Password) => (
            <PasswordCard
              key={pass.id}
              password={pass}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          ))}
        </Box>
      )}

      {currentPass && (
        <EditPasswordDialog
          open={editOpen}
          onClose={handleEditClose}
          onSave={handleSave}
          initialData={{
            host: currentPass.host,
            login: currentPass.login,
            password: currentPass.password,
            notes: currentPass.notes || '',
          }}
        />
      )}

      {currentPass && (
        <DeletePasswordDialog
          open={deleteOpen}
          onClose={handleDeleteClose}
          onDelete={handleDelete}
          siteName={currentPass.host}
        />
      )}

      {/* Диалог добавления */}
      <EditPasswordDialog
        open={addOpen}
        onClose={handleAddClose}
        onSave={handleAddSave}
        initialData={{
          host: '',
          login: '',
          password: '',
          notes: '',
        }}
      />
    </Box>
  );
};

export default UserPass;
