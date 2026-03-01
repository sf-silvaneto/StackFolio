import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, ExternalLink, X, TrendingUp, Clock, Eye, ThumbsUp, User, Sun, Moon, LogOut, LayoutDashboard, Briefcase, GraduationCap, Play, Filter, ChevronDown, Search, Bookmark, BadgeCheck, Layers, XCircle, MessageCircle, Send, Grid3x3, LayoutList, Terminal, Cpu, Globe, CheckCircle, Wrench, Lightbulb, Share2, Link as LinkIcon, Twitter } from 'lucide-react';

// Componente inteligente para lidar com ícones de skills (incluindo correções de slugs)
const SkillIcon = ({ slug, size, isActive, fallbackColor }: { slug: string, size: number, isActive?: boolean, fallbackColor?: string }) => {
  const [error, setError] = useState(false);
  
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower === 'wsl') return 'linux';
    if (lower === 'aws' || lower === 'amazon web services') return 'amazonaws';
    if (lower === 'c++') return 'cplusplus';
    if (lower === 'node.js' || lower === 'nodejs') return 'nodedotjs';
    return lower;
  };

  const finalSlug = getCorrectSlug(slug);
  
  if (error || !finalSlug) {
    return <Terminal size={size} color={isActive ? '#fff' : fallbackColor} />;
  }

  return (
    <img 
      src={`https://cdn.simpleicons.org/${finalSlug}`} 
      style={{ width: size, height: size, filter: isActive ? 'brightness(0) invert(1)' : 'none', objectFit: 'contain', display: 'block' }} 
      alt={slug} 
      onError={() => setError(true)} 
    />
  );
};

