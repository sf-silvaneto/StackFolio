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
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  completeRegistration: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // O withCredentials: true na api.ts enviará o cookie automaticamente
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
  };

  const register = async (registerData: any) => {
    const response = await api.post('/auth/register', registerData);
    return response.data;
  };

  const completeRegistration = async (data: any) => {
    try {
      // Chamada simplificada: o Guard no Back lerá o cookie 'session_token'
      const response = await api.patch('/users/profile', data);
      setUser(response.data); 
    } catch (error) {
      console.error("Erro no Patch Perfil:", error);
      throw error;
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, completeRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);