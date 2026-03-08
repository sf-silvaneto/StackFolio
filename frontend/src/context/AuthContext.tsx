import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  displayName?: string;
  profileImg?: string;
  [key: string]: any; 
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<any>; // Alterado para receber objeto
  logout: () => Promise<void>;
  completeRegistration: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persistência: Carregar Token ao iniciar
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { sessionToken, user: userData } = response.data;
    
    localStorage.setItem('sessionToken', sessionToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
    setUser(userData);
  };

  const register = async (registerData: any) => {
    // Passo 1: Cria a conta e já loga o usuário para pegar o token
    const response = await api.post('/auth/register', registerData);
    
    // Se o seu backend já retornar login no registro, fazemos isto:
    if (response.data.sessionToken) {
        const { sessionToken, user: userData } = response.data;
        localStorage.setItem('sessionToken', sessionToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        setUser(userData);
    }
    return response.data;
  };

  const completeRegistration = async (data: any) => {
    try {
      // Garante que o token atual está nos headers para evitar 401
      const token = localStorage.getItem('sessionToken');
      const response = await api.patch('/users/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data); 
    } catch (error) {
      console.error("Erro no Patch Perfil:", error);
      throw error;
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('sessionToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, completeRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);