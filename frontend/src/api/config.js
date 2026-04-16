import { Configuration } from './configuration.ts';
import axios from 'axios';

// Функция для получения токена (всегда берет актуальное значение из localStorage)
const getToken = () => {
  return localStorage.getItem('token');
};

// Настраиваем axios interceptor для автоматической подстановки токена в заголовки
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Создаем конфигурацию с вашим сервером
// Используем функцию для получения токена, чтобы он всегда был актуальным
const apiConfig = new Configuration({
  // Важно: `namico.ru` сейчас отдаёт некорректный SSL (ERR_CERT_COMMON_NAME_INVALID).
  // Используем `www` по умолчанию, а при необходимости можно переопределить через .env: REACT_APP_API_BASE_URL
  basePath: (process.env.REACT_APP_API_BASE_URL || 'https://www.namico.ru/api/v1'), // Базовый URL вашего API
  accessToken: getToken, // Передаем функцию, чтобы токен всегда брался актуальный
});

// Функция для обновления токена
export const updateToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    // Обновляем токен в конфигурации
    apiConfig.accessToken = token;
  } else {
    localStorage.removeItem('token');
    apiConfig.accessToken = undefined;
  }
};

export default apiConfig;

