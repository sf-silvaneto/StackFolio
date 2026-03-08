import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  // ISTO É CRUCIAL: diz ao axios para enviar os cookies de sessão!
  withCredentials: true, 
});