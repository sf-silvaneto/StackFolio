import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Importação essencial para a proteção
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { CompleteProfilePage } from './pages/Auth/CompleteProfilePage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { PrivacyPage } from './pages/Legal/PrivacyPage';
import { TermsPage } from './pages/Legal/TermsPage';

// Componente inteligente para proteger rotas privadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth() as any;
  
  if (!token) {
    // Se não houver token, redireciona para a home ou login
    return <Navigate to="/" replace />; 
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/completar-perfil" element={<CompleteProfilePage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="/:username" element={<ProfilePage />} />

        {/* --- ROTAS LEGAIS --- */}
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />

        {/* --- ROTAS PRIVADAS (Apenas usuários logados) --- */}
        <Route 
          path="/perfil/editar" 
          element={
            <ProtectedRoute>
              {/* Aqui você pode usar a mesma ProfilePage ou uma específica de edição */}
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* --- FALLBACK --- */}
        {/* Redireciona qualquer URL inexistente de volta para a Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}