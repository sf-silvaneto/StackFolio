import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Lock, Bell, Trash2, Shield, Download, Mail, Phone, Eye, MessageCircle, Briefcase, User, Sun, Moon, ChevronDown, LogOut, Save, UserMinus, Github, Linkedin, Link as LinkIcon } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export function SettingsPage() {
  const { user, logout } = useAuth() as any;
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    fullName: user?.name || '',
    nickname: user?.name?.split(' ')[0] || '',
    customLink: user?.name?.toLowerCase().replace(/\s+/g, '').substring(0, 15) || '',
    dob: '',
    phone: '',
    isWhatsApp: false, 
    email: user?.email || '',
    altEmail: '',      
    github: '',
    linkedin: ''
  });

  const [toggles, setToggles] = useState({
    publicEmail: true,
    publicPhone: false,
    profileVisibility: true,
    emailComments: true,
    emailJobs: false
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.startsWith('55') && input.length >= 12) input = input.substring(2);
    if (input.length > 11) input = input.substring(0, 11);
    if (input.length === 0) {
      setPersonalForm({ ...personalForm, phone: '' });
      return;
    }
    let formatted = input;
    if (input.length > 0) formatted = '(' + input;
    if (input.length > 2) formatted = '(' + input.substring(0,2) + ') ' + input.substring(2);
    if (input.length > 7) formatted = '(' + input.substring(0,2) + ') ' + input.substring(2,7) + '-' + input.substring(7);
    setPersonalForm({ ...personalForm, phone: formatted });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 15);
    setPersonalForm({ ...personalForm, customLink: val });
  };

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/[^a-zA-Z0-9-]/g, '');
    setPersonalForm({ ...personalForm, github: val });
  };

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '').replace(/[^a-zA-Z0-9-]/g, '');
    setPersonalForm({ ...personalForm, linkedin: val });
  };

  const handleSavePersonalData = () => {
    if (personalForm.altEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(personalForm.altEmail)) {
        alert('❌ Por favor, insira um e-mail válido com @ (exemplo: nome@dominio.com).');
        return;
      }
    }
    alert('✅ Dados atualizados com sucesso!');
  };

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const defaultGoogleAvatar = "https://lh3.googleusercontent.com/a/default-user=s96-c";

  if (!colors || !user) return null;

  const inputStyle = { 
    width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${colors.border}`, 
    background: pageBgColor, color: colors.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' as 'border-box'
  };
  
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted };
  
  const prefixStyle = { 
    padding: '14px 15px', background: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)', 
    color: colors.textMuted, fontSize: '14px', borderRight: `1px solid ${colors.border}`, 
    fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' 
  };

  const ToggleSwitch = ({ isOn, onClick }: { isOn: boolean, onClick: () => void }) => (
    <div onClick={(e) => { e.stopPropagation(); onClick(); }} style={{
      width: '46px', height: '24px', background: isOn ? colors.primary : (theme === 'light' ? '#cbd5e1' : '#475569'),
      borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0
    }}>
      <div style={{
        width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
        position: 'absolute', top: '3px', left: isOn ? '25px' : '3px',
        transition: 'left 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }} />
    </div>
  );

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', width: '100%',
        background: activeTab === id ? `${colors.primary}15` : 'transparent',
        color: activeTab === id ? colors.primary : colors.textMuted,
        border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '15px', cursor: 'pointer',
        textAlign: 'left', transition: 'all 0.2s'
      }}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', color: colors.text }}>
      
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '10px 0', background: colors.card, position: 'sticky', top: 0, zIndex: 80, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
          <div style={{ flex: '0 0 auto', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
            <img src={logoImg} alt="StackFolio Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} />
          </div>

          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={{ position: 'relative' }} onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', background: showUserMenu ? (theme === 'light' ? '#f1f5f9' : '#1e293b') : 'transparent', transition: 'background 0.2s' }}>
                <img src={user?.picture || defaultGoogleAvatar} alt="Perfil" style={{ width: '35px', height: '35px', borderRadius: '50%', border: `2px solid ${colors.primary}`, objectFit: 'cover' }} />
                <span style={{fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap'}}>{user?.name?.split(' ')[0] || 'Perfil'}</span>
                <ChevronDown size={14} style={{ color: colors.textMuted, transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </div>

              {showUserMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 100, width: '180px' }}>
                  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <button onClick={() => navigate(`/${user?.name?.toLowerCase()?.replace(/\s+/g, '') || 'perfil'}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: '10px', color: colors.text, fontSize: '13px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = pageBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <User size={16} /> Meu Perfil
                    </button>
                    <div style={{ height: '1px', background: colors.border, margin: '4px 0' }}></div>
                    <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: '10px', color: '#ef4444', fontSize: '13px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={16} /> Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px', paddingLeft: '10px' }}>Ajustes</h2>
          <TabButton id="personal" icon={User} label="Dados Pessoais" />
          <TabButton id="privacy" icon={Shield} label="Privacidade" />
          <TabButton id="notifications" icon={Bell} label="Notificações" />
          <TabButton id="account" icon={Lock} label="Conta e Segurança" />
        </aside>

        {/* CARTÃO PRINCIPAL */}
        <div style={{ background: colors.card, borderRadius: '32px', border: `1px solid ${colors.border}`, padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          
          {/* WRAPPER CENTRALIZADO PARA OS FORMULÁRIOS */}
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            
            {/* ABA 1: DADOS PESSOAIS */}
            {activeTab === 'personal' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={22} color={colors.primary} /> Dados Pessoais</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Nome Completo</label>
                    <input type="text" maxLength={30} value={personalForm.fullName} onChange={(e) => setPersonalForm({...personalForm, fullName: e.target.value})} style={inputStyle} placeholder="Máx 30 caracteres" />
                  </div>
                  <div>
                    <label style={labelStyle}>Apelido / Nome de Exibição</label>
                    <input type="text" maxLength={15} value={personalForm.nickname} onChange={(e) => setPersonalForm({...personalForm, nickname: e.target.value})} style={inputStyle} placeholder="Máx 15 caracteres" />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Link do Perfil</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: pageBgColor, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={prefixStyle}>stackfolio.com/</span>
                    <input type="text" maxLength={15} value={personalForm.customLink} onChange={handleLinkChange} style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', color: colors.text, fontSize: '14px', outline: 'none' }} placeholder="seu-link" />
                  </div>
                  <span style={{ fontSize: '11px', color: colors.textMuted, display: 'block', marginTop: '6px' }}>Máx 15 caracteres. Apenas letras minúsculas, números e traços.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Data de Nascimento</label>
                    <input type="date" value={personalForm.dob} onChange={(e) => setPersonalForm({...personalForm, dob: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Gênero</label>
                    <select value={personalForm.gender} onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})} style={inputStyle}>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                  <div>
                    <label style={labelStyle}>Número de Telefone</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: pageBgColor, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                      <span style={prefixStyle}>+55</span>
                      <input type="tel" value={personalForm.phone} onChange={handlePhoneChange} style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', color: colors.text, fontSize: '14px', outline: 'none' }} placeholder="(00) 00000-0000" />
                    </div>
                    
                    <div onClick={() => setPersonalForm({...personalForm, isWhatsApp: !personalForm.isWhatsApp})} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', padding: '10px 14px', background: pageBgColor, border: `1px solid ${personalForm.isWhatsApp ? colors.primary : colors.border}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <ToggleSwitch isOn={personalForm.isWhatsApp} onClick={() => setPersonalForm({...personalForm, isWhatsApp: !personalForm.isWhatsApp})} /> 
                      <span style={{ fontSize: '13px', fontWeight: '800', color: personalForm.isWhatsApp ? colors.text : colors.textMuted }}>Ativar contacto por WhatsApp</span>
                    </div>
                  </div>
                  
                  <div>
                    <label style={labelStyle}>E-mail Principal</label>
                    <input type="email" value={personalForm.email} style={{...inputStyle, opacity: 0.7, cursor: 'not-allowed', marginBottom: '12px'}} disabled title="Gerenciado pelo Google" />
                    
                    <label style={labelStyle}>E-mail Alternativo (Opcional)</label>
                    <input type="email" value={personalForm.altEmail} onChange={e => setPersonalForm({...personalForm, altEmail: e.target.value})} style={{...inputStyle, marginBottom: 0}} placeholder="Opcional: contato@seudominio.com" />
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', borderTop: `1px solid ${colors.border}`, paddingTop: '35px' }}>
                  <LinkIcon size={22} color={colors.primary} /> Redes Sociais
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>LinkedIn</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: pageBgColor, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={prefixStyle}><Linkedin size={16} color="#0a66c2"/> https://linkedin.com/in/</span>
                    <input type="text" value={personalForm.linkedin} onChange={handleLinkedinChange} style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', color: colors.text, fontSize: '14px', outline: 'none' }} placeholder="seu-usuario" />
                  </div>
                </div>

                <div style={{ marginBottom: '35px' }}>
                  <label style={labelStyle}>GitHub</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: pageBgColor, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={prefixStyle}><Github size={16}/> https://github.com/</span>
                    <input type="text" value={personalForm.github} onChange={handleGithubChange} style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', color: colors.text, fontSize: '14px', outline: 'none' }} placeholder="seu-usuario" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${colors.border}`, paddingTop: '25px' }}>
                  <button onClick={handleSavePersonalData} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 15px ${colors.primary}40`, transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <Save size={18} /> Guardar Alterações
                  </button>
                </div>
              </div>
            )}

            {/* ABA 2: PRIVACIDADE */}
            {activeTab === 'privacy' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={22} color={colors.primary} /> Privacidade do Perfil</h3>
                <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '30px' }}>Controle quais as informações que ficam públicas para recrutadores e outros desenvolvedores.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: pageBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: colors.card, padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}><Mail size={20} color={colors.textMuted} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '800' }}>Email Público</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Mostrar o botão de contacto por email na sua página de perfil.</p>
                      </div>
                    </div>
                    <ToggleSwitch isOn={toggles.publicEmail} onClick={() => handleToggle('publicEmail')} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: pageBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: colors.card, padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}><Phone size={20} color={colors.textMuted} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '800' }}>Telefone Público</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Exibir o seu número de telefone no seu perfil.</p>
                      </div>
                    </div>
                    <ToggleSwitch isOn={toggles.publicPhone} onClick={() => handleToggle('publicPhone')} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: pageBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: colors.card, padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}><Eye size={20} color={colors.textMuted} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '800' }}>Visibilidade do Perfil</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Permitir que o seu perfil apareça na barra de pesquisa da plataforma.</p>
                      </div>
                    </div>
                    <ToggleSwitch isOn={toggles.profileVisibility} onClick={() => handleToggle('profileVisibility')} />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: NOTIFICAÇÕES */}
            {activeTab === 'notifications' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={22} color={colors.primary} /> Alertas e E-mails</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: pageBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: colors.card, padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}><MessageCircle size={20} color={colors.textMuted} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '800' }}>Novos Comentários</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Receber um e-mail quando alguém comentar nos seus projetos.</p>
                      </div>
                    </div>
                    <ToggleSwitch isOn={toggles.emailComments} onClick={() => handleToggle('emailComments')} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: pageBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: colors.card, padding: '10px', borderRadius: '12px', border: `1px solid ${colors.border}` }}><Briefcase size={20} color={colors.textMuted} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '800' }}>Oportunidades e Vagas</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Receber alertas de recrutadores ou vagas recomendadas.</p>
                      </div>
                    </div>
                    <ToggleSwitch isOn={toggles.emailJobs} onClick={() => handleToggle('emailJobs')} />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: SEGURANÇA E CONTA */}
            {activeTab === 'account' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Lock size={22} color={colors.primary} /> Segurança e Dados</h3>
                
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '10px', color: colors.text }}>Os Seus Dados (LGPD)</h4>
                  <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '15px', lineHeight: '1.6' }}>Você tem o direito de solicitar uma cópia de todos os projetos, publicações e dados pessoais armazenados na nossa plataforma.</p>
                  <button onClick={() => alert('Em breve: Os seus dados serão enviados para o seu e-mail em formato JSON.')} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, padding: '10px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <Download size={16} /> Solicitar Cópia dos Dados
                  </button>
                </div>
                
                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '30px' }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '16px', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><UserMinus size={18} /> Desativar Conta</h4>
                  <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '15px' }}>O seu perfil e projetos ficarão ocultos, mas não serão apagados. Pode voltar quando quiser e reativar com o seu Login Google.</p>
                  <button onClick={() => { if(window.confirm('Deseja desativar temporariamente o seu perfil?')) alert('Conta desativada. Para reativar, basta fazer login novamente.'); }} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '30px' }} onMouseOver={(e) => e.currentTarget.style.background = '#f59e0b'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}>
                    Desativar temporariamente
                  </button>

                  <h4 style={{ color: '#ef4444', fontSize: '16px', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Trash2 size={18} /> Apagar Definitivamente</h4>
                  <p style={{ color: colors.textMuted, fontSize: '13px', marginBottom: '15px' }}>Ao apagar a conta, todos os seus projetos e informações serão perdidos. Esta ação é irreversível.</p>
                  <button onClick={() => { if(window.confirm('Tem a certeza absoluta? Esta ação não pode ser desfeita.')) alert('Conta em processo de exclusão...'); }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
                    Apagar a minha conta
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}