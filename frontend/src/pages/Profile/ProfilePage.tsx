import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { 
  MapPin, Briefcase, Calendar, Github, Linkedin, Mail, Edit3, Terminal, Cpu, Sun, Moon, 
  ChevronDown, User as UserIcon, LogOut, MessageCircle, Settings, Camera, Save, X, 
  LayoutGrid, Rocket, BookOpen, Trash2, Search, ArrowUp, ArrowDown, Plus, LogIn
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import logoImg from '../../assets/logo.png';

const ALL_TOOLS = ["React", "Node.js", "Python", "TypeScript", "JavaScript", "Arduino", "Docker", "Java", "Figma", "Tailwind CSS", "Next.js", "SQL", "Express", "NestJS", "PostgreSQL", "AWS"].sort();

// Constantes de limite de caracteres
const LIMITS = {
  fullName: 50,
  displayName: 30,
  role: 50,
  bio: 500 
};

// Interface para garantir a tipagem correta
interface ProfileData {
  fullName?: string;
  displayName?: string;
  role?: string;
  seniority?: string;
  bio?: string;
  profileImg?: string;
  coverImg?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  tools?: string[];
  education?: any;
  projects?: any[];
}

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

export default function ProfilePage() {
  const { username } = useParams();
  const { user: loggedInUser, logout, completeRegistration: updateProfile } = useAuth() as any; 
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>({});
  
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
        
        if (!targetUser) {
          setLoading(false);
          return;
        }

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
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, loggedInUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImg' | 'coverImg') => {
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
      toast.success("Preview atualizado! Salve para confirmar as alterações.");
    }
  };

  const handleSave = async () => {
    // VALIDAÇÃO RIGOROSA: Impede que os campos essenciais fiquem vazios
    if (!editForm.fullName || !editForm.fullName.trim()) {
      return toast.error('O campo "Nome e Sobrenome" é obrigatório.');
    }
    if (!editForm.displayName || !editForm.displayName.trim()) {
      return toast.error('O campo "Apelido" é obrigatório.');
    }
    if (!editForm.role || !editForm.role.trim()) {
      return toast.error('O campo "Cargo" é obrigatório.');
    }
    if (!editForm.bio || !editForm.bio.trim()) {
      return toast.error('O campo "Sobre mim" é obrigatório.');
    }

    try {
      const payload = {
        ...editForm,
        tools: JSON.stringify(editForm.tools),
        education: editForm.education ? JSON.stringify(editForm.education) : null
      };
      
      await updateProfile(payload);
      setProfileData(editForm);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (e: any) { 
      toast.error(e.response?.data?.message || 'Erro ao salvar alterações.'); 
    }
  };

  // Função estrita: Limita caracteres permitidos e quantidade máxima de palavras
  const handleStrictInput = (field: keyof ProfileData, value: string, maxWords: number) => {
    // 1. Remove qualquer caractere que não seja letra, número, espaço ou acentos básicos
    let sanitized = value.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '');
    
    // 2. Impede múltiplos espaços em branco seguidos
    sanitized = sanitized.replace(/\s{2,}/g, ' ');

    // 3. Conta as palavras e corta se exceder o limite
    const words = sanitized.split(' ').filter(Boolean); // filter para não contar espaços como palavras vazias
    if (words.length > maxWords) {
      // Impede a inserção do espaço que criaria a palavra excedente
      sanitized = words.slice(0, maxWords).join(' ');
    }

    setEditForm({ ...editForm, [field]: sanitized });
  };

  const moveTool = (index: number, direction: 'up' | 'down') => {
    const newTools = [...(editForm.tools || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTools.length) return;
    [newTools[index], newTools[targetIndex]] = [newTools[targetIndex], newTools[index]];
    setEditForm({ ...editForm, tools: newTools });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background }}>
        <Cpu size={40} className="animate-spin" color={colors.primary} />
      </div>
    );
  }

  if (!profileData && !loggedInUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: colors.background, gap: '20px' }}>
        <h2 style={{ fontWeight: 800, fontSize: '24px' }}>Ops! Perfil não encontrado</h2>
        <p style={{ color: colors.textMuted }}>Faça login para criar seu portfólio ou encontrar colegas.</p>
        <button onClick={() => navigate('/login')} style={{ background: colors.primary, color: '#fff', padding: '12px 30px', borderRadius: '16px', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <LogIn size={20} /> Ir para Login
        </button>
      </div>
    );
  }

  const sectionStyle = { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
  const inputStyle = { background: theme === 'light' ? '#f1f5f9' : '#1e293b', border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '12px 18px', color: colors.text, outline: 'none', width: '100%', fontSize: '15px' };

  return (
    <div style={{ background: colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text, fontFamily: "'Inter', sans-serif" }}>
      
      {/* MODAL CONFIRMAÇÃO IMAGEM */}
      {tempImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: colors.card, maxWidth: '450px', width: '100%', borderRadius: '32px', textAlign: 'center', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '25px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 900 }}>Atualizar {tempImage.field === 'coverImg' ? 'Capa' : 'Avatar'}</h3>
              <X onClick={() => setTempImage(null)} style={{ cursor: 'pointer', opacity: 0.5 }} />
            </div>
            <div style={{ padding: '30px' }}>
              <img src={tempImage.url} style={{ width: '100%', borderRadius: '20px', maxHeight: '250px', objectFit: 'cover' }} alt="Preview" />
              <p style={{ marginTop: '20px', color: colors.textMuted, fontSize: '14px' }}>Deseja utilizar esta imagem no seu perfil?</p>
            </div>
            <div style={{ padding: '20px', display: 'flex', gap: '15px' }}>
              <button onClick={() => setTempImage(null)} style={{ flex: 1, padding: '15px', borderRadius: '16px', background: 'transparent', border: `1px solid ${colors.border}`, color: colors.text, fontWeight: 700 }}>Cancelar</button>
              <button onClick={confirmImageUpdate} style={{ flex: 1, padding: '15px', borderRadius: '16px', border: 'none', background: colors.primary, color: '#fff', fontWeight: 900 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER / NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, background: colors.card + 'cc', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, height: '70px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
             <img src={logoImg} alt="StackFolio Logo" style={{ height: '35px' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer' }}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            {loggedInUser ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 12px', borderRadius: '16px', border: `1px solid ${colors.border}` }} onClick={() => setShowUserMenu(!showUserMenu)}>
                  <img src={loggedInUser.profileImg || `https://ui-avatars.com/api/?name=${loggedInUser.username}`} style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }} alt="User" />
                  <ChevronDown size={14} />
                </div>
                {showUserMenu && (
                  <div className="animate-in" style={{ position: 'absolute', top: '55px', right: 0, width: '200px', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    <button onClick={() => navigate('/configuracoes')} style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'transparent', border: 'none', color: colors.text, fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '10px' }}><Settings size={16} /> Configurações</button>
                    <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '10px' }}><LogOut size={16} /> Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Entrar</button>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ maxWidth: '1100px', width: '100%', margin: '40px auto', padding: '0 20px 80px', flex: 1 }}>
        
        {/* HERO AREA */}
        <section style={{ position: 'relative', marginBottom: '120px' }}>
          <div style={{ height: '280px', borderRadius: '32px', background: (isEditing ? editForm.coverImg : profileData?.coverImg) ? `url(${isEditing ? editForm.coverImg : profileData.coverImg}) center/cover` : `linear-gradient(135deg, ${colors.primary}, #4f46e5)`, position: 'relative', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
            {isEditing && (
              <button onClick={() => bannerInputRef.current?.click()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera color="#fff" size={32} />
              </button>
            )}
            <input type="file" ref={bannerInputRef} hidden onChange={(e) => handleImageChange(e, 'coverImg')} accept="image/*" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '25px', padding: '0 10px' }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', marginTop: '-100px' }}>
                <div style={{ width: '170px', height: '170px', borderRadius: '45px', border: `8px solid ${colors.background}`, background: colors.card, overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
                  <img src={isEditing ? editForm.profileImg : profileData?.profileImg || `https://ui-avatars.com/api/?name=${profileData?.fullName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                </div>
                {isEditing && (
                  <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: '10px', right: '10px', background: colors.primary, color: '#fff', border: 'none', padding: '12px', borderRadius: '18px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                    <Camera size={20} />
                  </button>
                )}
                <input type="file" ref={fileInputRef} hidden onChange={(e) => handleImageChange(e, 'profileImg')} accept="image/*" />
              </div>

              <div style={{ paddingTop: '10px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '400px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 2 }}>
                        {/* FUNÇÃO handleStrictInput PARA O NOME (2 palavras) */}
                        <input 
                          maxLength={LIMITS.fullName} 
                          value={editForm.fullName || ''} 
                          onChange={e => handleStrictInput('fullName', e.target.value, 2)} 
                          style={{...inputStyle, fontWeight: 800}} 
                          placeholder="Nome e Sobrenome" 
                        />
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>{(editForm.fullName || '').length}/{LIMITS.fullName}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        {/* FUNÇÃO handleStrictInput PARA O APELIDO (2 palavras) */}
                        <input 
                          maxLength={LIMITS.displayName} 
                          value={editForm.displayName || ''} 
                          onChange={e => handleStrictInput('displayName', e.target.value, 2)} 
                          style={{...inputStyle, color: colors.primary}} 
                          placeholder="Apelido" 
                        />
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>{(editForm.displayName || '').length}/{LIMITS.displayName}</span>
                      </div>
                    </div>
                    {/* FUNÇÃO handleStrictInput PARA O CARGO (3 palavras) */}
                    <input 
                      maxLength={LIMITS.role} 
                      value={editForm.role || ''} 
                      onChange={e => handleStrictInput('role', e.target.value, 3)} 
                      style={inputStyle} 
                      placeholder="Cargo (Ex: Software Engineer)" 
                    />
                    <span style={{ fontSize: '10px', opacity: 0.5, marginTop: '-10px' }}>{(editForm.role || '').length}/{LIMITS.role}</span>
                  </div>
                ) : (
                  <>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
                      {profileData?.fullName} <span style={{ color: colors.primary, opacity: 0.8 }}>({profileData?.displayName})</span>
                    </h1>
                    <p style={{ fontSize: '18px', color: colors.textMuted, fontWeight: 700, margin: '5px 0' }}>{profileData?.role || 'Entusiasta de Tecnologia'}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <span style={{ background: colors.primary + '15', color: colors.primary, padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>{profileData?.seniority || 'Membro'}</span>
                      <span style={{ background: '#3b82f615', color: '#3b82f6', padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>Português / Inglês</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isOwner && (
              <div style={{ paddingTop: '10px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setIsEditing(false); setEditForm(profileData || {}); setTempImage(null); }} style={{ padding: '12px 20px', borderRadius: '16px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: 700, cursor: 'pointer' }}>Descartar</button>
                    <button onClick={handleSave} style={{ padding: '12px 25px', borderRadius: '16px', border: 'none', background: colors.primary, color: '#fff', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={18} /> Salvar Perfil</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} style={{ padding: '14px 28px', borderRadius: '18px', border: `1px solid ${colors.border}`, background: colors.card, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Edit3 size={18} /> Editar</button>
                )}
              </div>
            )}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '30px' }}>
          
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* STACK TECNOLÓGICA */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '20px', letterSpacing: '1px' }}>Stack Principal</h3>
              {isEditing && (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                   <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px' }}>
                      <Search size={16} opacity={0.5} />
                      <input placeholder="Adicionar tecnologia..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowResults(true);}} style={{ background: 'transparent', border: 'none', color: colors.text, outline: 'none', width: '100%' }} />
                   </div>
                   {showResults && searchTerm && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', zIndex: 50, marginTop: '8px', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        {ALL_TOOLS.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                          <div key={t} onClick={() => { if((editForm.tools || []).length < 12 && !(editForm.tools || []).includes(t)) setEditForm({...editForm, tools: [...(editForm.tools || []), t]}); setSearchTerm(''); }} style={{ padding: '12px 15px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }} className="tool-option">{t}</div>
                        ))}
                      </div>
                   )}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(isEditing ? editForm.tools : profileData?.tools)?.map((t: string, idx: number) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '12px 15px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <SkillIcon slug={t} size={20} />
                      <span style={{ fontSize: '14px', fontWeight: 800 }}>{t}</span>
                    </div>
                    {isEditing && (
                      <div style={{ display: 'flex', gap: '10px', opacity: 0.6 }}>
                        <ArrowUp size={14} onClick={() => moveTool(idx, 'up')} style={{ cursor: 'pointer' }} />
                        <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => setEditForm({...editForm, tools: (editForm.tools || []).filter((x:any)=>x!==t)})} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CONEXÕES */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '20px', letterSpacing: '1px' }}>Social</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {profileData?.github && <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: colors.text, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '15px' }} className="social-link"><Github size={20} /> GitHub</a>}
                {profileData?.linkedin && <a href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '15px' }} className="social-link"><Linkedin size={20} /> LinkedIn</a>}
                <div onClick={() => { navigator.clipboard.writeText(profileData?.email || ''); toast.success("E-mail copiado!"); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '15px', color: colors.textMuted }} className="social-link"><Mail size={20} /> {profileData?.email}</div>
              </div>
            </div>
          </aside>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* BIO SECTION */}
            <section style={sectionStyle}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}><UserIcon size={22} color={colors.primary} /> Sobre mim</h3>
              {isEditing ? (
                <div>
                  <textarea maxLength={LIMITS.bio} value={editForm.bio || ''} onChange={e => setEditForm({...editForm, bio: e.target.value})} style={{ ...inputStyle, minHeight: '160px', resize: 'none', lineHeight: '1.6' }} placeholder="Sua história..." />
                  <div style={{ textAlign: 'right', marginTop: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: (editForm.bio || '').length >= LIMITS.bio ? '#ef4444' : colors.textMuted }}>{(editForm.bio || '').length}/{LIMITS.bio}</span>
                  </div>
                </div>
              ) : (
                <p style={{ lineHeight: '1.8', fontSize: '16px', color: colors.text, whiteSpace: 'pre-wrap', opacity: 0.9 }}>{profileData?.bio || 'Diga algo sobre você...'}</p>
              )}
            </section>

            {/* PROJETOS - DINÂMICO */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '0 10px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 900, display: 'flex', gap: '12px', alignItems: 'center' }}><Rocket size={26} color={colors.primary} /> Projetos</h3>
                {isOwner && <button style={{ background: colors.primary, border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', gap: '8px' }}><Plus size={20} /> Novo Projeto</button>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {profileData?.projects?.length > 0 ? (
                  profileData.projects.map((p: any) => (
                    <div key={p.id} style={sectionStyle}>
                      <h4 style={{ margin: '0 0 10px', fontSize: '18px' }}>{p.title}</h4>
                      <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: '1.5' }}>{p.description}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1/-1', ...sectionStyle, padding: '80px 40px', textAlign: 'center', border: `2px dashed ${colors.border}`, background: 'transparent', opacity: 0.5 }}>
                    <LayoutGrid size={48} color={colors.textMuted} style={{ marginBottom: '20px', marginInline: 'auto' }} />
                    <p style={{ color: colors.textMuted, fontSize: '18px', fontWeight: 800 }}>O palco está vazio. Publique seu primeiro projeto!</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '40px 20px', background: colors.card, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '15px' }}>
          <a href="/termos" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }} className="footer-link">Termos de Serviço</a>
          <a href="/privacidade" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }} className="footer-link">Política de Privacidade</a>
        </div>
        <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0, opacity: 0.8 }}>© {new Date().getFullYear()} StackFolio. Todos os direitos reservados.</p>
      </footer>

      <style>{`
        .animate-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tool-option:hover { background: ${colors.primary}15 !important; color: ${colors.primary} !important; }
        .social-link:hover { color: ${colors.primary} !important; transform: translateX(5px); transition: all 0.2s ease; }
        .footer-link:hover { color: ${colors.primary} !important; transition: color 0.2s ease; }
      `}</style>
    </div>
  );
}