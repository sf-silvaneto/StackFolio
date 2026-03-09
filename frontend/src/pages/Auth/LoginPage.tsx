import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import logoImg from '../../assets/logo.png';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hack Anti-Autofill para evitar o fundo branco do navegador
  const [emailFieldName] = useState(`field_${Math.random().toString(36).substring(7)}`);
  const [passFieldName] = useState(`pass_${Math.random().toString(36).substring(7)}`);

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

  // ESTILOS IDÊNTICOS AOS DA PÁGINA DE REGISTRO
  const inputLabelStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '900', marginBottom: '6px', color: colors.textMuted, paddingLeft: '4px', textTransform: 'uppercase' as 'uppercase' };

  const inputContainerStyle = (errorCondition: boolean = false) => ({
    position: 'relative' as 'relative', width: '100%', height: '52px', marginBottom: '20px',
    border: `1px solid ${errorCondition ? '#ef4444' : colors.border}`,
    borderRadius: '12px', background: theme === 'light' ? '#f1f5f9' : '#1e293b',
    display: 'flex', alignItems: 'center', boxSizing: 'border-box' as 'border-box', overflow: 'visible',
    transition: 'border-color 0.2s'
  });

  const inputRawStyle = {
    flex: 1, height: '100%', padding: '0 14px 0 45px', background: 'transparent',
    border: 'none', color: colors.text, outline: 'none', fontSize: '14px', width: '100%',
  };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* HEADER / LOGO (Idêntico ao Registo) */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '0 40px', background: colors.card, height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="Logo" style={{ height: '45px', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer', padding: '10px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* FORMULÁRIO CENTRALIZADO */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="animate-in" style={{ 
          background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', 
          padding: '50px', width: '100%', maxWidth: '450px', boxShadow: '0 15px 50px rgba(0,0,0,0.06)' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px' }}>Bem-vindo de volta</h1>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>
              Acesse a sua conta para gerenciar o seu portfólio.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div>
              <span style={inputLabelStyle}>E-MAIL CADASTRADO</span>
              <div style={inputContainerStyle()}>
                <Mail size={18} color={colors.textMuted} style={{ position: 'absolute', left: '15px', zIndex: 1 }} />
                <input 
                  name={emailFieldName}
                  type="text" 
                  autoComplete="new-password"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                  placeholder="exemplo@gmail.com" 
                  style={inputRawStyle} 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: colors.textMuted, paddingLeft: '4px', textTransform: 'uppercase' }}>Senha</span>
                <Link to="/recuperar-senha" style={{ fontSize: '12px', color: colors.primary, textDecoration: 'none', fontWeight: '800' }}>Esqueceu a senha?</Link>
              </div>
              <div style={inputContainerStyle()}>
                <Lock size={18} color={colors.textMuted} style={{ position: 'absolute', left: '15px', zIndex: 1 }} />
                <input 
                  name={passFieldName}
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                  placeholder="••••••••" 
                  style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} 
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textMuted }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email || !password}
              style={{ 
                marginTop: '10px', padding: '18px', 
                background: (!email || !password || isLoading) ? colors.border : colors.primary, 
                color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px',
                cursor: (!email || !password || isLoading) ? 'not-allowed' : 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: (!email || !password || isLoading) ? 'none' : `0 8px 25px ${colors.primary}40`,
                transition: 'all 0.3s', opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <><LogIn size={20} /> Entrar na Conta</>}
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

      <style>{`
        .animate-in { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}