import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, Lock, Sun, Moon, ArrowRight, Eye, EyeOff, AlertTriangle,
  User, Cake, Phone, Briefcase, MapPin, X, Terminal, Search, Cpu, Plus, CheckCircle, Smartphone, MessageCircle, Loader2, UserCircle, Ban
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api'; 
import logoImg from '../../assets/logo.png'; 

const SkillIcon = ({ slug, size, isActive, fallbackColor }: any) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const map: Record<string, string> = {
      'arduino': 'arduino', 'esp32': 'espressif', 'python': 'python', 
      'react': 'react', 'node.js': 'nodedotjs', 'typescript': 'typescript'
    };
    return map[s.toLowerCase()] || s.toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color={isActive ? '#fff' : fallbackColor} />;
  return (
    <img 
      src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${finalSlug}.svg`} 
      style={{ width: size, height: size, filter: isActive ? 'brightness(0) invert(1)' : 'none' }} 
      alt={slug} onError={() => setError(true)} 
    />
  );
};

const TECH_ROLES = ["Engenheiro de Software", "Desenvolvedor Fullstack", "Dev IoT & Robotics", "DevOps Engineer"];
const SUGGESTED_SKILLS = ["React", "Node.js", "Python", "Arduino", "ESP32", "C++", "TypeScript", "SQL"];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [emailFieldName] = useState(`field_${Math.random().toString(36).substring(7)}`);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);

  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);

  const [smsSent, setSmsSent] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [isSmsVerified, setIsSmsVerified] = useState(false);
  const [isValidatingSms, setIsValidatingSms] = useState(false);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    username: '', displayName: '', fullName: '', 
    birthDate: '', phone: '', role: '', bio: '', 
    location: '', tools: [] as string[]
  });

  const isAdult = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email.includes('@') && formData.email.endsWith('.com')) {
        setIsEmailChecking(true);
        try {
          const response = await api.get(`/auth/check-email?email=${formData.email}`);
          setIsEmailAvailable(response.data.available);
        } catch (error) { setIsEmailAvailable(true); }
        finally { setIsEmailChecking(false); }
      } else { setIsEmailAvailable(null); }
    };
    const timer = setTimeout(checkEmail, 800);
    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 5) {
        setIsUsernameChecking(true);
        try {
          const response = await api.get(`/auth/check-username?username=${formData.username}`);
          setIsUsernameAvailable(response.data.available);
        } catch (error) { setIsUsernameAvailable(true); }
        finally { setIsUsernameChecking(false); }
      } else { setIsUsernameAvailable(null); }
    };
    const timer = setTimeout(checkUsername, 800);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleSendSms = async () => {
    if (formData.phone.length < 15) return;
    setIsSendingSms(true);
    try {
      await api.post('/auth/send-sms', { phone: formData.phone });
      setSmsSent(true);
      toast.success("Código enviado!");
    } catch (error) {
      toast.error("Erro ao enviar SMS.");
    } finally {
      setIsSendingSms(false);
    }
  };

  useEffect(() => {
    const verifyCode = async () => {
      if (smsCode.length === 6) {
        setIsValidatingSms(true);
        try {
          const response = await api.post('/auth/verify-sms', { phone: formData.phone, code: smsCode });
          setIsSmsVerified(response.data.valid);
        } catch (error) { setIsSmsVerified(false); }
        finally { setIsValidatingSms(false); }
      }
    };
    verifyCode();
  }, [smsCode, formData.phone]);

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    if (numbers.length > 0) formatted += '(' + numbers.substring(0, 2);
    if (numbers.length >= 3) formatted += ') ' + numbers.substring(2, 7);
    if (numbers.length >= 8) formatted += '-' + numbers.substring(7, 11);
    if (numbers.length <= 11) {
      setFormData({ ...formData, phone: formatted });
      setSmsSent(false); setSmsCode(''); setIsSmsVerified(false);
    }
  };

  const handleNameFilter = (value: string, field: 'fullName' | 'displayName') => {
    if (field === 'displayName') {
      // Regra Rigorosa: sem espaço no início e APENAS 1 espaço permitido entre nomes
      const cleanValue = value
        .replace(/[^a-zA-Z0-9À-ÿ\s]/g, '') // Remove caracteres especiais
        .replace(/^\s+/, '') // Impede espaços no início
        .replace(/\s{2,}/g, ' '); // Converte múltiplos espaços em apenas um
      setFormData({ ...formData, displayName: cleanValue });
    } else {
      const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
      setFormData({ ...formData, fullName: cleanValue });
    }
  };

  const isEmailValid = formData.email.includes('@') && formData.email.endsWith('.com');
  const isPasswordStrong = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /\d/.test(formData.password) && /[!@#$%^&*]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const isStep1Valid = isEmailValid && isPasswordStrong && passwordsMatch && isEmailAvailable === true;

  const isStep2Valid = 
    formData.username.length >= 5 && isUsernameAvailable === true && 
    formData.displayName.length >= 5 && formData.fullName.length >= 15 && 
    isSmsVerified && isAdult(formData.birthDate);

  const calculateProgress = () => {
    let score = 0;
    if (isStep1Valid) score += 20;
    if (formData.username.length >= 5 && isUsernameAvailable === true) score += 20;
    if (formData.displayName.length >= 5 && formData.fullName.length >= 15) score += 20;
    if (isSmsVerified) score += 20;
    if (formData.location) score += 20;
    return Math.min(score, 100);
  };

  const inputLabelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '900', marginBottom: '6px', color: colors.textMuted, paddingLeft: '4px'
  };

  const inputContainerStyle = (errorCondition: boolean, isCritical: boolean = false) => ({
    position: 'relative' as 'relative', width: '100%', height: '52px', marginBottom: '15px',
    border: `1px solid ${isCritical || errorCondition ? '#ef4444' : colors.border}`,
    borderRadius: '12px', background: theme === 'light' ? '#f1f5f9' : '#1e293b',
    display: 'flex', alignItems: 'center', boxSizing: 'border-box' as 'border-box', overflow: 'visible'
  });

  const inputRawStyle = {
    flex: 1, height: '100%', padding: '0 14px 0 45px', background: 'transparent',
    border: 'none', color: colors.text, outline: 'none', fontSize: '14px', width: '100%',
  };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '0 40px', background: colors.card, height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate('/')}><img src={logoImg} alt="Logo" style={{ height: '45px', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} /></div>
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

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '50px', width: '100%', maxWidth: '620px', boxShadow: '0 15px 50px rgba(0,0,0,0.06)' }}>
          
          {step === 1 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '30px' }}>Criar Conta</h2>
              <span style={inputLabelStyle}>E-MAIL</span>
              <div style={inputContainerStyle(formData.email.length > 0 && !isEmailValid, isEmailAvailable === false)}>
                <Mail size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                <input 
                  name={emailFieldName} type="text" maxLength={40} autoComplete="one-time-code"
                  onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }}
                  placeholder="exemplo@gmail.com" style={inputRawStyle} value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().replace(/[^a-z0-9@._-]/gi, '')})} 
                />
                <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isEmailChecking && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                  {isEmailAvailable === true && !isEmailChecking && <CheckCircle size={18} color="#10b981" />}
                  {isEmailAvailable === false && <div className="tooltip-container" style={{ color: '#ef4444', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>E-mail em uso</div></div>}
                  {formData.email.length > 0 && !isEmailValid && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Deve conter @ e .com</div></div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <span style={inputLabelStyle}>SENHA</span>
                  <div style={inputContainerStyle(!isPasswordStrong && formData.password.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input 
                      type={showPass ? "text" : "password"} maxLength={20} autoComplete="new-password" 
                      onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }}
                      placeholder="" style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }}
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value.replace(/\s/g, '')})}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!isPasswordStrong && formData.password.length > 0 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Requer: 8+ chars, maiúscula, nº e símbolo</div></div>}
                      <button onClick={() => setShowPass(!showPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>CONFIRMAR SENHA</span>
                  <div style={inputContainerStyle(!passwordsMatch && formData.confirmPassword.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input 
                      type={showConfirmPass ? "text" : "password"} maxLength={20} autoComplete="new-password" 
                      onPaste={(e) => { e.preventDefault(); toast.error("Confirme manualmente."); }}
                      placeholder="" style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }}
                      value={formData.confirmPassword} 
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value.replace(/\s/g, '')})}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!passwordsMatch && formData.confirmPassword.length > 0 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Senhas diferentes</div></div>}
                      <button onClick={() => setShowConfirmPass(!showConfirmPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>{showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                disabled={!isStep1Valid} onClick={() => setStep(2)}
                onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)}
                style={{ width: '100%', padding: '20px', background: isStep1Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: isStep1Valid ? 'pointer' : 'not-allowed', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>Próximo Passo</span> 
                {!isStep1Valid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px' }}>Identidade</h2>
              
              <span style={inputLabelStyle}>LINK DO PERFIL</span>
              <div style={inputContainerStyle(formData.username.length > 0 && formData.username.length < 5, isUsernameAvailable === false)}>
                <div style={{ position: 'absolute', left: '15px', color: colors.textMuted, fontSize: '14px', fontWeight: '700', zIndex: 1 }}>stackfolio.com/</div>
                <input 
                  maxLength={15} placeholder="usuario" 
                  style={{ ...inputRawStyle, paddingLeft: '110px' }}
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} 
                />
                <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUsernameChecking && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                  {isUsernameAvailable === true && !isUsernameChecking && <CheckCircle size={18} color="#10b981" />}
                  {isUsernameAvailable === false && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Link já existe</div></div>}
                  {formData.username.length > 0 && formData.username.length < 5 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Mínimo 5 caracteres</div></div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '5px' }}>
                <div>
                  <span style={inputLabelStyle}>NOME DE EXIBIÇÃO</span>
                  <div style={inputContainerStyle(formData.displayName.length > 0 && formData.displayName.length < 5)}>
                    <UserCircle size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={15} placeholder="Ex: Silva Neto" style={inputRawStyle} value={formData.displayName} onChange={e => handleNameFilter(e.target.value, 'displayName')} />
                    {formData.displayName.length > 0 && formData.displayName.length < 5 && (
                      <div className="tooltip-container" style={{ position: 'absolute', right: '15px', color: '#f59e0b', display: 'flex' }}>
                        <AlertTriangle size={18} /><div className="tooltip-box">Mínimo 5 caracteres</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>NOME E SOBRENOME</span>
                  <div style={inputContainerStyle(formData.fullName.length > 0 && formData.fullName.length < 15)}>
                    <User size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={60} placeholder="Ex: Silvestre Fernandes" style={inputRawStyle} value={formData.fullName} onChange={e => handleNameFilter(e.target.value, 'fullName')} />
                    {formData.fullName.length > 0 && formData.fullName.length < 15 && (
                      <div className="tooltip-container" style={{ position: 'absolute', right: '15px', color: '#f59e0b', display: 'flex' }}>
                        <AlertTriangle size={18} /><div className="tooltip-box">Mínimo 15 caracteres</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <span style={inputLabelStyle}>DATA DE NASCIMENTO</span>
                  <div style={inputContainerStyle(formData.birthDate !== '' && !isAdult(formData.birthDate))}>
                    <Cake size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input type="date" style={inputRawStyle} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                    {formData.birthDate !== '' && !isAdult(formData.birthDate) && (
                      <div className="tooltip-container" style={{ position: 'absolute', right: '40px', color: '#f59e0b', display: 'flex', zIndex: 2 }}>
                        <AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Precisa ter 18+ anos</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>TELEFONE</span>
                  <div style={{ ...inputContainerStyle(formData.phone.length > 0 && formData.phone.length < 15), paddingRight: '8px' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input placeholder="(00) 00000-0000" style={inputRawStyle} value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} />
                    {!isSmsVerified && (
                      <button onClick={handleSendSms} disabled={isSendingSms || formData.phone.length < 15} style={{ background: formData.phone.length < 15 ? colors.border : colors.primary, border: 'none', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '10px', fontWeight: '800', cursor: formData.phone.length < 15 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isSendingSms ? <Loader2 size={12} className="animate-spin" /> : smsSent ? "Reenviar" : "SMS"}
                      </button>
                    )}
                    {isSmsVerified && <CheckCircle size={18} color="#10b981" style={{ marginRight: '5px' }} />}
                  </div>
                  <div onClick={() => setIsWhatsApp(!isWhatsApp)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', cursor: 'pointer', padding: '0 4px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} color={isWhatsApp ? '#10b981' : colors.textMuted} /><span style={{ fontSize: '12px', fontWeight: '800', color: isWhatsApp ? '#10b981' : colors.textMuted }}>WhatsApp</span></div><div style={{ width: '34px', height: '18px', background: isWhatsApp ? '#10b981' : colors.border, borderRadius: '20px', position: 'relative', transition: '0.3s' }}><div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: isWhatsApp ? '19px' : '3px', transition: '0.3s' }} /></div></div>
                </div>
              </div>
              {smsSent && (
                <div style={inputContainerStyle(smsCode.length === 6 && !isSmsVerified)}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                  <input maxLength={6} placeholder="Código de 6 dígitos" style={inputRawStyle} value={smsCode} onChange={e => setSmsCode(e.target.value.replace(/\D/g, ''))} />
                  <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isValidatingSms && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                    {isSmsVerified ? <CheckCircle size={18} color="#10b981" /> : smsCode.length === 6 && <AlertTriangle size={18} color="#f59e0b" />}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: 'pointer' }}>Voltar</button>
                <button 
                  disabled={!isStep2Valid} onClick={() => setStep(3)}
                  onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)}
                  style={{ flex: 1, padding: '18px', background: isStep2Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isStep2Valid ? 'pointer' : 'not-allowed' }}
                >
                  <span>Continuar</span>
                  {!isStep2Valid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '30px' }}>Perfil e Stack</h2>
              <span style={inputLabelStyle}>CARGO</span>
              <div style={inputContainerStyle(false)}><Briefcase size={18} style={{ position: 'absolute', left: '15px' }} /><input list="roles" placeholder="Engenheiro de Software..." style={inputRawStyle} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} /><datalist id="roles">{TECH_ROLES.map(r => <option key={r} value={r}/>)}</datalist></div>
              <span style={inputLabelStyle}>LOCALIZAÇÃO</span>
              <div style={{ position: 'relative', marginBottom: '20px' }}><MapPin size={18} style={{ position: 'absolute', left: '15px', top: '16px' }} /><input placeholder="Pesquisar Cidade..." style={{...inputRawStyle, border: `1px solid ${colors.border}`, borderRadius: '12px', width: '100%'}} value={formData.location || citySearch} onChange={e => {setCitySearch(e.target.value); setFormData({...formData, location: ''})}} /></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px', padding: '15px', background: theme === 'light' ? '#f8fafc' : '#1e293b', borderRadius: '12px' }}>
                {formData.tools.map(t => <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: colors.primary, color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}><SkillIcon slug={t} size={14} isActive /> {t}<X size={12} style={{ cursor: 'pointer' }} onClick={() => setFormData({...formData, tools: formData.tools.filter(s => s !== t)})} /></div>)}
                {SUGGESTED_SKILLS.filter(s => !formData.tools.includes(s)).slice(0, 4).map(s => <button key={s} onClick={() => setFormData({...formData, tools: [...formData.tools, s]})} style={{ border: `1px solid ${colors.border}`, background: 'none', color: colors.text, padding: '6px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>+ {s}</button>)}
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setStep(2)} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: 'pointer' }}>Voltar</button>
                <button onClick={() => toast.success("Perfil pronto!")} style={{ flex: 1, padding: '18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900' }}>Lançar Perfil</button>
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