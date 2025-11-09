// config.ts
import axios from 'axios';

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Access token йде автоматично через cookie
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Тільки response interceptor для обробки 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Якщо refresh endpoint дав 401 - редирект
    if (originalRequest.url === '/auth/refresh') {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Якщо вже йде refresh - чекаємо в черзі
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh токен йде автоматично через cookie
      await api.post('/auth/refresh');

      // Новий access token прийде в httpOnly cookie автоматично
      processQueue(null);

      // Повторюємо початковий запит (новий cookie вже встановлений)
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      window.location.href = '/sign-in';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
