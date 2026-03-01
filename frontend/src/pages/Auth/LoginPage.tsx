import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#121212' }}>
      <div style={{ padding: '40px', background: '#1e1e1e', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Login StackFolio</h2>
        <GoogleLogin
          onSuccess={async (res) => {
            if (res.credential) {
              await signInGoogle(res.credential);
              navigate('/'); // Volta para a home após logar
            }
          }}
          onError={() => alert('Erro ao autenticar com Google')}
          theme="filled_blue"
          shape="pill"
        />
      </div>
    </div>
  );
}