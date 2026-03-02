import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  MapPin, Briefcase, Calendar, Link as LinkIcon, Github, Linkedin, Mail, 
  Edit3, Share2, PlusCircle, Terminal, Languages, BarChart, 
  GraduationCap, Cpu, Code, Sun, Moon, X, Camera, ImagePlus, ExternalLink
} from 'lucide-react';

const SkillIcon = ({ slug, size, fallbackColor }: { slug: string, size: number, fallbackColor?: string }) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    const map: Record<string, string> = {
      'wsl': 'linux', 'aws': 'amazonwebservices', 'gcp': 'googlecloud', 'c++': 'cplusplus', 'c#': 'csharp',
      'node.js': 'nodedotjs', 'vue.js': 'vuedotjs', 'next.js': 'nextdotjs', 'react native': 'react',
      'tailwind css': 'tailwindcss', '.net': 'dotnet', 'spring boot': 'springboot', 'adobe xd': 'adobexd', 
      'sql': 'mysql', 'java': 'openjdk', 'css3': 'css3', 'html5': 'html5', 'azure': 'microsoftazure', 'javascript': 'javascript'
    };
    return map[lower] || lower.replace(/[^a-z0-9]/g, '');
  };
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color={fallbackColor} />;
  return <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${finalSlug}.svg`} style={{ width: size, height: size, objectFit: 'contain' }} alt={slug} onError={() => setError(true)} />;
};

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth() as any;
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const isOwner = user?.username === username || (!username && user);

  useEffect(() => {
    const loadData = () => {
      if (isOwner && user) {
        setProfileData(user);
      } else {
        // Mock de visualização para teste
        setProfileData({
          fullName: "Silvestre Fernandes",
          displayName: "Silva Neto",
          username: username || "silvaneto",
          role: "Desenvolvedor Fullstack",
          location: "Mossoró - RN",
          availability: "Open to Work",
          seniority: "Júnior",
          englishLevel: "Avançado",
          bio: "Apaixonado por tecnologia e focado em criar soluções eficientes.",
          profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=silvestre",
          coverImg: "",
          tools: ["React", "Node.js", "TypeScript", "AWS"],
          education: [
            { id: 1, fieldOfStudy: "Ciência da Computação", institution: "Universidade Potiguar (UnP)", startMonth: "Fevereiro", startYear: "2024", endMonth: "Dezembro", endYear: "2027" }
          ],
          contacts: { github: "https://github.com/", linkedin: "https://linkedin.com/in/", publicEmail: "contato@stackfolio.com" }
        });
      }
      setLoading(false);
    };
    loadData();
  }, [username, user, isOwner]);

  if (!colors || loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <Cpu size={40} className="animate-spin" style={{ color: '#10b981' }} />
    </div>
  );

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      
      {/* NAVBAR */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '15px 0', background: colors.card, position: 'sticky', top: 0, zIndex: 80 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <h2 onClick={() => navigate('/')} style={{ margin: 0, color: colors.primary, fontWeight: '900', fontSize: '24px', letterSpacing: '-1px', cursor: 'pointer' }}>Stack Folio</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* HEADER DE PERFIL COM OPÇÕES DE EDIÇÃO */}
        <section style={{ position: 'relative', marginBottom: '80px' }}>
          <div style={{ height: '280px', background: profileData?.coverImg ? `url(${profileData.coverImg}) center/cover` : `linear-gradient(135deg, ${colors.primary}80, ${colors.primary})`, width: '100%', position: 'relative' }}>
            {isOwner && (
              <label style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(4px)' }}>
                <ImagePlus size={18} /> <span style={{ fontSize: '13px', fontWeight: '700' }}>Alterar Capa</span>
                <input type="file" hidden accept="image/*" />
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
                    <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: colors.primary, color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer', border: `4px solid ${pageBgColor}` }}>
                      <Camera size={18} />
                      <input type="file" hidden accept="image/*" />
                    </label>
                  )}
                </div>
                <div style={{ paddingBottom: '15px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>
                    {profileData?.fullName} <span style={{ fontSize: '20px', color: colors.textMuted, fontWeight: '500' }}>({profileData?.displayName})</span>
                  </h1>
                  <p style={{ color: colors.textMuted, fontWeight: '700', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <Briefcase size={18} color={colors.primary} /> {profileData?.role || 'Desenvolvedor'}
                  </p>
                </div>
              </div>
              <div style={{ paddingBottom: '20px', display: 'flex', gap: '12px' }}>
                {isOwner && (
                  <button onClick={() => navigate('/completar-perfil')} style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 15px ${colors.primary}40` }}>
                    <Edit3 size={18} /> Editar Perfil
                  </button>
                )}
                <button style={{ background: colors.card, border: `1px solid ${colors.border}`, color: colors.text, padding: '12px', borderRadius: '14px', cursor: 'pointer' }}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
          
          {/* SIDEBAR */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
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
                {profileData?.contacts?.github && (
                  <a href={profileData.contacts.github} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '700' }}>
                    <div style={{ background: pageBgColor, padding: '10px', borderRadius: '12px' }}><Github size={20} /></div> GitHub
                  </a>
                )}
                {profileData?.contacts?.linkedin && (
                  <a href={profileData.contacts.linkedin} target="_blank" rel="noreferrer" style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '700' }}>
                    <div style={{ background: pageBgColor, padding: '10px', borderRadius: '12px' }}><Linkedin size={20} color="#0a66c2" /> LinkedIn</div>
                  </a>
                )}
                <a href={`mailto:${profileData?.contacts?.publicEmail}`} style={{ color: colors.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '700' }}>
                  <div style={{ background: pageBgColor, padding: '10px', borderRadius: '12px' }}><Mail size={20} color={colors.primary} /> Email</div>
                </a>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '35px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><Cpu size={24} color={colors.primary} /> Stack Tecnológico</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {profileData?.tools?.map((tool: string) => (
                  <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: pageBgColor, padding: '12px 20px', borderRadius: '16px', border: `1px solid ${colors.border}`, fontSize: '15px', fontWeight: '800', transition: '0.2s' }}>
                    <SkillIcon slug={tool} size={20} fallbackColor={colors.primary} /> {tool}
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '35px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><GraduationCap size={24} color={colors.primary} /> Formação Académica</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {profileData?.education?.map((edu: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                    <div style={{ background: `${colors.primary}15`, width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <GraduationCap size={26} color={colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>{edu.fieldOfStudy}</h4>
                      <p style={{ margin: '6px 0', fontSize: '15px', fontWeight: '700', color: colors.text }}>{edu.institution}</p>
                      <div style={{ fontSize: '13px', color: colors.textMuted, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> {edu.startMonth} {edu.startYear} — {edu.endMonth} {edu.endYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '35px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}><Code size={24} color={colors.primary} /> Projetos Publicados</h3>
                {isOwner && <button style={{ background: colors.primary, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><PlusCircle size={18} /> Adicionar</button>}
              </div>
              <div style={{ border: `2px dashed ${colors.border}`, padding: '60px 20px', borderRadius: '24px', textAlign: 'center', background: pageBgColor }}>
                <Code size={40} style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p style={{ fontWeight: '700', color: colors.textMuted }}>O seu portfólio de projetos aparecerá aqui.</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER - IGUAL À HOME */}
      <footer style={{ background: theme === 'light' ? '#f8fafc' : '#1a1a1a', color: colors.textMuted, padding: '3rem 1rem', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${colors.border}`, marginTop: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', textAlign: 'center', fontWeight: '700' }}>© 2026 Todos os direitos reservados.</div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: '700' }}>
            <a href="/termos" style={{ color: colors.textMuted, textDecoration: 'none' }}>Termos de Serviço</a>
            <a href="/privacidade" style={{ color: colors.textMuted, textDecoration: 'none' }}>Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}