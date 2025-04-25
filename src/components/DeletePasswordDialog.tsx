import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

interface DeletePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  siteName: string;
}

const DeletePasswordDialog: React.FC<DeletePasswordDialogProps> = ({
  open,
  onClose,
  onDelete,
  siteName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Подтвердите удаление</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Вы действительно хотите удалить пароль для сайта <strong>{siteName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePasswordDialog;