export function HomePage() {
  const { theme, toggleTheme, colors } = useTheme();
  const { signed, user, signInGoogle, signOut } = useAuth() as any; 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [newComment, setNewComment] = useState(''); 

  // Estados para Visualização e Filtros Extra
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  // Estados para Compartilhamento
  const [sharingProject, setSharingProject] = useState<number | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeSoftSkills, setActiveSoftSkills] = useState<string[]>([]);
  
  // Estados para busca DENTRO dos filtros
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [softSkillSearchQuery, setSoftSkillSearchQuery] = useState('');

  // Estados para controlar os balões flutuantes (hover)
  const [hoveredModalAuthor, setHoveredModalAuthor] = useState(false);
  const [hoveredFeedAuthor, setHoveredFeedAuthor] = useState<number | null>(null);
  const [hoveredHardSkills, setHoveredHardSkills] = useState<number | null>(null);
  const [hoveredSoftSkills, setHoveredSoftSkills] = useState<number | null>(null);
  const [hoveredSuggestedUser, setHoveredSuggestedUser] = useState<string | null>(null); 

  const defaultGoogleAvatar = "https://lh3.googleusercontent.com/a/default-user=s96-c";

  const suggestedUsers = [
    { name: 'Alif', avatar: defaultGoogleAvatar, role: 'Desenvolvedor Backend & IoT', education: 'Engenharia de Software', github: 'https://github.com', linkedin: 'https://linkedin.com', verified: false, totalLikes: 340, bio: 'Desenvolvedor focado em IoT, automação residencial e sistemas embarcados de alta eficiência.' },
    { name: 'Ramiro', avatar: defaultGoogleAvatar, role: 'Fullstack Developer', education: 'Ciência da Computação', github: 'https://github.com', linkedin: 'https://linkedin.com', verified: true, totalLikes: 890, bio: 'Especialista em arquitetura de microsserviços, alta escalabilidade e infraestrutura Cloud robusta.' }
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
      saves: 85,
      isLiked: false,
      isSaved: false,
      commentsList: [
        { id: 1, author: 'Ramiro', text: 'Top demais! Excelente topologia.', avatar: defaultGoogleAvatar }
      ],
      links: { deploy: "https://google.com", github: "https://github.com", linkedin: "https://linkedin.com" }, 
      difficulty: "Avançado",
      status: "Concluído",
      author: {
        name: "Silva Neto",
        avatar: defaultGoogleAvatar,
        role: "Engenheiro de Redes & IoT",
        education: "Engenharia de Computação",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        verified: true,
        totalLikes: 1250,
        bio: "Especialista em infraestrutura de redes corporativas e entusiasta de soluções IoT para automação."
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
        { name: "C++", slug: "cplusplus" }, { name: "Jira", slug: "jira" }, { name: "DBeaver", slug: "dbeaver" }, { name: "Node.js", slug: "nodedotjs" }, { name: "React", slug: "react" }, { name: "WSL", slug: "wsl" }
      ],
      softSkills: ["Trabalho em Equipe", "Criatividade", "Gestão de Tempo", "Foco em Resultados", "Scrum", "Lógica"],
      upvotes: 120,
      views: 560,
      saves: 34,
      isLiked: false,
      isSaved: true,
      commentsList: [],
      links: { deploy: "https://google.com", github: "https://github.com", linkedin: "https://linkedin.com" }, 
      difficulty: "Intermediário",
      status: "Em Desenvolvimento",
      author: {
        name: "Alif",
        avatar: defaultGoogleAvatar,
        role: "Desenvolvedor Backend & IoT",
        education: "Engenharia de Software",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        verified: false,
        totalLikes: 340,
        bio: "Desenvolvedor focado em IoT, automação residencial e sistemas embarcados de alta eficiência."
      }
    },
    {
      id: 3,
      title: "Plataforma SaaS para Agendamentos",
      description: "Sistema web completo para gestão de clínicas, desenvolvido com React, Node e Prisma.",
      publishedAt: "02 de Março de 2026 às 14:00",
      timestamp: 1772362000000, 
      updatedAt: null,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      gallery: [],
      videoUrl: null, 
      skills: [{ name: "React", slug: "react" }, { name: "Node.js", slug: "nodedotjs" }, { name: "Prisma", slug: "prisma" }],
      softSkills: ["Empreendedorismo", "Design Thinking", "Clean Code"],
      upvotes: 85,
      views: 320,
      saves: 15,
      isLiked: false,
      isSaved: false,
      commentsList: [],
      links: { github: "https://github.com" }, 
      difficulty: "Avançado",
      status: "Apenas Ideia",
      author: { 
        name: "Ramiro", 
        avatar: defaultGoogleAvatar, 
        role: "Fullstack Developer", 
        education: "Ciência da Computação", 
        github: "https://github.com", 
        linkedin: "https://linkedin.com", 
        verified: true,
        totalLikes: 890, 
        bio: "Especialista em arquitetura de microsserviços, alta escalabilidade e infraestrutura Cloud robusta." 
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
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isSaved: !p.isSaved, saves: !p.isSaved ? p.saves + 1 : p.saves - 1 } : p));
    if (selectedProject?.id === projectId) setSelectedProject((prev: any) => ({ ...prev, isSaved: !prev.isSaved, saves: !prev.isSaved ? prev.saves + 1 : prev.saves - 1 }));
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

  // Funções de Compartilhamento
  const handleCopyLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const link = `${window.location.origin}/project/${id}`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
    setSharingProject(null);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, proj: any) => {
    e.stopPropagation();
    const link = `${window.location.origin}/project/${proj.id}`;
    window.open(`https://api.whatsapp.com/send?text=Confira este projeto incrível: ${encodeURIComponent(proj.title)} - ${encodeURIComponent(link)}`, '_blank');
    setSharingProject(null);
  };

  const handleShareTwitter = (e: React.MouseEvent, proj: any) => {
    e.stopPropagation();
    const link = `${window.location.origin}/project/${proj.id}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(proj.title)}`, '_blank');
    setSharingProject(null);
  };

  const clearFilters = () => {
    setActiveSkills([]);
    setActiveSoftSkills([]);
    setActiveDifficulty(null);
    setActiveStatus(null);
  };

  // Mapeamento de Skills para Ícones
  const availableSkillsMap = new Map<string, string>();
  projects.forEach(p => p.skills.forEach(s => {
    if (!availableSkillsMap.has(s.name)) availableSkillsMap.set(s.name, s.slug);
  }));
  const availableSkills = Array.from(availableSkillsMap.keys());
  
  const availableSoftSkills = Array.from(new Set(projects.flatMap(p => p.softSkills)));
  const totalActiveFilters = activeSkills.length + activeSoftSkills.length + (activeDifficulty ? 1 : 0) + (activeStatus ? 1 : 0);

  const filteredAvailableSkills = availableSkills.filter(s => s.toLowerCase().includes(skillSearchQuery.toLowerCase()));
  const filteredAvailableSoftSkills = availableSoftSkills.filter(s => s.toLowerCase().includes(softSkillSearchQuery.toLowerCase()));

  const searchSuggestions = searchQuery ? availableSkills.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : [];

  const processedProjects = projects
    .filter(p => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.skills.some(sk => sk.name.toLowerCase().includes(q)) || p.softSkills.some(ssk => ssk.toLowerCase().includes(q));
    })
    .filter(p => !activeDifficulty || p.difficulty === activeDifficulty)
    .filter(p => !activeStatus || p.status === activeStatus)
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Concluído': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: CheckCircle };
      case 'Em Desenvolvimento': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Wrench };
      case 'Apenas Ideia': return { color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)', icon: Lightbulb };
      default: return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', icon: LayoutDashboard };
    }
  };

  const getDifficultyConfig = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return { color: '#10b981', border: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'Intermediário': return { color: '#f59e0b', border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'Avançado': return { color: '#ef4444', border: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      default: return { color: colors.textMuted, border: colors.border, bg: galleryBgColor };
    }
  };

  // Componente de Pré-visualização de Perfil Unificado
  const renderProfileHoverCard = (authorData: any, closeHover: () => void) => (
    <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '10px', zIndex: 100, width: '320px', cursor: 'default' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme === 'light' ? '#ffffff' : colors.card, border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
          <img src={authorData.avatar} alt="User" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: colors.primary }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {authorData.name} {authorData.verified && <BadgeCheck size={14} color={colors.primary} />}
            </div>
            <div style={{ fontSize: '12px', color: colors.textMuted }}>@{authorData.name.toLowerCase().replace(' ', '')}</div>
          </div>
        </div>
        
        {authorData.bio && (
          <p style={{ fontSize: '13px', color: colors.text, marginBottom: '15px', lineHeight: '1.5' }}>{authorData.bio}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: colors.textMuted, marginBottom: '20px', paddingBottom: '15px', borderBottom: `1px solid ${colors.border}` }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14}/> {authorData.role}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={14}/> {authorData.education}</span>
          {authorData.totalLikes !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsUp size={14}/> <strong>{authorData.totalLikes}</strong> curtidas recebidas</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          {authorData.github && <SocialButton href={authorData.github} icon={Github} label="GitHub" />}
          {authorData.linkedin && <SocialButton href={authorData.linkedin} icon={Linkedin} label="LinkedIn" />}
        </div>

        <button onClick={() => { closeHover(); navigate(`/profile/${authorData.name.toLowerCase().replace(' ', '')}`); }} style={{ width: '100%', padding: '10px', background: colors.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
          <User size={16} /> Visualizar Perfil
        </button>
      </div>
    </div>
  );

  // Componente de Popover de Compartilhamento Unificado
  const renderShareMenu = (proj: any) => (
    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '12px', display: 'flex', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 100, width: 'max-content' }}>
      <button onClick={(e) => handleCopyLink(e, proj.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: '11px', fontWeight: '800' }}>
        <div style={{ background: '#64748b20', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LinkIcon size={18} /></div>
        Copiar Link
      </button>
      <button onClick={(e) => handleShareWhatsApp(e, proj)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: '11px', fontWeight: '800' }}>
        <div style={{ background: '#10b98120', color: '#10b981', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={18} /></div>
        WhatsApp
      </button>
      <button onClick={(e) => handleShareTwitter(e, proj)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text, fontSize: '11px', fontWeight: '800' }}>
        <div style={{ background: '#0ea5e920', color: '#0ea5e9', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Twitter size={18} /></div>
        Twitter
      </button>
    </div>
  );

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* OVERLAY INVISÍVEL PARA FECHAR MENU DE COMPARTILHAMENTO AO CLICAR FORA */}
      {sharingProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={(e) => { e.stopPropagation(); setSharingProject(null); }}></div>
      )}

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
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '15px 0', background: theme === 'light' ? '#cbd5e1' : colors.card, position: 'sticky', top: 0, zIndex: 80 }}>
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
              
              {isSearchFocused && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '15px', zIndex: 110, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  
                  {searchQuery && searchSuggestions.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Sistemas Sugeridos</div>
                      {searchSuggestions.map(s => (
                        <div key={s} onClick={() => setSearchQuery(s)} style={{ fontSize: '13px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.background = galleryBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                          <Terminal size={14} color={colors.primary} /> {s}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: theme === 'light' ? 'rgba(241, 245, 249, 0.8)' : 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '24px', border: `1px solid ${colors.border}` }}>
                    <button onClick={() => setActiveTab('trending')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: activeTab === 'trending' ? colors.primary : 'transparent', border: 'none', borderRadius: '18px', color: activeTab === 'trending' ? '#ffffff' : colors.textMuted, fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <TrendingUp size={18}/> Em Alta
                    </button>
                    <span style={{ color: colors.border, margin: '0 4px', fontWeight: '900' }}>|</span>
                    <button onClick={() => setActiveTab('recent')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: activeTab === 'recent' ? colors.primary : 'transparent', border: 'none', borderRadius: '18px', color: activeTab === 'recent' ? '#ffffff' : colors.textMuted, fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <Clock size={18}/> Recentes
                    </button>
                  </div>

                  {/* MODO DE VISUALIZAÇÃO (GRID / LIST) */}
                  <div style={{ display: 'flex', gap: '5px', background: colors.card, border: `1px solid ${colors.border}`, padding: '4px', borderRadius: '14px' }}>
                    <button onClick={() => setViewMode('grid')} style={{ padding: '8px', background: viewMode === 'grid' ? galleryBgColor : 'transparent', border: 'none', borderRadius: '10px', cursor: 'pointer', color: viewMode === 'grid' ? colors.primary : colors.textMuted, transition: 'all 0.2s' }} title="Visualização em Grelha">
                      <Grid3x3 size={18} />
                    </button>
                    <button onClick={() => setViewMode('list')} style={{ padding: '8px', background: viewMode === 'list' ? galleryBgColor : 'transparent', border: 'none', borderRadius: '10px', cursor: 'pointer', color: viewMode === 'list' ? colors.primary : colors.textMuted, transition: 'all 0.2s' }} title="Visualização em Lista">
                      <LayoutList size={18} />
                    </button>
                  </div>
                </div>

              </div>

              {/* PAINEL OCULTO DE FILTROS APROFUNDADOS */}
              {showFilters && (
                <div style={{ background: theme === 'light' ? '#f8fafc' : '#1e293b', padding: '25px', borderRadius: '20px', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeInDown 0.3s ease-out' }}>
                  
                  {/* FILTROS STATUS */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '15px' }}>Status do Projeto</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Concluído', 'Em Desenvolvimento', 'Apenas Ideia'].map(st => {
                        const config = getStatusConfig(st);
                        const isActive = activeStatus === st;
                        return (
                          <button key={st} onClick={() => setActiveStatus(activeStatus === st ? null : st)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isActive ? config.bg : galleryBgColor, color: isActive ? config.color : textColor, border: `1px solid ${isActive ? config.color : colors.border}`, padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {React.createElement(config.icon, { size: 14 })} {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ height: '1px', width: '100%', background: colors.border }}></div>

                  {/* FILTROS DIFICULDADE (COLORIDOS) */}
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '15px' }}>Nível de Dificuldade</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Iniciante', 'Intermediário', 'Avançado'].map(diff => {
                        const diffColors = getDifficultyConfig(diff);
                        const isActive = activeDifficulty === diff;
                        return (
                          <button key={diff} onClick={() => setActiveDifficulty(activeDifficulty === diff ? null : diff)} style={{ background: isActive ? diffColors.bg : galleryBgColor, color: isActive ? diffColors.color : textColor, border: `1px solid ${isActive ? diffColors.border : colors.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {diff}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ height: '1px', width: '100%', background: colors.border }}></div>

                  {/* FILTROS SISTEMAS COM ÍCONES */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><LayoutDashboard size={14}/> Sistemas e Ferramentas</h4>
                      <div style={{ position: 'relative' }}>
                        <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                        <input type="text" placeholder="Procurar sistema..." value={skillSearchQuery} onChange={(e) => setSkillSearchQuery(e.target.value)} style={{ background: galleryBgColor, border: `1px solid ${colors.border}`, padding: '6px 12px 6px 30px', borderRadius: '8px', fontSize: '12px', color: textColor, outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
                      {filteredAvailableSkills.map(skill => {
                        const isActive = activeSkills.includes(skill);
                        const slug = availableSkillsMap.get(skill) || '';
                        return (
                          <button key={skill} onClick={() => setActiveSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isActive ? colors.primary : galleryBgColor, color: isActive ? '#fff' : textColor, border: `1px solid ${isActive ? colors.primary : colors.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <SkillIcon slug={slug} size={14} isActive={isActive} fallbackColor={colors.textMuted} />
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', width: '100%', background: colors.border }}></div>
                  
                  {/* FILTROS SOFT SKILLS */}
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

            {/* LISTA / GRID DE PROJETOS */}
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: '30px' }}>
              {processedProjects.map(proj => {
                
                const visibleHard = viewMode === 'grid' ? proj.skills.slice(0, 3) : proj.skills.slice(0, 6);
                const hiddenHard = viewMode === 'grid' ? proj.skills.slice(3, 10) : proj.skills.slice(6, 10);
                
                const visibleSoft = viewMode === 'grid' ? proj.softSkills.slice(0, 2) : proj.softSkills.slice(0, 5);
                const hiddenSoft = viewMode === 'grid' ? proj.softSkills.slice(2, 10) : proj.softSkills.slice(5, 10);

                const statusInfo = getStatusConfig(proj.status || 'Concluído');

                return (
                  <article 
                    key={proj.id} onClick={() => setSelectedProject(proj)} 
                    style={{ background: colors.card, borderRadius: '24px', border: `1px solid ${colors.border}`, cursor: 'pointer', display: 'flex', flexDirection: viewMode === 'grid' ? 'column' : 'row', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', zIndex: (hoveredFeedAuthor === proj.id || sharingProject === proj.id) ? 50 : 1 }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    
                    {/* CAPA DE MÍDIA COM INDICADORES */}
                    <div style={{ width: viewMode === 'grid' ? '100%' : '320px', aspectRatio: '16/10', borderTopLeftRadius: '24px', borderTopRightRadius: viewMode === 'grid' ? '24px' : '0', borderBottomLeftRadius: viewMode === 'list' ? '24px' : '0', overflow: 'hidden', position: 'relative', backgroundColor: '#000', flexShrink: 0 }}>
                      {proj.videoUrl ? (
                        <>
                          <video src={proj.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '12px', borderRadius: '50%', display: 'flex', pointerEvents: 'none' }}><Play size={24} fill="#fff" color="#fff" /></div>
                        </>
                      ) : (
                        <>
                          <img src={proj.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                        </>
                      )}

                      {/* BADGE DE STATUS */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: statusInfo.bg, backdropFilter: 'blur(4px)', border: `1px solid ${statusInfo.color}40`, color: statusInfo.color, padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                        <statusInfo.icon size={14} /> {proj.status}
                      </div>

                      {/* INDICADOR MULTI-IMAGENS */}
                      {proj.gallery.length > 0 && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '11px', fontWeight: '800', pointerEvents: 'none' }}>
                          <Layers size={14} /> +{proj.gallery.length}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, borderBottomLeftRadius: viewMode === 'grid' ? '24px' : '0', borderBottomRightRadius: '24px', borderTopRightRadius: viewMode === 'list' ? '24px' : '0' }}>
                      
                      {/* Autor e Data */}
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

                          {hoveredFeedAuthor === proj.id && renderProfileHoverCard(proj.author, () => setHoveredFeedAuthor(null))}
                        </div>
                        <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '700' }}>{proj.publishedAt.split(' às')[0]}</span>
                      </div>

                      {/* Título e Descrição */}
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 8px 0', lineHeight: '1.2' }}>{proj.title}</h3>
                        <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0, display: '-webkit-box', WebkitLineClamp: viewMode === 'list' ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>{proj.description}</p>
                      </div>

                      {/* Skills (Sistemas e Soft Skills separados em blocos) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', flex: 1 }}>
                        
                        {/* Wrapper Sistemas e Ferramentas */}
                        {proj.skills.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {visibleHard.map((s: any) => (
                              <div key={s.name} title={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: galleryBgColor, padding: '4px 10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                                <SkillIcon slug={s.slug} size={12} fallbackColor={textColor} />
                                <span style={{ fontSize: '11px', fontWeight: '800', color: textColor }}>{s.name}</span>
                              </div>
                            ))}
                            {hiddenHard.length > 0 && (
                              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.stopPropagation(); setHoveredHardSkills(proj.id); }} onMouseLeave={(e) => { e.stopPropagation(); setHoveredHardSkills(null); }}>
                                <span style={{ fontSize: '10px', fontWeight: '800', background: 'transparent', color: colors.textMuted, padding: '4px 8px', borderRadius: '6px', border: `1px dashed ${colors.textMuted}`, cursor: 'help' }}>+{hiddenHard.length}</span>
                                {hoveredHardSkills === proj.id && (
                                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, width: 'max-content' }}>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '200px' }}>
                                      {hiddenHard.map((hs: any) => (
                                        <div key={hs.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: galleryBgColor, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${colors.border}` }}>
                                          <SkillIcon slug={hs.slug} size={12} fallbackColor={textColor} />
                                          <span style={{ fontSize: '11px', fontWeight: '800', color: textColor }}>{hs.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Wrapper Palavras-chave (Soft Skills) */}
                        {proj.softSkills.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {visibleSoft.map((ss: string) => {
                              const style = getSoftSkillColor(ss);
                              return (
                                <span key={ss} style={{ fontSize: '10px', fontWeight: '800', background: style.bg, color: style.text, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${style.border}` }}>#{ss}</span>
                              );
                            })}
                            {hiddenSoft.length > 0 && (
                              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.stopPropagation(); setHoveredSoftSkills(proj.id); }} onMouseLeave={(e) => { e.stopPropagation(); setHoveredSoftSkills(null); }}>
                                <span style={{ fontSize: '10px', fontWeight: '800', background: 'transparent', color: colors.textMuted, padding: '4px 8px', borderRadius: '6px', border: `1px dashed ${colors.textMuted}`, cursor: 'help' }}>+{hiddenSoft.length}</span>
                                {hoveredSoftSkills === proj.id && (
                                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: theme === 'light' ? '#fff' : colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, width: 'max-content' }}>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '200px' }}>
                                      {hiddenSoft.map((hss: string) => {
                                        const sStyle = getSoftSkillColor(hss);
                                        return (
                                          <span key={hss} style={{ fontSize: '10px', fontWeight: '800', background: sStyle.bg, color: sStyle.text, padding: '4px 8px', borderRadius: '6px', border: `1px solid ${sStyle.border}` }}>#{hss}</span>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AÇÕES (Views, Likes, Comentários, Compartilhar) | Favorito */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginTop: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px', color: colors.textMuted, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800' }} title="Visualizações"><Eye size={16}/> {proj.views}</div>
                          
                          <button onClick={(e) => handleLike(e, proj.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: proj.isLiked ? colors.primary : colors.textMuted, fontWeight: '900', fontSize: '13px', transition: 'color 0.2s', padding: 0, margin: 0 }} title="Curtir">
                            <ThumbsUp size={16} fill={proj.isLiked ? colors.primary : 'none'} /> {proj.upvotes}
                          </button>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800' }} title="Comentários"><MessageCircle size={16}/> {proj.commentsList?.length || 0}</div>
                          
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <button onClick={(e) => { e.stopPropagation(); setSharingProject(sharingProject === proj.id ? null : proj.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textMuted, display: 'flex', alignItems: 'center', transition: 'color 0.2s', padding: 0, margin: 0 }} title="Compartilhar">
                              <Share2 size={16} />
                            </button>
                            {sharingProject === proj.id && renderShareMenu(proj)}
                          </div>
                        </div>

                        <button onClick={(e) => handleBookmark(e, proj.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: proj.isSaved ? '#eab308' : colors.textMuted, padding: 0, margin: 0, transition: 'all 0.2s', transform: proj.isSaved ? 'scale(1.05)' : 'scale(1)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '13px' }} title={proj.isSaved ? "Remover dos guardados" : "Guardar projeto"}>
                          <Bookmark size={16} fill={proj.isSaved ? '#eab308' : 'none'} /> {proj.saves}
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
              
              {/* BLOCO 1: PERFIS EM DESTAQUE COM PRÉ-VISUALIZAÇÃO (HOVER) */}
              <div style={{ background: colors.card, padding: '30px', borderRadius: '28px', border: `1px solid ${colors.border}` }}>
                <h3 style={{ fontSize: '16px', marginBottom: '25px', fontWeight: '900', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color={colors.primary} /> Perfis em Destaque
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {suggestedUsers.map(u => (
                    <div 
                      key={u.name} 
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', zIndex: hoveredSuggestedUser === u.name ? 50 : 1 }}
                      onMouseEnter={() => setHoveredSuggestedUser(u.name)}
                      onMouseLeave={() => setHoveredSuggestedUser(null)}
                    >
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

                      {/* POPOVER DE PRÉ-VISUALIZAÇÃO DO PERFIL */}
                      {hoveredSuggestedUser === u.name && renderProfileHoverCard(u, () => setHoveredSuggestedUser(null))}
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
                        <SkillIcon slug={tag.slug} size={12} isActive={isActive} fallbackColor={textColor} />
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
      <footer style={{ background: theme === 'light' ? '#f8fafc' : '#1a1a1a', color: colors.textMuted, padding: '3rem 1rem', display: 'flex', justifyContent: 'center', marginTop: 'auto', borderTop: `1px solid ${colors.border}` }}>
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

                {/* Hard Skills Modal */}
                <div>
                   <h4 style={{ color: textColor, marginBottom: '15px', fontSize: '13px', fontWeight: '900', opacity: 0.8 }}>SISTEMAS E FERRAMENTAS</h4>
                   <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedProject.skills.map((skill: any) => (
                      <div key={skill.name} style={{ background: colors.card, border: `1px solid ${colors.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}>
                        <SkillIcon slug={skill.slug} size={18} fallbackColor={textColor} />
                        <div style={{fontSize: '12px', fontWeight: '800', color: textColor}}>{skill.name}</div>
                      </div>
                    ))}
                   </div>
                </div>

                {/* Soft Skills Modal */}
                <div>
                   <h4 style={{ color: textColor, marginBottom: '15px', fontSize: '13px', fontWeight: '900', opacity: 0.8 }}>PALAVRAS CHAVES / SOFT SKILLS</h4>
                   <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProject.softSkills.map((ss: string) => {
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
              <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
                
                {/* Cabeçalho do Lado Direito: Tags Alinhadas à Esquerda */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', paddingRight: '10px', gap: '15px' }}>
                  
                  {/* Status e Tag Destaque */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.primary, fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', background: `${colors.primary}15`, padding: '6px 12px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                      {activeTab === 'trending' ? <><TrendingUp size={14}/> EM ALTA</> : <><Clock size={14}/> RECENTE</>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: getStatusConfig(selectedProject.status || 'Concluído').bg, color: getStatusConfig(selectedProject.status || 'Concluído').color, padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', whiteSpace: 'nowrap' }}>
                      {React.createElement(getStatusConfig(selectedProject.status || 'Concluído').icon, { size: 14 })} {selectedProject.status}
                    </div>
                  </div>
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1' }}>{selectedProject.title}</h2>
                <p style={{ color: colors.text, fontWeight: '400', lineHeight: '1.8', fontSize: '16px', marginBottom: '25px' }}>{selectedProject.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setSelectedProject(null); navigate(`/profile/${selectedProject.author.name.toLowerCase().replace(' ', '')}?post=${selectedProject.id}`); }} 
                    style={{ background: 'transparent', border: `2px solid ${colors.primary}`, color: colors.primary, padding: '8px 16px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease-in-out' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.primary; }}>
                    <User size={16} /> Visualizar no perfil
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {selectedProject.links?.deploy && <SocialButton href={selectedProject.links.deploy} icon={ExternalLink} title="Site do Projeto" />}
                    {selectedProject.links?.github && <SocialButton href={selectedProject.links.github} icon={Github} title="GitHub do Projeto" />}
                    {selectedProject.links?.linkedin && <SocialButton href={selectedProject.links.linkedin} icon={Linkedin} title="LinkedIn da Publicação" />}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: theme === 'light' ? '#f8fafc' : '#1e293b', padding: '15px 20px', borderRadius: '16px', border: `1px solid ${colors.border}`, fontSize: '13px', color: colors.textMuted, marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> <strong>Publicado em:</strong> {selectedProject.publishedAt}</div>
                  {selectedProject.updatedAt && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> <strong>Atualizado em:</strong> {selectedProject.updatedAt}</div>)}
                </div>
                
                {/* AUTOR DO PROJETO NO MODAL */}
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

                    {hoveredModalAuthor && renderProfileHoverCard(selectedProject.author, () => setHoveredModalAuthor(false))}
                  </div>
                </div>

                {/* AÇÕES NO MODAL (Views, Likes, Comentários, Compartilhar) | Favorito */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${colors.border}`, marginBottom: '25px' }}>
                  <div style={{ display: 'flex', gap: '25px', color: colors.textMuted, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '800' }} title="Visualizações"><Eye size={20}/> {selectedProject.views}</div>
                    
                    <button onClick={(e) => handleLike(e, selectedProject.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: selectedProject.isLiked ? colors.primary : colors.textMuted, fontWeight: '900', fontSize: '15px', padding: 0, margin: 0 }} title="Curtir">
                      <ThumbsUp size={20} fill={selectedProject.isLiked ? colors.primary : 'none'} /> {selectedProject.upvotes}
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '800' }} title="Comentários"><MessageCircle size={20}/> {selectedProject.commentsList?.length || 0}</div>
                    
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <button onClick={(e) => { e.stopPropagation(); setSharingProject(sharingProject === selectedProject.id ? null : selectedProject.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }} title="Compartilhar">
                        <Share2 size={20} />
                      </button>
                      {sharingProject === selectedProject.id && renderShareMenu(selectedProject)}
                    </div>
                  </div>

                  {/* Favoritar do Modal no extremo direito inferior */}
                  <button onClick={(e) => handleBookmark(e, selectedProject.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: selectedProject.isSaved ? '#eab308' : colors.textMuted, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', fontSize: '15px', padding: 0, margin: 0, transition: 'all 0.2s', transform: selectedProject.isSaved ? 'scale(1.05)' : 'scale(1)' }} title={selectedProject.isSaved ? "Remover dos guardados" : "Guardar projeto"}>
                    <Bookmark size={20} fill={selectedProject.isSaved ? '#eab308' : 'none'} /> {selectedProject.saves}
                  </button>
                </div>

                {/* SECÇÃO DE COMENTÁRIOS */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px', color: colors.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageCircle size={16} /> Deixe um comentário
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