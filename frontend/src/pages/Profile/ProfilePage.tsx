import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { 
  MapPin, Briefcase, Calendar, Github, Linkedin, Mail, Edit3, Terminal, GraduationCap, Cpu, Sun, Moon, 
  ChevronDown, User as UserIcon, LogOut, Building, MessageCircle, Settings, Camera, Save, X, 
  LayoutGrid, Rocket, BookOpen, Trash2, Search, ArrowUp, ArrowDown, Copy, Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import logoImg from '../../assets/logo.png';

const ALL_TOOLS = ["React", "Node.js", "Python", "TypeScript", "JavaScript", "Arduino", "Docker", "Java", "Figma", "Tailwind CSS", "Next.js", "SQL", "Express", "NestJS", "PostgreSQL", "AWS"].sort();

const SkillIcon = ({ slug, size }: { slug: string, size: number }) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    const val = s.trim().toLowerCase();
    const map: Record<string, string> = { 'arduino': 'arduino', 'python': 'python', 'react': 'react', 'node.js': 'nodedotjs', 'typescript': 'typescript', 'java': 'openjdk' };
    return map[val] || val.replace(/[^a-z0-9]/g, '');
  };
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} />;
  return <img src={`https://cdn.simpleicons.org/${finalSlug}`} style={{ width: size, height: size, objectFit: 'contain' }} alt={slug} onError={() => setError(true)} />;
};

