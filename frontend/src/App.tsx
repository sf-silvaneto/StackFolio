import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage'; 
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage'; // <-- Adicionado
import ProfilePage from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { PrivacyPage } from './pages/Legal/PrivacyPage';
import { TermsPage } from './pages/Legal/TermsPage';
import { Toaster } from 'react-hot-toast';

// Guardião para rotas que exigem login
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth() as any;
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">A carregar...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />; 
  }
  
  return <>{children}</>;
};

// Se o utilizador já estiver logado e tentar aceder a rotas de Auth, manda para a Home
const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth() as any;
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{ 
          duration: 3000, 
          style: { background: '#333', color: '#fff', borderRadius: '12px' } 
        }} 
      />

      <Router>
        <Routes>
          {/* --- ROTAS PÚBLICAS (ESTÁTICAS) --- */}
          <Route path="/" element={<HomePage />} />
          
          {/* Proteção para não deixar utilizadores logados acederem ao login/registo novamente */}
          <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />
          <Route path="/registrar" element={<RequireGuest><RegisterPage /></RequireGuest>} /> 
          <Route path="/recuperar-senha" element={<RequireGuest><ForgotPasswordPage /></RequireGuest>} /> {/* <-- Adicionado */}
          
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />

          {/* --- ROTAS PRIVADAS --- */}
          <Route 
            path="/configuracoes" 
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/perfil/editar" 
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } 
          />

          {/* --- ROTAS DINÂMICAS (CURINGA) --- */}
          <Route path="/:username" element={<ProfilePage />} />

          {/* --- FALLBACK (404) --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}