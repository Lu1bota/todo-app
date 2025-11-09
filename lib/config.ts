import axios from 'axios';

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
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

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === '/auth/refresh') {
      window.location.href = '/sign-in';
      return Promise.reject(error);
    }

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
      await api.post('/auth/refresh');

      processQueue(null);

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
