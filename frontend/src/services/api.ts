import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Crucial para enviar os cookies de sessão automaticamente
});

export default api;