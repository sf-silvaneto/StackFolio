import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// App principal
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Apenas UM GoogleOAuthProvider na aplicação toda */}
    <GoogleOAuthProvider clientId="952392498435-c1bebtgqk4coukt5spdnf4c31rg7cppo.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);