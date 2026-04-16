import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { apiClient, refreshApiClient, updateToken } from '../api/client';
import { useApp } from '../context/AppContext';

const Login = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loadProfile, loadChats } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.authLoginPost({
        phone: phone,
        password: password,
      });

      if (response.data && response.data.token) {
        // Сохраняем токен и обновляем клиент
        updateToken(response.data.token);
        refreshApiClient();
        
        // Загружаем профиль и чаты
        await loadProfile();
        await loadChats();
        
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(
        err.response?.data?.error?.message || 
        err.message || 
        'Ошибка входа. Проверьте телефон и пароль.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h6" component="h2" align="center" gutterBottom>
        Вход в систему
      </Typography>

      <form onSubmit={handleLogin} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            fullWidth
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
            placeholder="Введите пароль"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" disabled={loading} fullWidth size="large">
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Login;

