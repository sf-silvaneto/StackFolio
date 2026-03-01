import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, ExternalLink, X, TrendingUp, Clock, ChevronRight, Eye, ThumbsUp, User, Sun, Moon, LogOut, LayoutDashboard, Briefcase, GraduationCap, Play, Filter, ChevronDown, Search, Bookmark, BadgeCheck, Layers, XCircle, MessageCircle, Send } from 'lucide-react';

export function HomePage() {
  const { theme, toggleTheme, colors } = useTheme();
  const { signed, user, signInGoogle, signOut } = useAuth() as any; 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [newComment, setNewComment] = useState(''); // Estado para o input de comentários

  // Estados para os Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeSoftSkills, setActiveSoftSkills] = useState<string[]>([]);
  
  // Estados para busca DENTRO dos filtros
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [softSkillSearchQuery, setSoftSkillSearchQuery] = useState('');

  // Estados para controlar os balões flutuantes (hover)
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [hoveredModalAuthor, setHoveredModalAuthor] = useState(false);
  const [hoveredFeedAuthor, setHoveredFeedAuthor] = useState<number | null>(null);
  const [hoveredHardSkills, setHoveredHardSkills] = useState<number | null>(null);
  const [hoveredSoftSkills, setHoveredSoftSkills] = useState<number | null>(null);

  const defaultGoogleAvatar = "https://lh3.googleusercontent.com/a/default-user=s96-c";

  const suggestedUsers = [
    { name: 'Alif', avatar: defaultGoogleAvatar, role: 'Desenvolvedor Frontend', education: 'Engenharia de Software', github: 'https://github.com', linkedin: 'https://linkedin.com', verified: false },
    { name: 'Ramiro', avatar: defaultGoogleAvatar, role: 'Especialista Backend', education: 'Ciência da Computação', github: 'https://github.com', linkedin: 'https://linkedin.com', verified: true }
  ];

  const trendingLanguages = [
    { name: 'React', slug: 'react' },
    { name: 'Python', slug: 'python' },
    { name: 'Node.js', slug: 'nodedotjs' },
    { name: 'AWS', slug: 'amazonaws' },
    { name: 'Docker', slug: 'docker' }
  ];

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Arquitetura Hierárquica: Matriz e Filiais",
      description: "Este projeto apresenta uma simulação robusta de infraestrutura corporativa conectando uma sede administrativa a duas filiais operacionais através do Cisco.",
      publishedAt: "28 de Fevereiro de 2026 às 23:55",
      timestamp: 1772322900000, 
      updatedAt: "01 de Março de 2026 às 10:30",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", 
      skills: [
        { name: "Cisco", slug: "cisco" }, { name: "Python", slug: "python" }, { name: "Figma", slug: "figma" },
        { name: "Docker", slug: "docker" }, { name: "AWS", slug: "amazonaws" }, { name: "Linux", slug: "linux" }, { name: "React", slug: "react" }
      ],
      softSkills: ["Liderança", "Visão Sistêmica", "Comunicação", "Resolução de Problemas", "Proatividade", "Trabalho em Equipe"], 
      upvotes: 450,
      views: 1240,
      isLiked: false,
      isSaved: false,
      commentsList: [
        { id: 1, author: 'Ramiro', text: 'Top demais! Excelente topologia.', avatar: defaultGoogleAvatar }
      ],
      links: { deploy: "https://google.com", github: "https://github.com", linkedin: "https://linkedin.com" }, 
      author: {
        name: "Silva Neto",
        avatar: defaultGoogleAvatar,
        role: "Engenheiro de Redes & IoT",
        education: "Engenharia de Computação",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        verified: true
      }
    },
    {
      id: 2,
      title: "Monitoramento IoT: Portas e Janelas",
      description: "Projeto focado na detecção de abertura e fechamento de portas e janelas em tempo real usando ESP32, sensores magnéticos e gestão ágil.",
      publishedAt: "01 de Março de 2026 às 08:00",
      timestamp: 1772352000000, 
      updatedAt: null,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: null, 
      skills: [
        { name: "C++", slug: "cplusplus" }, { name: "Jira", slug: "jira" }, { name: "DBeaver", slug: "dbeaver" }, { name: "Node.js", slug: "nodedotjs" }
      ],
      softSkills: ["Trabalho em Equipe", "Criatividade", "Gestão de Tempo", "Foco em Resultados"],
      upvotes: 120,
      views: 560,
      isLiked: false,
      isSaved: true,
      commentsList: [],
      links: { deploy: "https://google.com", github: "https://github.com", linkedin: "https://linkedin.com" }, 
      author: {
        name: "Alif",
        avatar: defaultGoogleAvatar,
        role: "Desenvolvedor Backend & IoT",
        education: "Engenharia de Software",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        verified: false
      }
    }
  ]);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const handleSuccess = async (res: any) => { if (res.credential) { try { await signInGoogle(res.credential); } catch (error) { console.error(error); } } };
  const handleLogout = () => { if (signOut) signOut(); };
  const reloadPage = () => { window.location.reload(); };

  const handleLike = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (!signed) { alert("⚠️ Tem de iniciar sessão com a sua conta Google para interagir!"); return; }
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isLiked: !p.isLiked, upvotes: !p.isLiked ? p.upvotes + 1 : p.upvotes - 1 } : p));
    if (selectedProject?.id === projectId) setSelectedProject((prev: any) => ({ ...prev, isLiked: !prev.isLiked, upvotes: !prev.isLiked ? prev.upvotes + 1 : prev.upvotes - 1 }));
  };

  const handleBookmark = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (!signed) { alert("⚠️ Tem de iniciar sessão para guardar publicações!"); return; }
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isSaved: !p.isSaved } : p));
    if (selectedProject?.id === projectId) setSelectedProject((prev: any) => ({ ...prev, isSaved: !prev.isSaved }));
  };

  const handleAddComment = (projectId: number) => {
    if (!signed) { alert("⚠️ Tem de iniciar sessão para comentar!"); return; }
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: user?.name || 'Visitante',
      text: newComment,
      avatar: user?.picture || defaultGoogleAvatar
    };

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, commentsList: [...p.commentsList, comment] } : p));
    if (selectedProject?.id === projectId) setSelectedProject((prev: any) => ({ ...prev, commentsList: [...prev.commentsList, comment] }));
    setNewComment('');
  };

  const clearFilters = () => {
    setActiveSkills([]);
    setActiveSoftSkills([]);
  };

  const availableSkills = Array.from(new Set(projects.flatMap(p => p.skills.map(s => s.name))));
  const availableSoftSkills = Array.from(new Set(projects.flatMap(p => p.softSkills)));
  const totalActiveFilters = activeSkills.length + activeSoftSkills.length;

  const filteredAvailableSkills = availableSkills.filter(s => s.toLowerCase().includes(skillSearchQuery.toLowerCase()));
  const filteredAvailableSoftSkills = availableSoftSkills.filter(s => s.toLowerCase().includes(softSkillSearchQuery.toLowerCase()));

  const processedProjects = projects
    .filter(p => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.skills.some(sk => sk.name.toLowerCase().includes(q)) || p.softSkills.some(ssk => ssk.toLowerCase().includes(q));
    })
    .filter(p => activeSkills.length === 0 || activeSkills.every(sk => p.skills.some(ps => ps.name === sk)))
    .filter(p => activeSoftSkills.length === 0 || activeSoftSkills.every(ssk => p.softSkills.includes(ssk)))
    .sort((a, b) => {
      if (activeTab === 'trending') return (b.upvotes + b.views) - (a.upvotes + a.views); 
      return b.timestamp - a.timestamp; 
    });

  const galleryBgColor = theme === 'light' ? '#f1f5f9' : '#1e293b'; 
  const textColor = theme === 'light' ? '#334155' : '#f8fafc';

  const SocialButton = ({ href, icon: Icon, title, label }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: label ? '8px 16px' : '8px', borderRadius: '10px', background: theme === 'light' ? '#f1f5f9' : '#1e293b', color: colors.text, transition: 'all 0.2s', textDecoration: 'none', fontWeight: '800', fontSize: '13px' }}
      onMouseOver={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }}
      onMouseOut={(e) => { e.currentTarget.style.background = theme === 'light' ? '#f1f5f9' : '#1e293b'; e.currentTarget.style.color = colors.text; }}
    >
      <Icon size={16} /> {label && <span>{label}</span>}
    </a>
  );

  const getSoftSkillColor = (skill: string) => {
    const index = skill.length % 5;
    const palettes = [
      { light: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' }, dark: { bg: '#334155', text: '#cbd5e1', border: '#475569' } }, 
      { light: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }, dark: { bg: '#14532d', text: '#86efac', border: '#166534' } }, 
      { light: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' }, dark: { bg: '#1e3a8a', text: '#93c5fd', border: '#1e40af' } }, 
      { light: { bg: '#fdf4ff', text: '#6b21a8', border: '#e9d5ff' }, dark: { bg: '#4c1d95', text: '#d8b4fe', border: '#581c87' } }, 
      { light: { bg: '#fffbeb', text: '#854d0e', border: '#fef08a' }, dark: { bg: '#713f12', text: '#fde047', border: '#854d0e' } }, 
    ];
    return palettes[index][theme === 'dark' ? 'dark' : 'light'];
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* LIGHTBOX */}
      {fullscreenImg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFullscreenImg(null)}>
          {fullscreenImg.includes('.mp4') ? (
            <video src={fullscreenImg} controls autoPlay style={{ maxWidth: '90%', maxHeight: '90%' }} />
          ) : (
            <img src={fullscreenImg} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '16px' }} />
          )}
          <X size={40} style={{ position: 'absolute', top: '40px', right: '40px', color: '#fff', cursor: 'pointer' }} />
        </div>
      )}

      {/* NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '15px 0', background: theme === 'light' ? '#cbd5e1' : colors.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="main-wrapper navbar-container">
          <div className="nav-left">
            <div className="logo-link" onClick={reloadPage}>
              <h2 style={{ margin: 0, color: colors.primary, fontWeight: '900', fontSize: '32px', letterSpacing: '-1px' }}>Stack Folio</h2>
            </div>
          </div>
          
          <div className="nav-center">
            {/* BUSCA COM MENU SUSPENSO */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted, zIndex: 2 }} />
              <input 
                type="text" placeholder="Pesquisar projetos, sistemas, palavras-chave..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="search-input"
                style={{ paddingLeft: '40px', width: '100%', position: 'relative', zIndex: 1 }}
              />
              
              {isSearchFocused && !searchQuery && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '15px', zIndex: 110, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Buscas Recentes</div>
                    {['Sistema IoT', 'Dashboard React'].map(s => (
                      <div key={s} onClick={() => setSearchQuery(s)} style={{ fontSize: '13px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = galleryBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '6px', opacity: 0.6 }} /> {s}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Tendências Populares</div>
                    {['Python', 'Cisco Packet Tracer', 'AWS'].map(s => (
                      <div key={s} onClick={() => setSearchQuery(s)} style={{ fontSize: '13px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = galleryBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <TrendingUp size={12} color={colors.primary} style={{ display: 'inline', marginRight: '6px' }} /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {!signed ? (
                <GoogleLogin onSuccess={handleSuccess} theme={theme === 'dark' ? 'filled_black' : 'filled_blue'} shape="pill" />
              ) : (
                <>
                  <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: colors.primary, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}>
                    <LayoutDashboard size={16} /> Meus Projetos
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={user?.picture || defaultGoogleAvatar} alt="Perfil" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', background: colors.primary }} />
                    <span style={{fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap'}}>{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%' }} title="Sair da conta">
                    <LogOut size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FEED PRINCIPAL */}
      <main className="main-wrapper" style={{ padding: '40px 20px', flex: 1 }}>
        
        {/* BANNER CTA (Apenas se NÃO logado) */}
        {!signed && (
          <div style={{ background: `linear-gradient(135deg, ${theme === 'light' ? '#eff6ff' : '#0f172a'}, ${galleryBgColor})`, border: `1px solid ${colors.border}`, padding: '35px 40px', borderRadius: '24px', marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: colors.text, marginBottom: '8px' }}>Mostre o seu código ao mundo! 🚀</h2>
              <p style={{ color: colors.textMuted, fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>O StackFolio é o melhor lugar para developers e engenheiros documentarem os seus projetos, conectarem-se com outros profissionais e ganharem destaque no mercado.</p>
            </div>
            <button onClick={() => alert('Em breve: Redirecionamento para Registo Completo')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.primary, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px', boxShadow: `0 4px 15px ${colors.primary}40`, transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <User size={18} /> Criar o meu portfólio
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '50px' }}>
          
          <section>
            {/* CABEÇALHO DO FEED: FILTROS + ABAS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '35px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: showFilters || totalActiveFilters > 0 ? colors.primary : 'transparent', color: showFilters || totalActiveFilters > 0 ? '#fff' : colors.textMuted, border: `1px solid ${showFilters || totalActiveFilters > 0 ? colors.primary : colors.border}`, borderRadius: '16px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: showFilters || totalActiveFilters > 0 ? `0 4px 12px ${colors.primary}40` : 'none' }}>
                    <Filter size={18} /> Filtros {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                    <ChevronDown size={18} style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </button>

                  {/* BOTAO LIMPAR FILTROS */}
                  {totalActiveFilters > 0 && (
                    <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '800', fontSize: '13px', cursor: 'pointer', padding: '8px' }}>
                      <XCircle size={16} /> Limpar
                    </button>
                  )}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', background: theme === 'light' ? 'rgba(241, 245, 249, 0.8)' : 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '24px', border: `1px solid ${colors.border}` }}>
                  <button onClick={() => setActiveTab('trending')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: activeTab === 'trending' ? colors.primary : 'transparent', border: 'none', borderRadius: '18px', color: activeTab === 'trending' ? '#ffffff' : colors.textMuted, fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <TrendingUp size={18}/> Em Alta
                  </button>
                  <span style={{ color: colors.border, margin: '0 4px', fontWeight: '900' }}>|</span>
                  <button onClick={() => setActiveTab('recent')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: activeTab === 'recent' ? colors.primary : 'transparent', border: 'none', borderRadius: '18px', color: activeTab === 'recent' ? '#ffffff' : colors.textMuted, fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <Clock size={18}/> Recentes
                  </button>
                </div>
              </div>

              {/* PAINEL OCULTO DE FILTROS */}
              {showFilters && (
                <div style={{ background: theme === 'light' ? '#f8fafc' : '#1e293b', padding: '25px', borderRadius: '20px', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeInDown 0.3s ease-out' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><LayoutDashboard size={14}/> Sistemas e Ferramentas</h4>
                      <div style={{ position: 'relative' }}>
                        <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                        <input type="text" placeholder="Procurar sistema..." value={skillSearchQuery} onChange={(e) => setSkillSearchQuery(e.target.value)} style={{ background: galleryBgColor, border: `1px solid ${colors.border}`, padding: '6px 12px 6px 30px', borderRadius: '8px', fontSize: '12px', color: textColor, outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
                      {filteredAvailableSkills.map(skill => (
                        <button key={skill} onClick={() => setActiveSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])} style={{ background: activeSkills.includes(skill) ? colors.primary : galleryBgColor, color: activeSkills.includes(skill) ? '#fff' : textColor, border: `1px solid ${activeSkills.includes(skill) ? colors.primary : colors.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: '1px', width: '100%', background: colors.border }}></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><Briefcase size={14}/> Palavras-chave (Skills)</h4>
                      <div style={{ position: 'relative' }}>
                        <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                        <input type="text" placeholder="Procurar palavra-chave..." value={softSkillSearchQuery} onChange={(e) => setSoftSkillSearchQuery(e.target.value)} style={{ background: galleryBgColor, border: `1px solid ${colors.border}`, padding: '6px 12px 6px 30px', borderRadius: '8px', fontSize: '12px', color: textColor, outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
                      {filteredAvailableSoftSkills.map(ss => {
                        const style = getSoftSkillColor(ss);
                        const isActive = activeSoftSkills.includes(ss);
                        return (
                          <button key={ss} onClick={() => setActiveSoftSkills(prev => isActive ? prev.filter(s => s !== ss) : [...prev, ss])} style={{ background: isActive ? style.text : style.bg, color: isActive ? '#fff' : style.text, border: `1px solid ${isActive ? style.text : style.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>
                            #{ss}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GRID DE QUADRADINHOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {processedProjects.map(proj => {
                
                const visibleHard = proj.skills.slice(0, 3);
                const hiddenHard = proj.skills.slice(3, 10);
                
                const visibleSoft = proj.softSkills.slice(0, 3);
                const hiddenSoft = proj.softSkills.slice(3, 10);

                return (
                  <article 
                    key={proj.id} onClick={() => setSelectedProject(proj)} 
                    style={{ background: colors.card, borderRadius: '24px', border: `1px solid ${colors.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', zIndex: hoveredFeedAuthor === proj.id ? 50 : 1 }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    
                    {/* CAPA DE MÍDIA COM INDICADORES */}
                    <div style={{ width: '100%', aspectRatio: '16/10', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
                      {proj.videoUrl ? (
                        <>
                          <video src={proj.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px', borderRadius: '50%', display: 'flex', pointerEvents: 'none' }}><Play size={16} fill="#fff" color="#fff" /></div>
                        </>
                      ) : (
                        <>
                          <img src={proj.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                          {/* INDICADOR MULTI-IMAGENS */}
                          {proj.gallery.length > 0 && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '11px', fontWeight: '800', pointerEvents: 'none' }}>
                              <Layers size={14} /> +{proj.gallery.length}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                      
                      {/* Autor */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        <div 
                          onMouseEnter={(e) => { e.stopPropagation(); setHoveredFeedAuthor(proj.id); }} onMouseLeave={(e) => { e.stopPropagation(); setHoveredFeedAuthor(null); }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/profile/${proj.author.name.toLowerCase().replace(' ', '')}`); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px 6px 6px', background: hoveredFeedAuthor === proj.id ? galleryBgColor : 'transparent', borderRadius: '20px', transition: 'all 0.2s', marginLeft: '-6px' }}
                        >
                          <img src={proj.author.avatar} alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', background: colors.primary }} />
                          <span style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {proj.author.name}
                            {proj.author.verified && <BadgeCheck size={14} color={colors.primary} style={{ marginTop: '1px' }} />}
                          </span>

                          {hoveredFeedAuthor === proj.id && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '10px', zIndex: 100, width: '280px', cursor: 'default' }}>
                              <div onClick={(e) => e.stopPropagation()} style={{ background: theme === 'light' ? '#ffffff' : colors.card, border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                  <img src={proj.author.avatar} alt="User" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: colors.primary }} />
                                  <div>
                                    <div style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      {proj.author.name} {proj.author.verified && <BadgeCheck size={14} color={colors.primary} />}
                                    </div>
                                    <div style={{ fontSize: '12px', color: colors.textMuted }}>@{proj.author.name.toLowerCase().replace(' ', '')}</div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: colors.textMuted, marginBottom: '15px' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14}/> {proj.author.role}</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={14}/> {proj.author.education}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {proj.author.github && <SocialButton href={proj.author.github} icon={Github} label="GitHub" />}
                                  {proj.author.linkedin && <SocialButton href={proj.author.linkedin} icon={Linkedin} label="LinkedIn" />}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '700' }}>{proj.publishedAt.split(' às')[0]}</span>
                      </div>

                      {/* Título e Descrição */}
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1.2' }}>{proj.title}</h3>
                        <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>{proj.description}</p>
                      </div>

                      {/* Hard Skills */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {visibleHard.map((s: any) => (
                          <div key={s.name} title={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: galleryBgColor, padding: '4px 10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                            <img src={`https://cdn.simpleicons.org/${s.slug}`} style={{ width: '12px', height: '12px' }} alt="Logo" />
                            <span style={{ fontSize: '11px', fontWeight: '800', color: textColor }}>{s.name}</span>
                          </div>
                        ))}
                        {hiddenHard.length > 0 && (
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.stopPropagation(); setHoveredHardSkills(proj.id); }} onMouseLeave={(e) => { e.stopPropagation(); setHoveredHardSkills(null); }}>
                            <span style={{ fontSize: '11px', fontWeight: '900', background: galleryBgColor, color: textColor, padding: '4px 8px', borderRadius: '8px', border: `1px dashed ${colors.textMuted}`, cursor: 'help' }}>+{hiddenHard.length}</span>
                            {hoveredHardSkills === proj.id && (
                              <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, width: 'max-content' }}>
                                {hiddenHard.map(hs => (
                                  <div key={hs.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img src={`https://cdn.simpleicons.org/${hs.slug}`} style={{ width: '14px', height: '14px' }} alt="Logo" />
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: textColor }}>{hs.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Soft Skills */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                        {visibleSoft.map((ss: string) => {
                          const style = getSoftSkillColor(ss);
                          return (
                            <span key={ss} style={{ fontSize: '10px', fontWeight: '800', background: style.bg, color: style.text, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${style.border}` }}>#{ss}</span>
                          );
                        })}
                        {hiddenSoft.length > 0 && (
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.stopPropagation(); setHoveredSoftSkills(proj.id); }} onMouseLeave={(e) => { e.stopPropagation(); setHoveredSoftSkills(null); }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', background: 'transparent', color: colors.textMuted, padding: '4px 8px', borderRadius: '6px', border: `1px dashed ${colors.textMuted}`, cursor: 'help' }}>+{hiddenSoft.length}</span>
                            {hoveredSoftSkills === proj.id && (
                              <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, width: 'max-content' }}>
                                {hiddenSoft.map(hss => {
                                  const sStyle = getSoftSkillColor(hss);
                                  return (
                                    <span key={hss} style={{ fontSize: '11px', fontWeight: '800', background: sStyle.bg, color: sStyle.text, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${sStyle.border}` }}>#{hss}</span>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AÇÕES (Likes, Comentários, Salvar) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginTop: '5px' }}>
                        <div style={{ display: 'flex', gap: '15px', color: colors.textMuted }}>
                          <button onClick={(e) => handleLike(e, proj.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: proj.isLiked ? colors.primary : colors.textMuted, fontWeight: '900', fontSize: '13px', transition: 'color 0.2s', padding: 0 }}>
                            <ThumbsUp size={16} fill={proj.isLiked ? colors.primary : 'none'} /> {proj.upvotes}
                          </button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800' }}><MessageCircle size={16}/> {proj.commentsList?.length || proj.comments}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800' }}><Eye size={16}/> {proj.views}</div>
                        </div>

                        {/* BOTÃO SALVAR / BOOKMARK */}
                        <button onClick={(e) => handleBookmark(e, proj.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: proj.isSaved ? colors.primary : colors.textMuted, padding: '4px', transition: 'all 0.2s', transform: proj.isSaved ? 'scale(1.1)' : 'scale(1)' }} title="Guardar projeto">
                          <Bookmark size={20} fill={proj.isSaved ? colors.primary : 'none'} />
                        </button>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>

            {processedProjects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: colors.textMuted, fontWeight: '800', background: galleryBgColor, borderRadius: '24px', marginTop: '20px', border: `1px dashed ${colors.border}` }}>
                <Search size={40} style={{ margin: '0 auto 15px', opacity: 0.3 }} />
                Nenhum projeto encontrado. Tente limpar os filtros ou mudar a sua pesquisa.
              </div>
            )}

          </section>

          {/* ASIDE (Barra Lateral) */}
          <aside>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'sticky', top: '100px' }}>
              
              {/* BLOCO 1: PERFIS EM DESTAQUE */}
              <div style={{ background: colors.card, padding: '30px', borderRadius: '28px', border: `1px solid ${colors.border}` }}>
                <h3 style={{ fontSize: '16px', marginBottom: '25px', fontWeight: '900', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color={colors.primary} /> Perfis em Destaque
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {suggestedUsers.map(u => (
                    <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '45px', height: '45px', borderRadius: '14px', objectFit: 'cover', background: colors.primary }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {u.name} {u.verified && <BadgeCheck size={14} color={colors.primary} />}
                        </div>
                        <div style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.role}</div>
                      </div>
                      <button onClick={() => navigate(`/profile/${u.name.toLowerCase().replace(' ', '')}`)} style={{ background: theme === 'light' ? '#f1f5f9' : '#1e293b', border: 'none', color: colors.primary, padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = theme === 'light' ? '#f1f5f9' : '#1e293b'; e.currentTarget.style.color = colors.primary; }}>
                        Ver
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCO 2: LINGUAGENS EM ALTA NA SEMANA */}
              <div style={{ background: colors.card, padding: '30px', borderRadius: '28px', border: `1px solid ${colors.border}` }}>
                <h3 style={{ fontSize: '16px', marginBottom: '20px', fontWeight: '900', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color={colors.primary} /> Linguagens em Alta na Semana
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trendingLanguages.map(tag => {
                    const isActive = activeSkills.includes(tag.name);
                    return (
                      <button 
                        key={tag.name} 
                        onClick={() => { setActiveSkills(prev => prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name]); window.scrollTo({top:0, behavior:'smooth'}); }} 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isActive ? colors.primary : galleryBgColor, color: isActive ? '#fff' : textColor, border: `1px solid ${isActive ? colors.primary : colors.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <img src={`https://cdn.simpleicons.org/${tag.slug}`} style={{ width: '12px', height: '12px', filter: isActive ? 'brightness(0) invert(1)' : 'none' }} alt="Logo" />
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: theme === 'light' ? '#f8fafc' : '#1a1a1a', color: colors.textMuted, padding: '3rem 1rem', display: 'flex', justifyContent: 'center', marginTop: 'auto', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', textAlign: 'center', fontWeight: '600' }}>© {new Date().getFullYear()} Todos os direitos reservados.</div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: '600' }}>
            <a href="/termos" style={{ color: colors.textMuted, textDecoration: 'none', cursor: 'pointer' }}>Termos de Serviço</a>
            <a href="/privacidade" style={{ color: colors.textMuted, textDecoration: 'none', cursor: 'pointer' }}>Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* MODAL DO PROJETO */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: theme === 'light' ? '#ffffff' : '#0f172a', width: '90%', maxWidth: '1200px', height: '90vh', borderRadius: '24px', position: 'relative', display: 'flex', overflow: 'hidden' }}>
            
            {/* Botão de fechar (X) fixo no topo direito */}
            <button onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 110, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}>
              <X size={20} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100%', width: '100%' }}>
              
              {/* LADO ESQUERDO DO MODAL */}
              <div style={{ background: galleryBgColor, padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', borderRight: `1px solid ${colors.border}`, overflowY: 'auto' }}>
                <div>
                  <h4 style={{ color: textColor, margin: '0 0 15px 0', fontSize: '13px', fontWeight: '900', opacity: 0.8 }}>GALERIA</h4>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', background: '#000', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} onClick={() => setFullscreenImg(selectedProject.videoUrl || selectedProject.image)}>
                    {selectedProject.videoUrl ? (
                      <>
                       <video src={selectedProject.videoUrl} style={{ width: '100%', height: '100%', opacity: 0.7, objectFit: 'cover' }} />
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}><Play size={36} color="#fff" fill="#fff" /></div>
                      </>
                    ) : (
                      <img src={selectedProject.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Capa" />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                    {selectedProject.gallery.map((img: string, i: number) => (
                      <img key={i} src={img} className="modal-gallery-img" onClick={() => setFullscreenImg(img)} alt="Thumb" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                    ))}
                  </div>
                </div>

                {/* Hard Skills Modal (Limite 10) */}
                <div>
                   <h4 style={{ color: textColor, marginBottom: '15px', fontSize: '13px', fontWeight: '900', opacity: 0.8 }}>SISTEMAS UTILIZADOS</h4>
                   <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedProject.skills.slice(0, 10).map((skill: any) => (
                      <div key={skill.name} style={{ background: colors.card, border: `1px solid ${colors.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}>
                        <img src={`https://cdn.simpleicons.org/${skill.slug}`} style={{ width: '18px', height: '18px' }} alt="Logo" />
                        <div style={{fontSize: '12px', fontWeight: '800', color: textColor}}>{skill.name}</div>
                      </div>
                    ))}
                   </div>
                </div>

                {/* Soft Skills Modal (Limite 10) */}
                <div>
                   <h4 style={{ color: textColor, marginBottom: '15px', fontSize: '13px', fontWeight: '900', opacity: 0.8 }}>PALAVRAS CHAVES / SOFT SKILLS</h4>
                   <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProject.softSkills.slice(0, 10).map((ss: string) => {
                      const style = getSoftSkillColor(ss);
                      return (
                        <div key={ss} style={{ background: style.bg, border: `1px solid ${style.border}`, padding: '6px 14px', display: 'flex', alignItems: 'center', borderRadius: '10px' }}>
                          <div style={{fontSize: '12px', fontWeight: '800', color: style.text}}>#{ss}</div>
                        </div>
                      )
                    })}
                   </div>
                </div>
              </div>

              {/* LADO DIREITO DO MODAL */}
              <div style={{ padding: '50px 50px 50px 50px', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
                
                {/* Cabeçalho do Lado Direito - Botões ao Lado da Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', paddingRight: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.primary, fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>
                    {activeTab === 'trending' ? <><TrendingUp size={16}/> PROJETO EM ALTA</> : <><Clock size={16}/> PROJETO RECENTE</>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={(e) => handleBookmark(e, selectedProject.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: selectedProject.isSaved ? colors.primary : colors.textMuted, padding: '4px', transition: 'all 0.2s', transform: selectedProject.isSaved ? 'scale(1.1)' : 'scale(1)' }} title="Guardar projeto">
                      <Bookmark size={22} fill={selectedProject.isSaved ? colors.primary : 'none'} />
                    </button>
                    <button onClick={(e) => handleLike(e, selectedProject.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: selectedProject.isLiked ? `${colors.primary}15` : (theme === 'light' ? '#f1f5f9' : '#1e293b'), border: `1px solid ${selectedProject.isLiked ? colors.primary : colors.border}`, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', color: selectedProject.isLiked ? colors.primary : colors.textMuted, fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}>
                      <ThumbsUp size={16} fill={selectedProject.isLiked ? colors.primary : 'none'} /> {selectedProject.upvotes}
                    </button>
                  </div>
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', lineHeight: '1.1' }}>{selectedProject.title}</h2>
                <p style={{ color: colors.text, fontWeight: '400', lineHeight: '1.8', fontSize: '16px', marginBottom: '25px' }}>{selectedProject.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setSelectedProject(null); navigate(`/profile/${selectedProject.author.name.toLowerCase().replace(' ', '')}?post=${selectedProject.id}`); }} 
                    style={{ background: 'transparent', border: `1px solid ${colors.primary}`, color: colors.primary, padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease-in-out' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.primary; }}>
                    <User size={16} /> Visualizar no perfil
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {selectedProject.links?.deploy && <SocialButton href={selectedProject.links.deploy} icon={ExternalLink} title="Site do Projeto" />}
                    {selectedProject.links?.github && <SocialButton href={selectedProject.links.github} icon={Github} title="GitHub do Projeto" />}
                    {selectedProject.links?.linkedin && <SocialButton href={selectedProject.links.linkedin} icon={Linkedin} title="LinkedIn da Publicação" />}
                  </div>
                </div>

                <div style={{ background: theme === 'light' ? '#f8fafc' : '#1e293b', padding: '15px', borderRadius: '12px', border: `1px solid ${colors.border}`, fontSize: '13px', color: colors.textMuted, marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Clock size={14} /> <strong>Publicado em:</strong> {selectedProject.publishedAt}</div>
                  {selectedProject.updatedAt && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> <strong>Atualizado em:</strong> {selectedProject.updatedAt}</div>)}
                </div>
                
                {/* AUTOR DO PROJETO */}
                <div style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, padding: '20px 0', display: 'flex', alignItems: 'center' }}>
                  <div onMouseEnter={() => setHoveredModalAuthor(true)} onMouseLeave={() => setHoveredModalAuthor(false)} onClick={() => { setSelectedProject(null); navigate(`/profile/${selectedProject.author.name.toLowerCase().replace(' ', '')}`); }}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '16px', background: hoveredModalAuthor ? (theme === 'light' ? '#f1f5f9' : '#1e293b') : 'transparent', transition: 'background 0.2s ease', width: '100%' }}
                  >
                    <img src={selectedProject.author.avatar} alt="User" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: colors.primary, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {selectedProject.author.name} {selectedProject.author.verified && <BadgeCheck size={14} color={colors.primary} />}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textMuted }}>Autor da publicação</div>
                    </div>

                    {hoveredModalAuthor && (
                      <div style={{ position: 'absolute', bottom: '100%', left: 0, paddingBottom: '10px', zIndex: 100, width: '320px' }}>
                        <div onClick={(e) => e.stopPropagation()} style={{ background: theme === 'light' ? '#ffffff' : colors.card, border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <img src={selectedProject.author.avatar} alt="User" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', background: colors.primary }} />
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {selectedProject.author.name} {selectedProject.author.verified && <BadgeCheck size={14} color={colors.primary} />}
                              </div>
                              <div style={{ fontSize: '12px', color: colors.textMuted }}>@{selectedProject.author.name.toLowerCase().replace(' ', '')}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: colors.textMuted, marginBottom: '20px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={14}/> {selectedProject.author.role}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={14}/> {selectedProject.author.education}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {selectedProject.author.github && <SocialButton href={selectedProject.author.github} icon={Github} label="GitHub" />}
                            {selectedProject.author.linkedin && <SocialButton href={selectedProject.author.linkedin} icon={Linkedin} label="LinkedIn" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECÇÃO DE COMENTÁRIOS */}
                <div style={{ marginTop: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px', color: colors.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageCircle size={16} /> Comentários ({selectedProject.commentsList?.length || 0})
                  </h4>
                  
                  {/* Lista de Comentários */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                    {selectedProject.commentsList?.length > 0 ? (
                      selectedProject.commentsList.map((c: any) => (
                        <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                          <img src={c.avatar} alt={c.author} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ background: theme === 'light' ? '#f1f5f9' : '#1e293b', padding: '12px 16px', borderRadius: '0 16px 16px 16px', flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '4px', color: colors.text }}>{c.author}</div>
                            <div style={{ fontSize: '13px', color: colors.textMuted, lineHeight: '1.5' }}>{c.text}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '13px', padding: '20px 0', fontStyle: 'italic' }}>
                        Seja o primeiro a comentar neste projeto!
                      </div>
                    )}
                  </div>

                  {/* Input de Novo Comentário */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={user?.picture || defaultGoogleAvatar} alt="You" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flex: 1, background: theme === 'light' ? '#f8fafc' : '#0f172a', border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '4px 6px 4px 16px' }}>
                      <input 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        placeholder="Adicionar um comentário..." 
                        style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '13px', color: colors.text, outline: 'none' }} 
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(selectedProject.id)} 
                      />
                      <button 
                        onClick={() => handleAddComment(selectedProject.id)} 
                        style={{ background: newComment.trim() ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: '800', cursor: newComment.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                        disabled={!newComment.trim()}
                      >
                        <Send size={14} /> <span style={{ fontSize: '12px' }}>Enviar</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}