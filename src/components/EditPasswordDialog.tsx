import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface EditPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { host: string; login: string; password: string; notes: string }) => void;
  initialData: {
    host: string;
    login: string;
    password: string;
    notes: string;
  };
}

const EditPasswordDialog: React.FC<EditPasswordDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать пароль</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="normal"
          label="Сайт"
          name="host"
          fullWidth
          value={formData.host}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Логин"
          name="login"
          fullWidth
          value={formData.login}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Пароль"
          name="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Примечания"
          name="notes"
          fullWidth
          multiline
          minRows={2}
          value={formData.notes}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPasswordDialog;
