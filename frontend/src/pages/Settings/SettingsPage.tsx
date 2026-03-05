import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import toast from 'react-hot-toast'; // Agora funcionará após o passo 1
import { 
  Lock, Bell, Trash2, Shield, Download, Mail, Phone, Eye, 
  MessageCircle, Briefcase, User, Sun, Moon, ChevronDown, 
  LogOut, Save, UserMinus, Github, Linkedin, Link as LinkIcon,
  CheckCircle, XCircle 
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export function SettingsPage() {
  const { user, logout, updateUser } = useAuth() as any; 
  const { theme, colors } = useTheme() as any;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    fullName: user?.name || '',
    nickname: '',
    customLink: '',
    phone: '',
    isWhatsApp: false, 
    email: user?.email || '',
    altEmail: '',
    primaryEmailChoice: 'google', 
    github: '',
    linkedin: ''
  });

  const [toggles, setToggles] = useState({
    publicEmail: true,
    profileVisibility: true,
    showLocation: true,
    showSocial: true
  });

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`).then((response) => {
        const dbUser = response.data;
        setPersonalForm({
          fullName: dbUser.name || user.name || '',
          nickname: dbUser.nickname || '',
          customLink: dbUser.customLink || '',
          phone: dbUser.phone || '',
          isWhatsApp: dbUser.isWhatsApp || false,
          email: dbUser.email || user.email || '',
          altEmail: dbUser.altEmail || '',
          primaryEmailChoice: dbUser.primaryEmailChoice || 'google',
          github: dbUser.github || '',
          linkedin: dbUser.linkedin || ''
        });
        setToggles({
          publicEmail: dbUser.publicEmail ?? true,
          profileVisibility: dbUser.profileVisibility ?? true,
          showLocation: dbUser.showLocation ?? true,
          showSocial: dbUser.showSocial ?? true
        });
      }).catch(err => {
        console.error(err);
        toast.error("Erro ao carregar dados.");
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;
    if (name === 'phone') {
      let v = value.replace(/\D/g, ''); 
      if (v.startsWith('55')) v = v.substring(2); 
      v = v.substring(0, 11); 
      if (v.length > 0) {
        value = '+55 ';
        if (v.length > 0) value += `(${v.substring(0, 2)}`;
        if (v.length >= 3) value += `) ${v.substring(2, 7)}`;
        if (v.length >= 8) value += `-${v.substring(7, 11)}`;
      } else { value = ''; }
    }
    setPersonalForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleToggle = (name: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }

    if (personalForm.altEmail && !personalForm.altEmail.includes('@')) {
      toast.error('E-mail alternativo inválido.');
      return;
    }
    
    setIsLoading(true);
    try {
      const updatePayload = {
        name: personalForm.fullName,
        nickname: personalForm.nickname,
        customLink: personalForm.customLink,
        phone: personalForm.phone,
        isWhatsApp: personalForm.isWhatsApp,
        altEmail: personalForm.altEmail,
        primaryEmailChoice: personalForm.primaryEmailChoice,
        github: personalForm.github,
        linkedin: personalForm.linkedin,
        ...toggles 
      };

      const response = await api.patch(`/users/${user?.id}`, updatePayload);
      if (updateUser) updateUser(response.data); 
      
      // PADRÃO DE SUCESSO
      toast.success('Alterações salvas com sucesso!');

    } catch (error) {
      // PADRÃO DE ERRO IGUAL AO DE SALVAMENTO
      toast.error('Erro ao guardar alterações.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isValidAltEmail = personalForm.altEmail && personalForm.altEmail.includes('@');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ color: colors.text, fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Informações Pessoais</h3>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>Atualize os seus dados básicos e links de contacto.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>Nome Completo</label>
                <input 
                  type="text" 
                  name="fullName"
                  maxLength={30}
                  value={personalForm.fullName}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>Apelido / Nome Curto</label>
                <input 
                  type="text" 
                  name="nickname"
                  maxLength={15}
                  value={personalForm.nickname}
                  onChange={handleInputChange}
                  placeholder="Como quer ser chamado?"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text, outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>Link do Perfil (URL Customizada)</label>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: colors.background }}>
                <span style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.03)', color: colors.textMuted, borderRight: `1px solid ${colors.border}`, fontSize: '14px' }}>stackfolio.com/</span>
                <input 
                  type="text" 
                  name="customLink"
                  maxLength={15}
                  value={personalForm.customLink}
                  onChange={handleInputChange}
                  placeholder="seulink"
                  style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'transparent', color: colors.text, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ padding: '20px', border: `1px solid ${colors.border}`, borderRadius: '12px', backgroundColor: colors.surface }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: colors.text }}>Configuração de E-mail</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>E-mail do Google (Conta)</label>
                  <input 
                    type="email" 
                    value={personalForm.email}
                    disabled
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: 'rgba(0,0,0,0.02)', color: colors.textMuted, cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>E-mail Alternativo</label>
                  <input 
                    type="email" 
                    name="altEmail"
                    maxLength={254}
                    value={personalForm.altEmail}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: colors.text, marginBottom: '12px' }}>Qual e-mail deve aparecer público no perfil?</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ 
                    flex: 1, padding: '14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                    border: `2px solid ${personalForm.primaryEmailChoice === 'google' ? colors.primary : colors.border}`,
                    backgroundColor: personalForm.primaryEmailChoice === 'google' ? `${colors.primary}10` : 'transparent'
                  }}>
                    <input type="radio" name="primaryEmailChoice" value="google" checked={personalForm.primaryEmailChoice === 'google'} onChange={handleInputChange} style={{ accentColor: colors.primary, width: '18px', height: '18px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: colors.text }}>E-mail da Conta</span>
                      <span style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>{personalForm.email || 'Não definido'}</span>
                    </div>
                  </label>

                  <label style={{ 
                    flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                    border: `2px solid ${personalForm.primaryEmailChoice === 'alternative' ? colors.primary : colors.border}`,
                    backgroundColor: personalForm.primaryEmailChoice === 'alternative' ? `${colors.primary}10` : 'transparent',
                    cursor: isValidAltEmail ? 'pointer' : 'not-allowed',
                    opacity: isValidAltEmail ? 1 : 0.5
                  }}>
                    <input type="radio" name="primaryEmailChoice" value="alternative" checked={personalForm.primaryEmailChoice === 'alternative'} onChange={handleInputChange} disabled={!isValidAltEmail} style={{ accentColor: colors.primary, width: '18px', height: '18px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: colors.text }}>E-mail Alternativo</span>
                      <span style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>{isValidAltEmail ? personalForm.altEmail : 'Preencha um e-mail válido com @'}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>Telemóvel / Telefone</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input 
                  type="tel" 
                  name="phone"
                  value={personalForm.phone}
                  onChange={handleInputChange}
                  placeholder="+55 (00) 00000-0000"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text, outline: 'none' }}
                />
                
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 20px', 
                  backgroundColor: personalForm.isWhatsApp ? '#22c55e' : 'rgba(34, 197, 94, 0.05)', 
                  border: `1px solid ${personalForm.isWhatsApp ? '#22c55e' : 'rgba(34, 197, 94, 0.2)'}`, 
                  borderRadius: '12px', transition: 'all 0.2s'
                }}>
                  <MessageCircle size={20} color={personalForm.isWhatsApp ? '#fff' : '#22c55e'} />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: personalForm.isWhatsApp ? '#fff' : colors.text }}>É WhatsApp?</span>
                  <input 
                    type="checkbox" 
                    name="isWhatsApp"
                    checked={personalForm.isWhatsApp}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px', accentColor: '#16a34a', marginLeft: '4px' }}
                  />
                </label>
              </div>
            </div>

            <hr style={{ borderColor: colors.border, margin: '16px 0' }} />
            
            <h3 style={{ color: colors.text, fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Redes Sociais</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
                  <Github size={16} /> GitHub
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: colors.background }}>
                  <span style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.03)', color: colors.textMuted, borderRight: `1px solid ${colors.border}`, fontSize: '14px' }}>github.com/</span>
                  <input 
                    type="text" 
                    name="github"
                    maxLength={39} 
                    value={personalForm.github}
                    onChange={handleInputChange}
                    placeholder="usuario"
                    style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'transparent', color: colors.text, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
                  <Linkedin size={16} /> LinkedIn
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: colors.background }}>
                  <span style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.03)', color: colors.textMuted, borderRight: `1px solid ${colors.border}`, fontSize: '14px' }}>linkedin.com/in/</span>
                  <input 
                    type="text" 
                    name="linkedin"
                    maxLength={30}
                    value={personalForm.linkedin}
                    onChange={handleInputChange}
                    placeholder="usuario"
                    style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'transparent', color: colors.text, outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button disabled={isLoading} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: colors.primary, color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: isLoading ? 'wait' : 'pointer', transition: 'transform 0.2s', opacity: isLoading ? 0.7 : 1 }} onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')} onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}>
                <Save size={18} /> {isLoading ? 'A Guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ color: colors.text, fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Privacidade do Perfil</h3>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>Controle exatamente quais informações ficam públicas no seu portfólio online.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'profileVisibility', title: 'Perfil Público', desc: 'Permite que qualquer pessoa aceda ao seu portfólio através do link.', icon: <Eye size={20} /> },
                { id: 'publicEmail', title: 'Mostrar E-mail', desc: 'Exibe o seu e-mail de contacto para os visitantes do perfil.', icon: <Mail size={20} /> },
                { id: 'showLocation', title: 'Mostrar Localização', desc: 'Exibe a sua cidade e estado no topo do seu portfólio.', icon: <User size={20} /> },
                { id: 'showSocial', title: 'Mostrar Redes Sociais', desc: 'Ativa os botões para o seu GitHub e LinkedIn no perfil.', icon: <LinkIcon size={20} /> }
              ].map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: `1px solid ${colors.border}`, borderRadius: '12px', backgroundColor: colors.surface }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.04)', color: colors.text }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 'bold', color: colors.text, fontSize: '16px' }}>{item.title}</h4>
                      <p style={{ margin: '4px 0 0 0', color: colors.textMuted, fontSize: '13px' }}>{item.desc}</p>
                    </div>
                  </div>
                  
                  <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={toggles[item.id as keyof typeof toggles]} onChange={() => handleToggle(item.id as keyof typeof toggles)} style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
                    <div style={{ width: '44px', height: '24px', backgroundColor: toggles[item.id as keyof typeof toggles] ? colors.primary : '#e5e7eb', borderRadius: '9999px', transition: 'background-color 0.2s', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '2px', left: toggles[item.id as keyof typeof toggles] ? '22px' : '2px', width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button disabled={isLoading} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: colors.primary, color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                 Guardar Privacidade
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ color: colors.text, fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>Segurança e Dados</h3>
              <p style={{ color: colors.textMuted, fontSize: '14px' }}>Faça a gestão dos seus dados na plataforma.</p>
            </div>

            <div style={{ padding: '24px', border: `1px solid ${colors.border}`, borderRadius: '12px', backgroundColor: colors.surface }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18} /> Baixar Meus Dados</h4>
              <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '15px' }}>Faça o download de todas as informações vinculadas à sua conta.</p>
              <button style={{ backgroundColor: colors.background, color: colors.text, border: `1px solid ${colors.border}`, padding: '10px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Solicitar Download (JSON)
              </button>
            </div>

            <div style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
              <h4 style={{ color: '#ef4444', fontSize: '16px', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Trash2 size={18} /> Apagar Definitivamente</h4>
              <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '15px' }}>Esta ação é irreversível.</p>
              <button 
                onClick={() => { toast.error('Ação não permitida no modo de demonstração.'); }} 
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }} 
              >
                Apagar Conta
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navbar Superior */}
      <nav style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.surface, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ width: '100%', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          <div style={{ flex: '0 0 auto', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/home')}>
            <img 
              src={logoImg} 
              alt="StackFolio Logo" 
              style={{ height: '50px', width: 'auto', objectFit: 'contain', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 4px', borderRadius: '99px', border: `1px solid ${colors.border}`, backgroundColor: colors.background, cursor: 'pointer' }}
              >
                <div style={{ height: '32px', width: '32px', borderRadius: '50%', backgroundColor: colors.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <ChevronDown size={14} style={{ color: colors.textMuted }} />
              </button>
              
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: '45px', width: '200px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: `1px solid ${colors.border}`, backgroundColor: colors.surface, overflow: 'hidden' }}>
                  <button 
                    onClick={() => navigate('/home')} 
                    style={{ width: '100%', textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 'bold', color: colors.text, backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <User size={16} /> Voltar ao Perfil
                  </button>
                  <button 
                    onClick={logout} 
                    style={{ width: '100%', textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 'bold', color: '#ef4444', backgroundColor: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <LogOut size={16} /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        <aside style={{ width: '250px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: colors.text, margin: '0 0 24px 0', letterSpacing: '-1px' }}>Configurações</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('personal')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: 'none', 
                backgroundColor: activeTab === 'personal' ? colors.primary : 'transparent',
                color: activeTab === 'personal' ? '#fff' : colors.text
              }}
            >
              <User size={18} /> Pessoais
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: 'none',
                backgroundColor: activeTab === 'privacy' ? colors.primary : 'transparent',
                color: activeTab === 'privacy' ? '#fff' : colors.text
              }}
            >
              <Shield size={18} /> Privacidade
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: 'none',
                backgroundColor: activeTab === 'security' ? colors.primary : 'transparent',
                color: activeTab === 'security' ? '#fff' : colors.text
              }}
            >
              <Lock size={18} /> Segurança
            </button>
          </nav>
        </aside>

        <div style={{ flex: 1, backgroundColor: colors.surface, padding: '40px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
          {renderTabContent()}
        </div>

      </main>
    </div>
  );
}