export function ProfilePage() {
  const { username } = useParams();
  const { user: loggedInUser, logout, completeRegistration: updateProfile } = useAuth() as any; 
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const [tempImage, setTempImage] = useState<{ url: string, field: 'profileImg' | 'coverImg' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isOwner = loggedInUser?.username === username || (!username && loggedInUser);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUser = username || loggedInUser?.username;
        if (!targetUser) { navigate('/login'); return; }
        const response = await api.get(`/users/profile/${targetUser}`);
        const data = response.data;
        
        const parsed = { 
          ...data, 
          tools: data.tools ? (typeof data.tools === 'string' ? JSON.parse(data.tools) : data.tools) : [], 
          education: data.education ? (typeof data.education === 'string' ? JSON.parse(data.education) : data.education) : null 
        };
        setProfileData(parsed);
        setEditForm(parsed);
      } catch (error) {
        toast.error("Perfil não encontrado.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, loggedInUser, navigate]);

  const handleImageClick = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImg' | 'coverImg') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Imagem muito pesada (máx 5MB)");
      const reader = new FileReader();
      reader.onloadend = () => setTempImage({ url: reader.result as string, field });
      reader.readAsDataURL(file);
    }
  };

  const confirmImageUpdate = () => {
    if (tempImage) {
      setEditForm({ ...editForm, [tempImage.field]: tempImage.url });
      setTempImage(null);
      toast.success("Preview da imagem atualizado!");
    }
  };

  const handleSave = async () => {
    try {
      // Envia os dados para o AuthContext que agora está blindado contra 401
      await updateProfile({
        ...editForm,
        tools: editForm.tools,
        education: editForm.education
      });
      setProfileData(editForm);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (e: any) { 
      console.error("ERRO AO SALVAR:", e.response?.data || e);
      toast.error(e.response?.data?.message || 'Erro ao salvar. Verifique sua conexão.'); 
    }
  };

  const moveTool = (index: number, direction: 'up' | 'down') => {
    const newTools = [...editForm.tools];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTools.length) return;
    [newTools[index], newTools[targetIndex]] = [newTools[targetIndex], newTools[index]];
    setEditForm({ ...editForm, tools: newTools });
  };

  if (loading || !profileData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background }}><Cpu size={40} className="animate-spin" color={colors.primary} /></div>;

  const sectionStyle = { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' };
  const inputStyle = { background: theme === 'light' ? '#f1f5f9' : '#1e293b', border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '10px 15px', color: colors.text, outline: 'none', width: '100%', fontSize: '14px' };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', color: colors.text, fontFamily: "'Inter', sans-serif" }}>
      
      {/* MODAL DE CONFIRMAÇÃO DE IMAGEM */}
      {tempImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: colors.card, maxWidth: '500px', width: '100%', borderRadius: '28px', textAlign: 'center', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 800 }}>Confirmar nova {tempImage.field === 'coverImg' ? 'Capa' : 'Foto'}</h3>
              <X onClick={() => setTempImage(null)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ padding: '30px' }}>
              <img src={tempImage.url} style={{ maxWidth: '100%', borderRadius: '15px', maxHeight: '300px', objectFit: 'cover', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }} alt="Preview" />
              <p style={{ marginTop: '20px', color: colors.textMuted, fontWeight: 500 }}>Deseja aplicar esta alteração ao seu perfil?</p>
            </div>
            <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setTempImage(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, fontWeight: 700 }}>Cancelar</button>
              <button onClick={confirmImageUpdate} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: colors.primary, color: '#fff', fontWeight: 800 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, background: colors.card, position: 'sticky', top: 0, zIndex: 100, height: '70px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
             <span style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-1.5px' }}>Stack<span style={{ color: colors.primary }}>Folio</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            {loggedInUser && (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px', border: `1px solid ${colors.border}` }} onClick={() => setShowUserMenu(!showUserMenu)}>
                  <img src={loggedInUser.profileImg || `https://ui-avatars.com/api/?name=${loggedInUser.username}`} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="User" />
                  <ChevronDown size={14} />
                </div>
                {showUserMenu && (
                  <div className="animate-in" style={{ position: 'absolute', top: '55px', right: 0, width: '220px', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '8px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
                    <button onClick={() => navigate('/configuracoes')} style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'transparent', border: 'none', color: colors.text, fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '10px' }}><Settings size={16} /> Configurações</button>
                    <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '10px' }}><LogOut size={16} /> Sair</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px 60px' }}>
        
        {/* HERO AREA */}
        <section style={{ position: 'relative', marginBottom: '140px' }}>
          <input type="file" ref={bannerInputRef} hidden onChange={(e) => handleImageClick(e, 'coverImg')} accept="image/*" />
          <div style={{ height: '300px', borderRadius: '32px', background: (isEditing ? editForm.coverImg : profileData.coverImg) ? `url(${isEditing ? editForm.coverImg : profileData.coverImg}) center/cover` : `linear-gradient(135deg, ${colors.primary}, #10b981)`, position: 'relative', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
            {isEditing && (
              <button onClick={() => bannerInputRef.current?.click()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera color="#fff" size={32} />
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '25px', padding: '0 10px' }}>
            <div style={{ display: 'flex', gap: '35px', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', marginTop: '-110px' }}>
                <input type="file" ref={fileInputRef} hidden onChange={(e) => handleImageClick(e, 'profileImg')} accept="image/*" />
                <div style={{ width: '180px', height: '180px', borderRadius: '50px', border: `6px solid ${theme === 'light' ? '#f8fafc' : '#0f172a'}`, background: colors.card, overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
                  <img src={isEditing ? editForm.profileImg : profileData.profileImg || `https://ui-avatars.com/api/?name=${profileData.fullName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                </div>
                {isEditing && <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: '15px', right: '15px', background: colors.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Camera size={18} /></button>}
              </div>

              <div style={{ paddingTop: '15px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '450px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} style={{...inputStyle, fontWeight: 800, fontSize: '20px'}} placeholder="Nome" />
                      <input value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} style={{...inputStyle, color: colors.primary, width: '160px'}} placeholder="Apelido" />
                    </div>
                    <input value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} style={inputStyle} placeholder="Cargo (Ex: Desenvolvedor Sênior)" />
                  </div>
                ) : (
                  <>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>{profileData.fullName} <span style={{ color: colors.primary, fontWeight: 700 }}>({profileData.displayName})</span></h1>
                    <p style={{ fontSize: '20px', color: colors.textMuted, fontWeight: '700', margin: '5px 0' }}>{profileData.role || 'Especialista em Tecnologia'}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <span style={{ background: colors.primary + '15', color: colors.primary, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>{profileData.seniority}</span>
                      <span style={{ background: '#3b82f615', color: '#3b82f6', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>Inglês {profileData.englishLevel}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isOwner && (
              <div style={{ paddingTop: '15px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsEditing(false)} style={{ padding: '12px 25px', borderRadius: '15px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: '800', cursor: 'pointer' }}>Descartar</button>
                    <button onClick={handleSave} style={{ padding: '12px 30px', borderRadius: '15px', border: 'none', background: colors.primary, color: '#fff', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={18} /> Salvar</button>
                  </div>
                ) : (
                  <button onClick={() => { setIsEditing(true); setEditForm(profileData); }} style={{ padding: '16px 32px', borderRadius: '20px', border: `1px solid ${colors.border}`, background: colors.card, fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={18} /> Editar Perfil</button>
                )}
              </div>
            )}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
          
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* SKILLS - COM BUSCA E ORDENAÇÃO */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '20px' }}>Habilidades Técnicas</h3>
              {isEditing && (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                   <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Search size={16} />
                      <input placeholder="Buscar tecnologia..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowResults(true);}} style={{ background: 'transparent', border: 'none', color: colors.text, outline: 'none', width: '100%' }} />
                   </div>
                   {showResults && searchTerm && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', zIndex: 50, marginTop: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                        {ALL_TOOLS.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                          <div key={t} onClick={() => { if(editForm.tools.length < 10 && !editForm.tools.includes(t)) setEditForm({...editForm, tools: [...editForm.tools, t]}); setSearchTerm(''); }} style={{ padding: '10px 15px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }} className="tool-option">{t}</div>
                        ))}
                      </div>
                   )}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(isEditing ? editForm.tools : profileData.tools).map((t: string, idx: number) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#f1f5f9', padding: '10px 15px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <SkillIcon slug={t} size={20} />
                      <span style={{ fontSize: '14px', fontWeight: 800 }}>{t}</span>
                    </div>
                    {isEditing && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ArrowUp size={14} onClick={() => moveTool(idx, 'up')} style={{ cursor: 'pointer', opacity: idx === 0 ? 0.2 : 1 }} />
                        <ArrowDown size={14} onClick={() => moveTool(idx, 'down')} style={{ cursor: 'pointer', opacity: idx === editForm.tools.length - 1 ? 0.2 : 1 }} />
                        <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => setEditForm({...editForm, tools: editForm.tools.filter((x:any)=>x!==t)})} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '20px' }}>Educação Oficial</h3>
              {profileData.education && (
                <div style={{ display: 'flex', gap: '15px' }}>
                   <div style={{ background: colors.primary + '15', padding: '12px', borderRadius: '15px', height: 'fit-content' }}>
                      {profileData.education.level?.includes('Graduação') ? <GraduationCap color={colors.primary} /> : <BookOpen color={colors.primary} />}
                   </div>
                   <div>
                      <h4 style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>{profileData.education.course}</h4>
                      <p style={{ margin: '3px 0', fontSize: '13px', color: colors.textMuted, fontWeight: 600 }}>{profileData.education.institution}</p>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: colors.primary }}>{profileData.education.start} — {profileData.education.end || 'Cursando'}</span>
                   </div>
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <h3 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '20px' }}>Conectar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {profileData.github && <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: colors.text, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '15px' }} className="social-link"><Github size={20} /> GitHub</a>}
                {profileData.linkedin && <a href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '15px' }} className="social-link"><Linkedin size={20} /> LinkedIn</a>}
                {profileData.phone && <a href={`https://wa.me/${profileData.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#25d366', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '15px' }} className="social-link"><MessageCircle size={20} /> WhatsApp</a>}
                <div onClick={() => { navigator.clipboard.writeText(profileData.email); toast.success("E-mail copiado!"); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '15px', color: colors.textMuted }} className="social-link"><Mail size={20} /> Copiar E-mail</div>
              </div>
            </div>
          </aside>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><UserIcon size={22} color={colors.primary} /> Sobre mim</h3>
              {isEditing ? (
                <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} style={{ ...inputStyle, minHeight: '180px', resize: 'vertical', lineHeight: '1.6' }} placeholder="Conte sua trajetória profissional e paixões técnicas..." />
              ) : (
                <p style={{ lineHeight: '1.8', fontSize: '16px', color: colors.text, whiteSpace: 'pre-wrap' }}>{profileData.bio || 'Diga ao mundo quem você é.'}</p>
              )}
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', display: 'flex', gap: '12px', letterSpacing: '-0.5px' }}><Rocket size={28} color={colors.primary} /> Projetos & Publicações</h3>
                {isOwner && <button style={{ background: colors.primary, border: 'none', color: '#fff', padding: '10px 22px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', gap: '8px' }}><Plus size={20} /> Publicar</button>}
              </div>
              <div style={{ ...sectionStyle, padding: '80px 40px', textAlign: 'center', border: `2px dashed ${colors.border}`, background: 'transparent', opacity: 0.6 }}>
                <LayoutGrid size={48} color={colors.textMuted} style={{ marginBottom: '20px' }} />
                <p style={{ color: colors.textMuted, fontSize: '18px', fontWeight: '800' }}>Sua vitrine de projetos está pronta para brilhar.</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        .animate-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .tool-option:hover { background: ${colors.primary}15 !important; color: ${colors.primary} !important; }
        .social-link:hover { color: ${colors.primary} !important; transform: translateX(5px); transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}