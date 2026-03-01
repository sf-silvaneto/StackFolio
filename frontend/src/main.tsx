import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // O CSS finalmente sendo chamado!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Contextos
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Páginas
import App from './App';
import { HomePage } from './pages/Home/HomePage';
import { TermsPage } from './pages/Legal/TermsPage';
import { PrivacyPage } from './pages/Legal/PrivacyPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { signed } = useAuth();
  return signed ? <>{children}</> : <Navigate to="/" />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="952392498435-c1bebtgqk4coukt5spdnf4c31rg7cppo.apps.googleusercontent.com">
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/termos" element={<TermsPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/dashboard" element={<PrivateRoute><App /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);