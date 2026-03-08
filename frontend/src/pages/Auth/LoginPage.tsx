import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth() as any;
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Bem-vindo de volta!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login. Verifique as suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const inputBgColor = theme === 'light' ? '#f1f5f9' : '#1e293b';
  const cardStyle = { 
    background: colors.card, 
    border: `1px solid ${colors.border}`, 
    borderRadius: '24px', 
    padding: '40px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: '450px',
    animation: 'slideUp 0.5s ease-out'
  };

  const inputStyle = { 
    width: '100%', 
    padding: '14px 14px 14px 45px', 
    borderRadius: '12px', 
    border: `1px solid ${colors.border}`, 
    background: inputBgColor, 
    color: colors.text, 
    outline: 'none', 
    boxSizing: 'border-box' as 'border-box',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* HEADER / LOGO */}
      <header style={{ padding: '30px 40px', position: 'absolute', top: 0, left: 0 }}>
        <div 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ background: colors.primary, width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogIn size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: '900', fontSize: '22px', color: colors.primary, letterSpacing: '-1px' }}>
            Stack Folio
          </span>
        </div>
      </header>

      {/* BOTÃO DE TEMA (CANTO SUPERIOR DIREITO) */}
      <div style={{ position: 'absolute', top: '30px', right: '40px' }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', padding: '10px' }}>
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      {/* FORMULÁRIO CENTRALIZADO */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px' }}>Entrar</h1>
            <p style={{ color: colors.textMuted, fontWeight: '600', fontSize: '15px' }}>
              Aceda à sua conta para gerir o seu portfólio.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>E-mail</label>
              <Mail size={18} color={colors.textMuted} style={{ position: 'absolute', left: '15px', top: '41px', zInitialize: 2 }} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com" 
                style={inputStyle} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '800' }}>Palavra-passe</label>
                <Link to="/recuperar-senha" style={{ fontSize: '12px', color: colors.primary, textDecoration: 'none', fontWeight: '700' }}>Esqueceu-se?</Link>
              </div>
              <Lock size={18} color={colors.textMuted} style={{ position: 'absolute', left: '15px', top: '41px', zInitialize: 2 }} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={inputStyle} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '41px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textMuted }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                marginTop: '10px',
                padding: '16px', 
                background: colors.primary, 
                color: '#fff', 
                border: 'none', 
                borderRadius: '14px', 
                fontWeight: '900', 
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                boxShadow: `0 8px 25px ${colors.primary}40`,
                transition: 'transform 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isLoading ? 'A autenticar...' : <><LogIn size={20} /> Entrar na Conta</>}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: colors.textMuted, fontWeight: '600' }}>
              Ainda não tem conta?{' '}
              <Link to="/registrar" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '800' }}>
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER DIVISÃO LEGAL (IGUAL À HOME E PERFIL) */}
      <footer style={{ background: theme === 'light' ? '#f8fafc' : '#1a1a1a', color: colors.textMuted, padding: '3rem 1rem', display: 'flex', justifyContent: 'center', marginTop: 'auto', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', textAlign: 'center', fontWeight: '600' }}>
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: '600' }}>
            <Link to="/termos" style={{ color: colors.textMuted, textDecoration: 'none' }}>Termos de Serviço</Link>
            <Link to="/privacidade" style={{ color: colors.textMuted, textDecoration: 'none' }}>Política de Privacidade</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}