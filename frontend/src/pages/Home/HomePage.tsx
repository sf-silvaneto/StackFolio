import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, ExternalLink, X, TrendingUp, Clock, MapPin, ChevronRight, Eye, ThumbsUp, BookOpen, ChevronRight as ArrowRight, Sun, Moon } from 'lucide-react';

export function HomePage() {
  const { theme, toggleTheme, colors } = useTheme();
  const { signed, user, signInGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  const handleSuccess = async (res: any) => {
    if (res.credential) {
      try { await signInGoogle(res.credential); } catch (error) { console.error(error); }
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const mockProjects = [
    {
      id: 1,
      title: "Arquitetura Hierárquica: Matriz e Filiais",
      description: "Este projeto apresenta uma simulação robusta de infraestrutura corporativa conectando uma sede administrativa a duas filiais operacionais através do Cisco Packet Tracer. O foco principal é a segmentação de tráfego e a alta disponibilidade de rede.",
      fullDocumentation: "DETALHAMENTO TÉCNICO:\n\n1. Protocolos: OSPF Area 0 para roteamento dinâmico interno.\n2. Segurança: ACLs estendidas para bloqueio de tráfego entre VLAN de visitantes e servidores.\n3. Redundância: Configuração de HSRP para Gateway redundante.\n4. Serviços: Servidores DNS, DHCP e HTTP ativos para simulação completa.",
      author: "Silva Neto",
      publishedAt: "28 de Fevereiro de 2026 às 23:55",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", 
      skills: [
        { name: "Cisco", slug: "cisco" },
        { name: "Python", slug: "python" },
        { name: "Figma", slug: "figma" }
      ],
      upvotes: 450,
      views: 1240,
      links: { github: "#", linkedin: "#", deploy: "#" }
    }
  ];

  const filteredProjects = mockProjects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

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

      {/* NAVBAR CENTRALIZADA (REFORMULADA) */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '15px 0', background: theme === 'light' ? '#cbd5e1' : colors.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="main-wrapper navbar-container">
          
          {/* ESQUERDA: NOME */}
          <div className="nav-left">
            <div className="logo-link" onClick={reloadPage}>
              <h2 style={{ margin: 0, color: colors.primary, fontWeight: '900', fontSize: '45px', letterSpacing: '-1px' }}>Stack Folio</h2>
            </div>
          </div>
          
          {/* CENTRO: BUSCA */}
          <div className="nav-center">
            <input 
              type="text" placeholder="Pesquisar projetos ou usuários..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* DIREITA: ACÕES E LOGIN */}
          <div className="nav-right">
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
              {!signed ? (
                <GoogleLogin onSuccess={handleSuccess} theme={theme === 'dark' ? 'filled_black' : 'filled_blue'} shape="pill" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>{user?.name?.[0]}</div>
                  <span style={{fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap'}}>{user?.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FEED */}
      <main className="main-wrapper" style={{ padding: '40px 20px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '50px' }}>
          <section>
            <div style={{ display: 'flex', gap: '25px', marginBottom: '35px', borderBottom: `1px solid ${colors.border}` }}>
              <button onClick={() => setActiveTab('trending')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0', background: 'none', border: 'none', color: activeTab === 'trending' ? colors.primary : colors.textMuted, borderBottom: activeTab === 'trending' ? `3px solid ${colors.primary}` : 'none', fontWeight: '800', cursor: 'pointer' }}><TrendingUp size={18}/> Em Alta</button>
              <button onClick={() => setActiveTab('recent')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0', background: 'none', border: 'none', color: activeTab === 'recent' ? colors.primary : colors.textMuted, borderBottom: activeTab === 'recent' ? `3px solid ${colors.primary}` : 'none', fontWeight: '800', cursor: 'pointer' }}><Clock size={18}/> Recentes</button>
            </div>
            {filteredProjects.map(proj => (
              <article key={proj.id} className="project-card" onClick={() => {setSelectedProject(proj); setShowDrawer(false);}} style={{ background: colors.card, borderRadius: '28px', border: `1px solid ${colors.border}`, overflow: 'hidden', cursor: 'pointer', marginBottom: '30px' }}>
                <img src={proj.image} style={{ width: '100%', height: '260px', objectFit: 'cover' }} alt="Banner" />
                <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{proj.title}</h3>
                  <div style={{ display: 'flex', gap: '15px', color: colors.textMuted }}><ThumbsUp size={16}/> {proj.upvotes} <Eye size={16}/> {proj.views}</div>
                </div>
              </article>
            ))}
          </section>

          <aside>
            <div style={{ background: colors.card, padding: '35px', borderRadius: '28px', border: `1px solid ${colors.border}`, position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '19px', marginBottom: '30px', fontWeight: '900', color: colors.primary }}>Sugestões</h3>
              {['Alif', 'Ramiro'].map(name => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff' }}>{name[0]}</div>
                  <div style={{ fontSize: '14px', fontWeight: '900' }}>{name}</div>
                  <ChevronRight size={18} style={{ color: colors.textMuted, marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ 
        backgroundColor: '#1a1a1a', /* Cor de fundo mais escura */
        color: '#9ca3af',           /* Cor do texto cinza claro */
        padding: '3rem 1rem', 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: 'auto',
        borderTop: '1px solid #333'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          
          <div style={{ fontSize: '0.875rem', textAlign: 'center' }}>
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            fontSize: '0.875rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            <a 
              href="termos" 
              style={{ color: '#9ca3af', textDecoration: 'none', cursor: 'pointer' }}
            >
              Termos de Serviço
            </a>
            
            <a 
              href="/privacidade" 
              style={{ color: '#9ca3af', textDecoration: 'none', cursor: 'pointer' }}
            >
              Política de Privacidade
            </a>
            
            <button 
              onClick={() => alert('Modal de Gerenciamento de Cookies em breve!')} 
              style={{ 
                color: '#9ca3af', 
                background: 'transparent', 
                border: 'none', 
                padding: 0, 
                fontSize: 'inherit', 
                cursor: 'pointer' 
              }}
            >
              Gerenciar Cookies
            </button>
          </div>
          
        </div>
      </footer>

      {/* MODAL (Silva Neto Edition) */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a' }}>
            <button className="close-modal-btn" onClick={() => setSelectedProject(null)}><X size={20}/></button>

            <div className={`tech-drawer ${showDrawer ? 'open' : ''}`}>
              <button onClick={() => setShowDrawer(false)} style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontWeight: '800' }}><ArrowRight size={24}/> Voltar</button>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Especificações Técnicas</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{selectedProject.fullDocumentation}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100%' }}>
              <div style={{ background: theme === 'light' ? '#cbd5e1' : '#000', padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px', borderRight: `1px solid ${colors.border}` }}>
                <h4 style={{ color: colors.text, margin: 0, fontSize: '12px', fontWeight: '900', opacity: 0.8 }}>GALERIA</h4>
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', background: '#000', cursor: 'pointer' }} onClick={() => setFullscreenImg(selectedProject.videoUrl)}>
                   <video src={selectedProject.videoUrl} style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedProject.gallery.map((img: string, i: number) => (
                    <img key={i} src={img} className="modal-gallery-img" onClick={() => setFullscreenImg(img)} alt="Thumb" />
                  ))}
                </div>
                <div>
                   <h4 style={{ color: colors.text, marginBottom: '15px', fontSize: '11px', fontWeight: '900', opacity: 0.6 }}>SISTEMAS</h4>
                   <div style={{ display: 'flex', gap: '10px' }}>
                    {selectedProject.skills.map((skill: any) => (
                      <div key={skill.name} className="skill-card">
                        <div style={{fontSize: '9px', fontWeight: '900', marginBottom: '5px', color: '#fff'}}>{skill.name}</div>
                        <img src={`https://cdn.simpleicons.org/${skill.slug}`} className="skill-logo" alt="Logo" />
                      </div>
                    ))}
                   </div>
                </div>
              </div>

              <div style={{ padding: '60px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.primary, fontWeight: '800', fontSize: '13px', marginBottom: '15px' }}>
                  {activeTab === 'trending' ? 'PROJETO EM ALTA' : 'PROJETO RECENTE'}
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1' }}>{selectedProject.title}</h2>
                <p style={{ color: colors.text, fontWeight: '400', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>{selectedProject.description}</p>
                <button onClick={() => setShowDrawer(true)} style={{ alignSelf: 'flex-start', background: 'none', border: `1px solid ${colors.primary}`, color: colors.primary, padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={16} /> Ver Documentação</button>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${colors.border}`, paddingTop: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>S</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '900' }}>{selectedProject.author}</div>
                      <div style={{ fontSize: '11px', color: colors.textMuted }}>{selectedProject.publishedAt}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href="#" className="icon-btn" data-name="Site"><ExternalLink size={18} /></a>
                    <a href="#" className="icon-btn" data-name="GitHub"><Github size={18} /></a>
                    <a href="#" className="icon-btn" data-name="LinkedIn"><Linkedin size={18} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}