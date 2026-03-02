import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextData {
  user: any;
  token: string | null;
  tempGoogleData: any;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  completeRegistration: (profileData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('@StackFolio:token'));
  
  // Estado intermediário para segurar os dados antes do cadastro final
  const [tempGoogleData, setTempGoogleData] = useState<any>(null);

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    const response = await api.post('/auth/google', { token: credential });

    if (response.data.complete) {
      // Usuário logado perfeitamente
      setToken(response.data.access_token);
      setUser(response.data.user);
      localStorage.setItem('@StackFolio:token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      return true; 
    } else {
      // Novo usuário, salva dados no tempGoogleData e retorna false
      setTempGoogleData(response.data.tempData);
      return false; 
    }
  };

  const completeRegistration = async (profileData: any) => {
    // Une o email/foto/nome do Google com os inputs que ele preencheu agora (bio, nickname...)
    const fullData = { ...tempGoogleData, ...profileData };
    const response = await api.post('/auth/register/complete', fullData);

    // Salva a sessão permanentemente
    setToken(response.data.access_token);
    setUser(response.data.user);
    setTempGoogleData(null); 
    
    localStorage.setItem('@StackFolio:token', response.data.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@StackFolio:token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, tempGoogleData, loginWithGoogle, completeRegistration, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);