import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { CompleteProfilePage } from './pages/Auth/CompleteProfilePage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { PrivacyPage } from './pages/Legal/PrivacyPage';
import { TermsPage } from './pages/Legal/TermsPage';
import { Toaster } from 'react-hot-toast';

// Componente inteligente para proteger rotas privadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth() as any;
  
  if (!token) {
    // Se não houver token, redireciona para a home
    return <Navigate to="/" replace />; 
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <>
      {/* Configuração global do Toaster para os popups de erro e acerto */}
      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      <Router>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />

          {/* --- ROTAS PRIVADAS (Protegidas por ProtectedRoute) --- */}
          
          {/* Completar perfil após o login */}
          <Route 
            path="/completar-perfil" 
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Painel de Configurações */}
          <Route 
            path="/configuracoes" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Edição de perfil */}
          <Route 
            path="/perfil/editar" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* --- FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}