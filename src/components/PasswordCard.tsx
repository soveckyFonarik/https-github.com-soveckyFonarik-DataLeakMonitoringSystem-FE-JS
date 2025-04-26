import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Password {
  id: number;
  site: string;
  login: string;
  password: string;
  notes?: string;
}

interface PasswordCardProps {
  password: Password;
  onEdit: (password: Password) => void;
  onDelete: (password: Password) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({ password, onEdit, onDelete }) => {
  const { site, login, notes, id } = password;

  return (
    <Box
      key={id}
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 120 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Сайт
        </Typography>
        <Typography>{site}</Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 120 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Логин
        </Typography>
        <Typography
          sx={{
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}
        >
          {login}
        </Typography>
      </Box>

      {/* <Box sx={{ flex: 1, minWidth: 120 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Пароль
        </Typography>
        <Typography
          sx={{
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}
        >
          {pass}
        </Typography>
      </Box> */}

      <Box sx={{ flex: 1, minWidth: 120 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Примечания
        </Typography>
        <Typography>{notes || '-'}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" color="primary" size="small" onClick={() => onEdit(password)}>
          Редактировать
        </Button>
        <Button variant="outlined" color="error" size="small" onClick={() => onDelete(password)}>
          Удалить
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordCard;
