import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  MapPin, Briefcase, Calendar, Link as LinkIcon, Github, Linkedin, Mail, 
  Edit3, Share2, PlusCircle, Terminal, Languages, BarChart, 
  GraduationCap, Cpu, Code, Sun, Moon, X, Camera, ImagePlus, ExternalLink,
  Search, ChevronDown, User, Settings, LogOut, Save, Pin, Eye, ThumbsUp
} from 'lucide-react';

import logoImg from '../../assets/logo.png';

const SkillIcon = ({ slug, size, fallbackColor }: { slug: string, size: number, fallbackColor?: string }) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    const map: Record<string, string> = {
      'cisco': 'cisco', 'python': 'python', 'aws': 'amazonwebservices', 'react': 'react',
      'node.js': 'nodedotjs', 'typescript': 'typescript', 'figma': 'figma', 'docker': 'docker',
      'c++': 'cplusplus'
    };
    return map[lower] || lower.replace(/[^a-z0-9]/g, '');
  };
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color={fallbackColor} />;
  return <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${finalSlug}.svg`} style={{ width: size, height: size, objectFit: 'contain' }} alt={slug} onError={() => setError(true)} />;
};

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, logout, loginWithGoogle } = useAuth() as any; 
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // CORREÇÃO 1: Adicionado o ?. antes do replace para evitar erro de tela branca
  const isOwner = user?.name?.toLowerCase()?.replace(/\s+/g, '') === username || (!username && user);
  const defaultGoogleAvatar = "https://lh3.googleusercontent.com/a/default-user=s96-c";

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const isComplete = await loginWithGoogle(credentialResponse.credential);
        if (isComplete) navigate('/profile'); 
        else navigate('/complete-profile'); 
      } catch (error) { console.error("Falha ao processar login", error); }
    }
  };

  useEffect(() => {
    const loadData = () => {
      const baseData = {
        fullName: user?.name || "Silvestre Fernandes",
        displayName: user?.name?.split(' ')[0] || "Silva Neto",
        username: username || "silvaneto",
        role: "Engenheiro de Software",
        location: "Mossoró - RN",
        cep: "59600000",
        availability: "Open to Work",
        seniority: "Júnior",
        englishLevel: "Avançado",
        bio: "Desenvolvedor focado em criar soluções eficientes. Tenho forte interesse em Cibersegurança e Inteligência Artificial, e grande experiência em simulações de redes e infraestrutura corporativa.",
        profileImg: user?.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=silvestre",
        coverImg: "",
        tools: ["Python", "Cisco", "AWS", "React", "Node.js", "Docker"],
        stats: { views: '1.2K', likes: 350 },
        education: [ { id: 1, fieldOfStudy: "Ciência da Computação", institution: "Universidade Potiguar (UnP)", startMonth: "Fev", startYear: "2024", endMonth: "Dez", endYear: "2027" } ],
        experience: [ { id: 1, role: "Agente de Atendimento", company: "AeC", startYear: "2025", endYear: "Atual" } ],
        contacts: { github: "https://github.com/", linkedin: "https://linkedin.com/", publicEmail: user?.email || "contato@stackfolio.com" }
      };
      
      const mockProjects = [
        {
          id: 1,
          title: "Arquitetura Hierárquica: Matriz e Filiais",
          description: "Simulação robusta de infraestrutura corporativa.",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80",
          skills: [{name: "Cisco", slug: "cisco"}, {name: "AWS", slug: "aws"}],
          isPinned: true 
        },
        {
          id: 2,
          title: "Monitoramento IoT: Portas e Janelas",
          description: "Detecção de abertura em tempo real com ESP32.",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
          skills: [{name: "C++", slug: "c++"}, {name: "React", slug: "react"}],
          isPinned: false
        }
      ];

      setProfileData(baseData);
      setEditForm(baseData);
      setUserProjects(mockProjects);
      setLoading(false);
    };
    loadData();
  }, [username, user]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, '');
    setEditForm({ ...editForm, cep });
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEditForm(prev => ({ ...prev, location: `${data.localidade} - ${data.uf}` }));
        }
      } catch (error) { console.error("Erro ao buscar CEP", error); }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData((prev: any) => ({ ...prev, [type === 'cover' ? 'coverImg' : 'profileImg']: url }));
    }
  };

  const handleSaveProfile = () => {
    setProfileData({ ...profileData, ...editForm });
    setShowEditModal(false);
    alert('Perfil atualizado com sucesso!');
  };

  // CORREÇÃO 2: Proteção de carregamento do colors
  if (!colors) return null;

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={40} className="animate-spin" color="#10b981" /></div>;

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: theme === 'light' ? '#f1f5f9' : '#1e293b', color: colors.text, fontSize: '14px', outline: 'none', marginBottom: '15px' };

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '10px 0', background: colors.card, position: 'sticky', top: 0, zIndex: 80, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
          <div style={{ flex: '0 0 auto', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
            <img src={logoImg} alt="Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} />
          </div>
          <div style={{ flex: '1 1 auto', maxWidth: '400px', margin: '0 20px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
            <input type="text" placeholder="Pesquisar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px 10px 10px 40px', width: '100%', borderRadius: '12px', border: `1px solid ${colors.border}`, background: theme === 'light' ? '#f1f5f9' : '#1e293b', color: colors.text, outline: 'none' }} />
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <div style={{ position: 'relative' }} onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', background: showUserMenu ? (theme === 'light' ? '#f1f5f9' : '#1e293b') : 'transparent', transition: 'background 0.2s' }}>
                  <img src={user.picture || defaultGoogleAvatar} alt="Perfil" style={{ width: '35px', height: '35px', borderRadius: '50%', border: `2px solid ${colors.primary}`, objectFit: 'cover' }} />
                  <span style={{fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap'}}>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ color: colors.textMuted, transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 100, width: '180px' }}>
                    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                      {/* CORREÇÃO 3: Adicionado o ?. antes do replace na navegação do menu */}
                      <button onClick={() => navigate(`/${user?.name?.toLowerCase()?.replace(/\s+/g, '') || 'perfil'}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: '10px', color: colors.text, fontSize: '13px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = pageBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <User size={16} /> Meu Perfil
                      </button>
                      <button onClick={() => navigate('/configuracoes')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: '10px', color: colors.text, fontSize: '13px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = pageBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Settings size={16} /> Configurações
                      </button>
                      <div style={{ height: '1px', background: colors.border, margin: '4px 0' }}></div>
                      <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', padding: '10px', color: '#ef4444', fontSize: '13px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} /> Sair da conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (<GoogleLogin onSuccess={handleSuccess} theme={theme === 'dark' ? 'filled_black' : 'filled_blue'} shape="pill" />)}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        <section style={{ position: 'relative', marginBottom: '80px' }}>
          <div style={{ height: '280px', background: profileData?.coverImg ? `url(${profileData.coverImg}) center/cover` : `linear-gradient(135deg, ${colors.primary}80, ${colors.primary})`, width: '100%', position: 'relative' }}>
            {isOwner && (
              <label style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(4px)' }}>
                <ImagePlus size={18} /> <span style={{ fontSize: '13px', fontWeight: '700' }}>Alterar Capa</span>
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
              </label>
            )}
          </div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-80px', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '25px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ borderRadius: '50%', border: `6px solid ${pageBgColor}`, background: colors.card, width: '160px', height: '160px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <img src={profileData?.profileImg} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {isOwner && (
                    <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: colors.primary, color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', border: `4px solid ${pageBgColor}`, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      <Camera size={20} />
                      <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                    </label>
                  )}
                </div>
                <div style={{ paddingBottom: '15px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>
                    {profileData?.fullName} <span style={{ fontSize: '20px', color: colors.textMuted, fontWeight: '500' }}>({profileData?.displayName})</span>
                  </h1>
                  <p style={{ color: colors.textMuted, fontWeight: '700', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <Briefcase size={18} color={colors.primary} /> {profileData?.role}
                  </p>
                </div>
              </div>

              <div style={{ paddingBottom: '20px', display: 'flex', gap: '12px' }}>
                {isOwner && (
                  <button onClick={() => setShowEditModal(true)} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 15px ${colors.primary}40` }}>
                    <Edit3 size={18} /> Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
          
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* ESTATÍSTICAS DO PERFIL */}
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: colors.primary, display: 'flex', justifyContent: 'center', marginBottom: '5px' }}><Eye size={24} /></div>
                <h4 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>{profileData.stats.views}</h4>
                <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '700' }}>Visualizações</span>
              </div>
              <div style={{ textAlign: 'center', borderLeft: `1px solid ${colors.border}` }}>
                <div style={{ color: colors.primary, display: 'flex', justifyContent: 'center', marginBottom: '5px' }}><ThumbsUp size={24} /></div>
                <h4 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>{profileData.stats.likes}</h4>
                <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '700' }}>Curtidas</span>
              </div>
            </div>

            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Informações</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><MapPin size={18} color={colors.primary} /> {profileData?.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><BarChart size={18} color={colors.primary} /> {profileData?.seniority}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><Languages size={18} color={colors.primary} /> Inglês {profileData?.englishLevel}</div>
              </div>
              <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: `1px solid ${colors.border}` }}>
                <h4 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '10px' }}>Bio</h4>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: colors.textMuted, margin: 0 }}>{profileData?.bio}</p>
              </div>
            </div>
            
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Redes Sociais</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <a href={profileData.contacts.github} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '700' }}><div style={{ background: pageBgColor, padding: '10px', borderRadius: '12px' }}><Github size={20} /></div> GitHub</a>
                <a href={profileData.contacts.linkedin} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '700' }}><div style={{ background: pageBgColor, padding: '10px', borderRadius: '12px' }}><Linkedin size={20} color="#0a66c2" /> LinkedIn</div></a>
              </div>
            </div>
          </aside>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* VITRINE DE PROJETOS COM FIXADOS */}
            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}><Code size={24} color={colors.primary} /> Portfólio de Projetos</h3>
                {isOwner && <button style={{ background: colors.primary, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><PlusCircle size={18} /> Novo Projeto</button>}
              </div>

              {/* Renderiza os Projetos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {userProjects.map(proj => (
                  <article key={proj.id} style={{ border: `1px solid ${proj.isPinned ? colors.primary : colors.border}`, borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                    {proj.isPinned && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: colors.primary, color: '#fff', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                        <Pin size={12} /> Fixado
                      </div>
                    )}
                    <img src={proj.image} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt={proj.title} />
                    <div style={{ padding: '20px', background: pageBgColor }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '900', color: colors.text }}>{proj.title}</h4>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {proj.skills.map((s:any) => (
                          <span key={s.name} style={{ background: colors.card, border: `1px solid ${colors.border}`, padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: colors.textMuted }}>{s.name}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '35px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><Cpu size={24} color={colors.primary} /> Stack Tecnológico</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {profileData?.tools?.map((tool: string) => (
                  <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: pageBgColor, padding: '12px 20px', borderRadius: '16px', border: `1px solid ${colors.border}`, fontSize: '15px', fontWeight: '800' }}>
                    <SkillIcon slug={tool} size={20} fallbackColor={colors.primary} /> {tool}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL COM CEP */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowEditModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: colors.card, width: '90%', maxWidth: '600px', maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto', border: `1px solid ${colors.border}`, position: 'relative' }}>
            
            <div style={{ padding: '25px 30px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: colors.card, zIndex: 10 }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Edit3 size={20} color={colors.primary} /> Editar Perfil</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text }}><X size={24} /></button>
            </div>

            <div style={{ padding: '30px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>Cargo / Título</label>
              <input type="text" value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value})} style={inputStyle} />

              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>Sua Bio</label>
              <textarea rows={4} value={editForm.bio || ''} onChange={e => setEditForm({...editForm, bio: e.target.value})} style={{ ...inputStyle, resize: 'none' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>CEP (Apenas números)</label>
                  <input type="text" maxLength={8} value={editForm.cep || ''} onChange={handleCepChange} style={inputStyle} placeholder="Ex: 59600000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>Cidade / Estado</label>
                  <input type="text" value={editForm.location || ''} disabled style={{...inputStyle, opacity: 0.7, cursor: 'not-allowed'}} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>Senioridade</label>
                  <select value={editForm.seniority || ''} onChange={e => setEditForm({...editForm, seniority: e.target.value})} style={inputStyle}>
                    <option value="Estagiário">Estagiário</option>
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>Nível de Inglês</label>
                  <select value={editForm.englishLevel || ''} onChange={e => setEditForm({...editForm, englishLevel: e.target.value})} style={inputStyle}>
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                  </select>
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted, marginTop: '10px' }}>GitHub URL</label>
              <input type="text" value={editForm.contacts?.github || ''} onChange={e => setEditForm({...editForm, contacts: {...editForm.contacts, github: e.target.value}})} style={inputStyle} />

              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px', color: colors.textMuted }}>LinkedIn URL</label>
              <input type="text" value={editForm.contacts?.linkedin || ''} onChange={e => setEditForm({...editForm, contacts: {...editForm.contacts, linkedin: e.target.value}})} style={inputStyle} />
            </div>

            <div style={{ padding: '20px 30px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'flex-end', gap: '15px', position: 'sticky', bottom: 0, background: colors.card }}>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', color: colors.text, fontWeight: '800', cursor: 'pointer', padding: '10px 20px' }}>Cancelar</button>
              <button onClick={handleSaveProfile} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={18} /> Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}