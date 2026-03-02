import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const isComplete = await loginWithGoogle(credentialResponse.credential);
        
        if (isComplete) {
          navigate('/profile'); // Já tem conta. Direto pro App!
        } else {
          navigate('/complete-profile'); // Conta nova. Direto pro formulário!
        }
      } catch (error) {
        console.error("Falha ao processar login do Google", error);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Entrar no StackFolio</h2>
      <GoogleLogin 
        onSuccess={handleGoogleSuccess} 
        onError={() => console.log('Login Failed')} 
      />
    </div>
  );
}