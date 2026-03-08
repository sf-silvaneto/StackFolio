import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage'; 
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { PrivacyPage } from './pages/Legal/PrivacyPage';
import { TermsPage } from './pages/Legal/TermsPage';
import { Toaster } from 'react-hot-toast';

// Guardião para rotas que exigem login (Configurações, Editar Perfil)
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
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} /> {/* Rota traduzida */}
          <Route path="/:username" element={<ProfilePage />} />
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

          {/* --- FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}