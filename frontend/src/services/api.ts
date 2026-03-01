import axios from 'axios';

// Cria a instância do Axios apontando para o seu Backend (NestJS)
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de qualquer requisição sair do Frontend, ele verifica se existe um token.
// Se existir, ele anexa o token no cabeçalho para provar pro Backend que você está logado.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});