import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { 
  MapPin, Briefcase, Calendar, Link as LinkIcon, Github, Linkedin, Mail, 
  Edit3, Share2, PlusCircle, Terminal, Languages, BarChart, 
  GraduationCap, Cpu, Code, Sun, Moon, X, Camera, ImagePlus, ExternalLink,
  Search, ChevronDown, User, Settings, LogOut, Save, Pin, Eye, ThumbsUp, Smartphone, Globe
} from 'lucide-react';

import logoImg from '../../assets/logo.png';

const SkillIcon = ({ slug, size, fallbackColor }: { slug: string, size: number, fallbackColor?: string }) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    const map: Record<string, string> = {
      'wsl': 'linux', 'aws': 'amazonwebservices', 'gcp': 'googlecloud', 'c++': 'cplusplus', 
      'c#': 'csharp', 'node.js': 'nodedotjs', 'vue.js': 'vuedotjs', 'next.js': 'nextdotjs', 
      'react native': 'react', 'tailwind css': 'tailwindcss', '.net': 'dotnet', 
      'spring boot': 'springboot', 'adobe xd': 'adobexd', 'sql': 'mysql', 'java': 'oracle',
      'css3': 'css3', 'html5': 'html5', 'azure': 'microsoftazure', 'javascript': 'javascript'
    };
    return map[lower] || lower.replace(/[^a-z0-9]/g, '');
  };

  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color={fallbackColor} />;
  return (
    <img 
      src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${finalSlug}.svg`} 
      style={{ width: size, height: size, objectFit: 'contain' }} 
      alt={slug} 
      onError={() => setError(true)} 
    />
  );
};

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, logout, completeRegistration } = useAuth() as any; 
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const isOwner = user?.username === username || (!username && user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Busca os dados do utilizador pelo username na URL
        const response = await api.get(`/users/profile/${username || user?.username}`);
        const data = response.data;

        // Tratamento de JSON: O SQLite devolve strings, o React precisa de objetos
        const parsedData = {
          ...data,
          tools: data.tools ? JSON.parse(data.tools) : [],
          education: data.education ? JSON.parse(data.education) : [],
          contacts: data.contacts ? JSON.parse(data.contacts) : {}
        };

        setProfileData(parsedData);
        setEditForm(parsedData);
        
        // Simulação de projetos (até criarmos a funcionalidade de projetos no backend)
        setUserProjects([]); 
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        if (!username) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (username || user?.username) fetchProfile();
  }, [username, user, navigate]);

  const handleSaveProfile = async () => {
    try {
      await completeRegistration(editForm);
      setProfileData(editForm);
      setShowEditModal(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil.');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Cpu size={40} className="animate-spin" color="#10b981" />
    </div>
  );

  if (!profileData) return <div style={{ padding: '40px', textAlign: 'center' }}>Utilizador não encontrado.</div>;

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: theme === 'light' ? '#f1f5f9' : '#1e293b', color: colors.text, fontSize: '14px', outline: 'none', marginBottom: '15px' };

  // URL de avatar fallback caso não tenha imagem
  const avatarUrl = profileData.profileImg || `https://ui-avatars.com/api/?name=${profileData.fullName || profileData.username}&background=random&color=fff&size=128`;

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '10px 0', background: colors.card, position: 'sticky', top: 0, zIndex: 80, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ cursor: 'pointer', fontWeight: '900', fontSize: '22px', color: colors.primary }} onClick={() => navigate('/')}>
            Stack Folio
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <div style={{ position: 'relative' }} onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <img src={user.profileImg || `https://ui-avatars.com/api/?name=${user.username}`} alt="Eu" style={{ width: '35px', height: '35px', borderRadius: '50%', border: `2px solid ${colors.primary}`, objectFit: 'cover' }} />
                  <ChevronDown size={14} />
                </div>
                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '10px', width: '180px' }}>
                    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                      <button onClick={() => navigate(`/${user.username}`)} style={{ width: '100%', textAlign: 'left', padding: '10px', background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer', fontWeight: '700' }}><User size={16} /> Perfil</button>
                      <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '700' }}><LogOut size={16} /> Sair</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* COVER & AVATAR SECTION */}
        <section style={{ position: 'relative', marginBottom: '80px' }}>
          <div style={{ height: '280px', background: profileData.coverImg ? `url(${profileData.coverImg}) center/cover` : `linear-gradient(135deg, ${colors.primary}80, ${colors.primary})`, width: '100%' }}></div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-80px', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '25px' }}>
                <div style={{ borderRadius: '50%', border: `6px solid ${pageBgColor}`, background: colors.card, width: '160px', height: '160px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ paddingBottom: '15px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>{profileData.fullName}</h1>
                  <p style={{ color: colors.textMuted, fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={18} color={colors.primary} /> {profileData.role || 'Especialista em TI'}
                  </p>
                </div>
              </div>

              {isOwner && (
                <div style={{ paddingBottom: '20px' }}>
                  <button onClick={() => setShowEditModal(true)} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} /> Editar Perfil
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
          {/* SIDEBAR */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Detalhes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><MapPin size={18} color={colors.primary} /> {profileData.location || 'Não informado'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><BarChart size={18} color={colors.primary} /> {profileData.seniority}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}><Languages size={18} color={colors.primary} /> Inglês {profileData.englishLevel}</div>
              </div>
            </div>

            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Redes Sociais</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {profileData.contacts?.github && (
                  <a href={profileData.contacts.github} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                    <Github size={20} /> GitHub
                  </a>
                )}
                {profileData.contacts?.linkedin && (
                  <a href={profileData.contacts.linkedin} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                    <Linkedin size={20} color="#0a66c2" /> LinkedIn
                  </a>
                )}
                {profileData.contacts?.whatsapp && (
                   <div style={{ color: colors.text, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                    <Smartphone size={20} color="#25D366" /> WhatsApp
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '35px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>Sobre mim</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: colors.textMuted }}>{profileData.bio || 'Este utilizador ainda não escreveu uma biografia.'}</p>
            </section>

            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '35px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px' }}>Stack Tecnológico</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {profileData.tools.map((tool: string) => (
                  <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: pageBgColor, padding: '12px 20px', borderRadius: '16px', border: `1px solid ${colors.border}`, fontSize: '14px', fontWeight: '800' }}>
                    <SkillIcon slug={tool} size={20} fallbackColor={colors.primary} /> {tool}
                  </div>
                ))}
              </div>
            </section>

            {profileData.education?.length > 0 && (
              <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '35px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px' }}>Formação Académica</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {profileData.education.map((edu: any) => (
                    <div key={edu.id} style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ background: `${colors.primary}20`, padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                        <GraduationCap size={24} color={colors.primary} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{edu.fieldOfStudy}</h4>
                        <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '600', color: colors.textMuted }}>{edu.institution}</p>
                        <span style={{ fontSize: '12px', color: colors.textMuted }}>{edu.startDate} — {edu.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: colors.card, width: '90%', maxWidth: '600px', borderRadius: '24px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Editar Perfil</h2>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700' }}>Bio</label>
            <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} style={{ ...inputStyle, minHeight: '100px' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700' }}>Cargo</label>
            <input type="text" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, borderRadius: '12px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSaveProfile} style={{ flex: 1, padding: '12px', background: colors.primary, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}