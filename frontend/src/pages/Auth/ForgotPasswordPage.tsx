import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, Lock, Sun, Moon, ArrowRight, Eye, EyeOff, AlertTriangle, 
  Loader2, Ban, AtSign, CheckCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';
import logoImg from '../../assets/logo.png';

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  // Hack para bloquear o preenchimento automático (Autofill) do navegador
  const [emailFieldName] = useState(`field_${Math.random().toString(36).substring(7)}`);
  const [codeFieldName] = useState(`code_${Math.random().toString(36).substring(7)}`);

  const [isHoveringNext, setIsHoveringNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Validações
  const isEmailValid = email.includes('@') && email.endsWith('.com');
  const isPasswordStrong = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[!@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const calculateProgress = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    if (step === 3) return 100;
    return 0;
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Se o e-mail existir, um código foi enviado!');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-email-code', { email, code });
      if (response.data.valid) {
        toast.success('Código validado com sucesso!');
        setStep(3);
      } else {
        toast.error('Código inválido ou expirado.');
      }
    } catch (error) {
      toast.error('Erro ao validar código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      toast.success('Senha atualizada com sucesso! Faça login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar senha.');
    } finally {
      setIsLoading(false);
    }
  };

  // ESTILOS IGUAIS AOS DA PÁGINA DE REGISTRO
  const inputLabelStyle = { display: 'block', fontSize: '10px', fontWeight: '900', marginBottom: '6px', color: colors.textMuted, paddingLeft: '4px', textTransform: 'uppercase' as 'uppercase' };
  
  const inputContainerStyle = (errorCondition: boolean) => ({
    position: 'relative' as 'relative', width: '100%', height: '52px', marginBottom: '15px',
    border: `1px solid ${errorCondition ? '#ef4444' : colors.border}`,
    borderRadius: '12px', background: theme === 'light' ? '#f1f5f9' : '#1e293b',
    display: 'flex', alignItems: 'center', boxSizing: 'border-box' as 'border-box', overflow: 'visible'
  });

  const inputRawStyle = {
    flex: 1, height: '100%', padding: '0 14px 0 45px', background: 'transparent',
    border: 'none', color: colors.text, outline: 'none', fontSize: '14px', width: '100%',
  };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* CABEÇALHO IDÊNTICO AO REGISTRO */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '0 40px', background: colors.card, height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate('/login')}>
          <img src={logoImg} alt="Logo" style={{ height: '45px', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '240px', height: '8px', background: colors.border, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${calculateProgress()}%`, height: '100%', background: '#10b981', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer', padding: '10px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* CONTAINER CENTRAL */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '50px', width: '100%', maxWidth: '660px', boxShadow: '0 15px 50px rgba(0,0,0,0.06)' }}>
          
          {/* PASSO 1: E-MAIL */}
          {step === 1 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '8px' }}>Recuperar Conta</h2>
              <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '30px' }}>Insira o seu e-mail cadastrado. Enviaremos um código para redefinir a sua senha de forma segura.</p>
              
              <span style={inputLabelStyle}>E-MAIL CADASTRADO</span>
              <div style={inputContainerStyle(email.length > 0 && !isEmailValid)}>
                <Mail size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                <input 
                  name={emailFieldName} /* Hack do autofill */
                  type="text"           /* Modificado para text + new-password */
                  autoComplete="new-password"
                  maxLength={40}
                  placeholder="exemplo@gmail.com" 
                  style={inputRawStyle} 
                  value={email} 
                  onChange={e => setEmail(e.target.value.toLowerCase().trim())} 
                  disabled={isLoading}
                />
                <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center' }}>
                  {email.length > 0 && !isEmailValid && (
                    <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex', pointerEvents: 'auto' }}>
                      <AlertTriangle size={18} />
                      <div className="tooltip-box">Deve conter @ e .com</div>
                    </div>
                  )}
                  {isEmailValid && <CheckCircle size={18} color="#10b981" />}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button onClick={() => navigate('/login')} disabled={isLoading} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, transition: 'all 0.2s' }}>
                  Voltar
                </button>
                <button 
                  disabled={!isEmailValid || isLoading} onClick={handleSendCode}
                  onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)}
                  style={{ flex: 1, padding: '18px', background: isEmailValid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isEmailValid ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Enviar Código</span> {!isEmailValid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}</>}
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: CÓDIGO */}
          {step === 2 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '8px' }}>Verifique o E-mail</h2>
              <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '30px' }}>Enviamos um código de segurança de 6 dígitos para o e-mail <strong>{email}</strong>.</p>
              
              <span style={inputLabelStyle}>CÓDIGO DE 6 DÍGITOS</span>
              <div style={inputContainerStyle(code.length > 0 && code.length < 6)}>
                <AtSign size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                <input 
                  name={codeFieldName} /* Hack do autofill */
                  autoComplete="one-time-code"
                  type="text" 
                  maxLength={6} 
                  placeholder="000000" 
                  style={{ ...inputRawStyle, letterSpacing: '4px', fontSize: '18px', fontWeight: '700' }} 
                  value={code} 
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))} 
                  disabled={isLoading}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button onClick={() => setStep(1)} disabled={isLoading} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, transition: 'all 0.2s' }}>
                  Voltar
                </button>
                <button 
                  disabled={code.length !== 6 || isLoading} onClick={handleVerifyCode}
                  onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)}
                  style={{ flex: 1, padding: '18px', background: code.length === 6 ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: code.length === 6 ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Validar Código</span> {code.length !== 6 && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}</>}
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: NOVA SENHA */}
          {step === 3 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '8px' }}>Nova Senha</h2>
              <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '30px' }}>Quase lá! Crie uma senha forte e lembre-se de a guardar num local seguro.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                <div>
                  <span style={inputLabelStyle}>NOVA SENHA</span>
                  <div style={inputContainerStyle(!isPasswordStrong && newPassword.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input 
                      type={showPass ? "text" : "password"} 
                      maxLength={20} 
                      autoComplete="new-password"
                      placeholder="" 
                      style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value.replace(/\s/g, ''))} 
                      onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }}
                      disabled={isLoading}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!isPasswordStrong && newPassword.length > 0 && (
                        <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}>
                          <AlertTriangle size={18} />
                          <div className="tooltip-box">Requer: 8+ chars, maiúscula, nº e símbolo</div>
                        </div>
                      )}
                      <button onClick={() => setShowPass(!showPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={inputLabelStyle}>CONFIRMAR SENHA</span>
                  <div style={inputContainerStyle(!passwordsMatch && confirmPassword.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      maxLength={20} 
                      autoComplete="new-password"
                      placeholder="" 
                      style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value.replace(/\s/g, ''))} 
                      onPaste={(e) => { e.preventDefault(); toast.error("Confirme manualmente."); }}
                      disabled={isLoading}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!passwordsMatch && confirmPassword.length > 0 && (
                        <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}>
                          <AlertTriangle size={18} />
                          <div className="tooltip-box">Senhas diferentes</div>
                        </div>
                      )}
                      <button onClick={() => setShowConfirmPass(!showConfirmPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                        {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => setStep(2)} disabled={isLoading} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, transition: 'all 0.2s' }}>
                  Voltar
                </button>
                <button 
                  disabled={!isPasswordStrong || !passwordsMatch || isLoading} onClick={handleResetPassword}
                  onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)}
                  style={{ flex: 1, padding: '18px', background: (isPasswordStrong && passwordsMatch) ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: (isPasswordStrong && passwordsMatch) ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Salvar e Entrar</span> {(!isPasswordStrong || !passwordsMatch) && isHoveringNext ? <Ban size={18} /> : <CheckCircle size={18} />}</>}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <style>{`
        .tooltip-container { position: relative; }
        .tooltip-box { visibility: hidden; width: 180px; background-color: #334155; color: #fff; text-align: center; border-radius: 8px; padding: 10px; position: absolute; z-index: 100; bottom: 130%; right: 0; opacity: 0; transition: opacity 0.3s; font-size: 11px; font-weight: 600; line-height: 1.4; }
        .tooltip-container:hover .tooltip-box { visibility: visible; opacity: 1; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}