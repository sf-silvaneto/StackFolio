import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Anexa o token automaticamente em todas as chamadas ao banco
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});