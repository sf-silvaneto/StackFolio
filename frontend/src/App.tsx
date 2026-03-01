import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage'; 
import { LoginPage } from './pages/Auth/LoginPage'; 
// src/App.tsx
import { ProfilePage } from './pages/Profile/ProfilePage'; // Adicione as chaves { }
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rota dinâmica para o Perfil: stackfolio.com/username */}
          <Route path="/:username" element={<ProfilePage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;