import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, 
});

// Interceptor para logs de erro (opcional, ajuda no debug)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Erro 401: Token ausente ou sessão expirada no servidor.');
    }
    return Promise.reject(error);
  }
);

export default api;