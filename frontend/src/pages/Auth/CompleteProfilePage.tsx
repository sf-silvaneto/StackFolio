import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  AtSign, CheckCircle, Sun, Moon, Sparkles, 
  Briefcase, GraduationCap, Plus, Trash2, Github, Linkedin, 
  GripVertical, Mail, Smartphone, Globe, MapPin, Search, AlertCircle, 
  ChevronDown, Camera, ImagePlus, User as UserIcon, Link as LinkIcon, 
  Calendar, Languages, BarChart, Cpu, X, ArrowRight, ArrowLeft, Terminal 
} from 'lucide-react';

// === COMPONENTE DE ÍCONE BLINDADO (Com fonte oficial JSDelivr) ===
const SkillIcon = ({ slug, size, isActive, fallbackColor }: { slug: string, size: number, isActive?: boolean, fallbackColor?: string }) => {
  const [error, setError] = useState(false);
  
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    
    const map: Record<string, string> = {
      'wsl': 'linux', 
      'aws': 'openjdk', 
      'gcp': 'googlecloud', 
      'c++': 'cplusplus', 
      'c#': 'csharp',
      'node.js': 'nodedotjs', 
      'vue.js': 'vuedotjs', 
      'next.js': 'nextdotjs', 
      'react native': 'react',
      'tailwind css': 'tailwindcss', 
      '.net': 'dotnet', 
      'spring boot': 'springboot', 
      'adobe xd': 'adobexd', 
      'sql': 'mysql', 
      'java': 'coffeescript', // O pinguim foi-se embora! A chávena de café voltou.
      'css3': 'css3', 
      'html5': 'html5', 
      'azure': 'microsoftazure', 
      'javascript': 'javascript'
    };
    
    if (map[lower]) return map[lower];
    return lower.replace(/[^a-z0-9]/g, '');
  };

  const finalSlug = getCorrectSlug(slug);
  
  if (error || !finalSlug) return <Terminal size={size} color={isActive ? '#fff' : fallbackColor} />;
  
  return (
    <img 
      // Link alterado para a biblioteca oficial NPM via JSDelivr (Nunca mais dará erro 404)
      src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${finalSlug}.svg`} 
      style={{ width: size, height: size, filter: isActive ? 'brightness(0) invert(1)' : 'none', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} 
      alt={slug} 
      onError={() => setError(true)} 
    />
  );
};

// === DADOS PRÉ-DEFINIDOS ===
const TECH_ROLES = ["Engenheiro de Software", "Desenvolvedor Fullstack", "Desenvolvedor Frontend", "Desenvolvedor Backend", "Mobile Developer", "Engenheiro de Dados", "Cientista de Dados", "Especialista em Cibersegurança", "Arquiteto Cloud", "UI/UX Designer", "Tech Lead", "DevOps Engineer", "QA Engineer", "Analista de Suporte", "Administrador de Redes", "Estudante de TI"];
const COURSES = ["Ciência da Computação", "Engenharia de Computação", "Engenharia de Software", "Sistemas de Informação", "Análise e Desenvolvimento de Sistemas", "Redes de Computadores", "Segurança da Informação", "Matemática Computacional", "Design Gráfico"];
const INSTITUTIONS = ["Universidade Potiguar (UnP)", "Universidade de São Paulo (USP)", "UFRN", "UFERSA", "UFCG", "UFPB", "FIAP", "Rocketseat", "Alura", "Trybe", "Estácio", "IFRN"];
const EXTENDED_SKILLS = ["React", "Node.js", "Python", "AWS", "Docker", "Cisco", "Figma", "Linux", "C++", "Java", "TypeScript", "SQL", "JavaScript", "HTML5", "CSS3", "Vue.js", "Angular", "Next.js", "NestJS", "C#", ".NET", "PHP", "Spring Boot", "Ruby", "Go", "Swift", "Kotlin", "React Native", "Flutter", "Kubernetes", "Azure", "GCP", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Git", "GitHub", "Jira", "Tailwind CSS"];

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + 5 - i); 

// === AUTOCOMPLETE CUSTOMIZADO ===
const CustomAutocomplete = ({ value, onChange, options, placeholder, icon: Icon, colors, inputBgColor, maxLength }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((opt: string) => opt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) && opt !== value).slice(0, 30);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <Icon size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px', zIndex: 2 }} />
      <input maxLength={maxLength} value={value} onChange={(e) => { onChange(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} placeholder={placeholder} style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: `1px solid ${isOpen && filteredOptions.length > 0 ? colors.primary : colors.border}`, background: inputBgColor, color: colors.text, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', position: 'relative', zIndex: 1 }} />
      <ChevronDown size={16} color={colors.textMuted} style={{ position: 'absolute', right: '14px', top: '15px', zIndex: 2, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', pointerEvents: 'none' }} />
      {isOpen && filteredOptions.length > 0 && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '8px', listStyle: 'none', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          {filteredOptions.map((opt: string) => (
            <li key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = inputBgColor} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>{opt}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export function CompleteProfilePage() {
  // 1. Mudança aqui: Trocado 'tempGoogleData' por 'user'
  const { user, completeRegistration } = useAuth() as any;
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // === ESTADOS ===
  const [profileImg, setProfileImg] = useState('');
  const [coverImg, setCoverImg] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState(''); 
  const [bio, setBio] = useState('');

  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState('Estudante');
  const [englishLevel, setEnglishLevel] = useState('Básico');
  const [cep, setCep] = useState('');
  const [location, setLocation] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [availability, setAvailability] = useState('Open to Work');
  
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const [education, setEducation] = useState([{ id: Date.now(), fieldOfStudy: '', institution: '', startMonth: '', startYear: '', endMonth: '', endYear: '' }]);

  const [publicEmail, setPublicEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [errors, setErrors] = useState({ github: '', linkedin: '', username: '' });

  // 2. Mudança no useEffect: Sem redirecionamentos manuais, apenas inicialização de dados
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || user.username || '');
      if (!publicEmail) setPublicEmail(user.email || '');
    }
  }, [user]);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 4000);
  };

  const calculateProgress = () => {
    let score = 0;
    if (fullName) score += 10;
    if (displayName) score += 10;
    if (username) score += 10;
    if (role) score += 10;
    if (location) score += 10;
    if (bio.length > 20) score += 10;
    if (selectedSkills.length > 0) score += 20;
    if (education[0]?.fieldOfStudy) score += 10;
    if (github || linkedin) score += 10;
    return Math.min(score, 100);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = val.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(/\b(De|Da|Do|Das|Dos)\b/g, (a) => a.toLowerCase());
    setFullName(formatted);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^\s+/g, '').replace(/\s{2,}/g, ' '); 
    setDisplayName(val);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); 
    setUsername(val);
    const reserved = ['admin', 'root', 'stackfolio', 'suporte', 'null'];
    if(val.length > 0 && val.length < 3) setErrors({...errors, username: 'Mínimo de 3 caracteres.'});
    else if(reserved.includes(val)) setErrors({...errors, username: 'Este link não está disponível.'});
    else setErrors({...errors, username: ''});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) return triggerToast("A imagem não pode ter mais de 3MB.", "error");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') setProfileImg(reader.result as string);
        else setCoverImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setLocation(`${data.localidade} - ${data.uf}`);
          triggerToast("📍 Localização validada com sucesso!", "success");
        } else {
          setLocation('');
          triggerToast("❌ CEP não encontrado. Verifique o número digitado.", "error");
        }
      } catch (error) {
        triggerToast("❌ Erro ao ligar aos Correios.", "error");
      } finally {
        setCepLoading(false);
      }
    }
  };
  
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5, 8);
    setCep(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.startsWith('55')) val = val.slice(2);
    if (val.length > 11) val = val.slice(0, 11);
    let formatted = '';
    if (val.length > 0) formatted += `+55 (${val.slice(0, 2)}`;
    if (val.length > 2) formatted += `) ${val.slice(2, 7)}`;
    if (val.length > 7) formatted += `-${val.slice(7)}`;
    setWhatsapp(val === '' ? '' : formatted);
  };

  const validateUrl = (url: string, platform: 'github' | 'linkedin') => {
    if (!url.trim()) return '';
    if (platform === 'github' && !url.includes('github.com/')) return 'Deve conter "github.com/"';
    if (platform === 'linkedin' && !url.includes('linkedin.com/in/')) return 'Deve conter "linkedin.com/in/"';
    return '';
  };

  const filteredSkills = EXTENDED_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s));
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) setSelectedSkills(selectedSkills.filter(s => s !== skill));
    else if (selectedSkills.length < 15) { 
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills); 
      setSkillSearch(''); 
      if(newSkills.length === 3) triggerToast("🚀 Excelente escolha técnica!", "success");
    }
    else alert('Pode selecionar no máximo 15 tecnologias.');
  };
  const handleSortSkills = () => {
    let _selectedSkills = [...selectedSkills];
    if(dragItem.current !== null && dragOverItem.current !== null) {
        const draggedItemContent = _selectedSkills.splice(dragItem.current, 1)[0];
        _selectedSkills.splice(dragOverItem.current, 0, draggedItemContent);
        setSelectedSkills(_selectedSkills);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const addEducation = () => {
    if (education.length < 3) {
      setEducation([...education, { id: Date.now(), fieldOfStudy: '', institution: '', startMonth: '', startYear: '', endMonth: '', endYear: '' }]);
    }
  };
  const removeEducation = (id: number) => setEducation(education.filter(edu => edu.id !== id));
  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  // NAVEGAÇÃO DO WIZARD
  const nextStep = () => {
    if (step === 1) {
      if (!fullName || !displayName || !username) return alert("Preencha o seu Nome, Apelido e Link antes de continuar.");
      if (errors.username) return alert("Corrija o erro no Link do Perfil.");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s - 1);
  };

  // SUBMIT FINAL
  const handleSubmit = async () => {
    if (errors.github || errors.linkedin) return alert("Corrija os erros nas redes sociais.");
    
    setIsLoading(true);
    const cleanEducation = education.filter(e => e.fieldOfStudy.trim() !== '' && e.institution.trim() !== '').map(e => ({
      ...e,
      startDate: e.startMonth && e.startYear ? `${e.startMonth} de ${e.startYear}` : '',
      endDate: e.endMonth && e.endYear ? `${e.endMonth} de ${e.endYear}` : ''
    }));

    const finalData = {
      fullName, displayName: displayName.trim(), username, role, seniority, englishLevel, location, availability, bio,
      profileImg, coverImg,
      tools: selectedSkills,
      education: cleanEducation,
      contacts: { publicEmail, whatsapp, website, github, linkedin }
    };

    try {
      await completeRegistration(finalData);
      navigate(`/${username}`); 
    } catch (error) {
      triggerToast('❌ Erro. O Link do perfil já deve estar em uso.', 'error');
      setIsLoading(false);
    }
  };

  // 3. Substituir tempGoogleData por user
  if (!user) return null;

  const pageBgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const inputBgColor = theme === 'light' ? '#f1f5f9' : '#1e293b';
  const sectionStyle = { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', animation: 'fadeInRight 0.4s ease-out' };
  const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: inputBgColor, color: colors.text, outline: 'none', boxSizing: 'border-box' as 'border-box', transition: 'border 0.2s' };

  return (
    <div style={{ background: pageBgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      <datalist id="roles-list">{TECH_ROLES.map(r => <option key={r} value={r} />)}</datalist>
      <datalist id="courses-list">{COURSES.map(c => <option key={c} value={c} />)}</datalist>
      <datalist id="institutions-list">{INSTITUTIONS.map(i => <option key={i} value={i} />)}</datalist>

      {/* GAMIFICATION TOAST (SUCESSO E ERRO) */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: toast.type === 'error' ? '#ef4444' : '#10b981', color: '#fff', padding: '15px 25px', borderRadius: '16px', fontWeight: '800', boxShadow: `0 10px 30px ${toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, zIndex: 1000, animation: 'slideUp 0.3s ease-out' }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER WIZARD COM PROGRESSO BASEADO NA % */}
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '15px 0', background: colors.card, position: 'sticky', top: 0, zIndex: 80 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <h2 style={{ margin: 0, color: colors.primary, fontWeight: '900', fontSize: '24px', letterSpacing: '-1px' }}>Stack Folio</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: colors.textMuted }}>
              Passo {step}/3 • <span style={{ color: '#10b981' }}>Perfil a {calculateProgress()}%</span>
            </span>
            <div style={{ width: '200px', height: '6px', background: inputBgColor, borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${calculateProgress()}%`, height: '100%', background: '#10b981', borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>

          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        
        {/* === PASSO 1: INFORMAÇÕES PESSOAIS === */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <section style={{ ...sectionStyle, padding: 0, overflow: 'hidden' }}>
              <label style={{ display: 'block', width: '100%', height: '180px', background: coverImg ? `url(${coverImg}) center/cover` : `linear-gradient(45deg, ${colors.primary}20, ${colors.border})`, position: 'relative', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0'}>
                  <span style={{ color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}><ImagePlus size={20}/> Alterar Capa</span>
                </div>
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
              </label>

              <div style={{ padding: '0 30px 30px 30px', position: 'relative', marginTop: '-55px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                <label style={{ position: 'relative', cursor: 'pointer', borderRadius: '50%', border: `6px solid ${colors.card}` }}>
                  {/* 4. Usar avatar automático do ui-avatars.com caso não exista profileImg nem GoogleData */}
                  <img src={profileImg || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=random&color=fff&size=128`} alt="Perfil" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', background: colors.card }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0'}>
                    <Camera size={24} color="#fff" />
                  </div>
                  <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
                </label>
                <div style={{ paddingBottom: '10px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, color: colors.text }}>
                    {fullName ? `${fullName} ${displayName ? `(${displayName.trim()})` : ''}` : (displayName ? `(${displayName.trim()})` : 'O Seu Perfil Pessoal')}
                  </h1>
                  <p style={{ color: colors.textMuted, fontSize: '14px', margin: '4px 0 0 0', fontWeight: '600' }}>{role || 'O seu Cargo'} • {location || 'Localização'}</p>
                </div>
              </div>
            </section>

            <section style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px' }}><UserIcon size={20} color={colors.primary}/> 1. Informações Pessoais</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Nome Completo <span style={{color: '#ef4444'}}>*</span></label>
                  <input required maxLength={30} value={fullName} onChange={handleFullNameChange} placeholder="Ex: Silvestre Fernandes" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Apelido (Nome Curto) <span style={{color: '#ef4444'}}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input required maxLength={15} value={displayName} onChange={handleDisplayNameChange} onBlur={(e) => setDisplayName(e.target.value.trim())} placeholder="Ex: Silva Neto" style={{...inputStyle, paddingLeft: '40px'}} />
                  </div>
                </div>
              </div>

              {/* LINK DO PERFIL ALINHADO E SEM NEGRITO */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Link do Seu Perfil <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.username ? '#ef4444' : colors.border}`, borderRadius: '12px', background: inputBgColor, overflow: 'hidden', transition: 'border 0.2s', padding: '0 16px' }}>
                  <span style={{ color: colors.textMuted, fontSize: '14px', fontWeight: '400', userSelect: 'none' }}>
                    stackfolio.com/
                  </span>
                  <input required maxLength={15} value={username} onChange={handleUsernameChange} placeholder="silvaneto" style={{ flex: 1, padding: '14px 0', border: 'none', background: 'transparent', color: colors.text, outline: 'none', fontWeight: '400', fontSize: '14px' }} />
                </div>
                {errors.username && <small style={{ color: '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontWeight: '800' }}><AlertCircle size={12}/> {errors.username}</small>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>CEP <span style={{color: '#ef4444'}}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input required value={cep} onChange={handleCepChange} onBlur={handleCepBlur} placeholder="Apenas números" maxLength={9} style={{...inputStyle, paddingLeft: '40px'}} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Cidade Verificada {cepLoading && <span style={{fontSize: '11px', color: colors.primary}}>(A procurar...)</span>}</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input readOnly value={location} placeholder="Apenas preenchimento automático pelo CEP" style={{...inputStyle, paddingLeft: '40px', background: colors.card, opacity: 0.7, cursor: 'not-allowed', borderColor: colors.border}} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '800' }}>A sua Bio (Resumo)</label>
                  <span style={{ fontSize: '11px', color: bio.length > 480 ? '#ef4444' : colors.textMuted, fontWeight: '800' }}>{bio.length}/500</span>
                </div>
                <textarea maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Resuma a sua experiência, principais competências e objetivos profissionais. Uma boa bio ajuda a destacar o seu perfil para os recrutadores." style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }} />
              </div>
            </section>
          </div>
        )}

        {/* === PASSO 2: O QUE FAZES? === */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px' }}><Briefcase size={20} color={colors.primary}/> 2. O que fazes?</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Cargo / Título Atual</label>
                  <CustomAutocomplete maxLength={35} value={role} onChange={setRole} options={TECH_ROLES} placeholder="Ex: Desenvolvedor Fullstack" icon={Briefcase} colors={colors} inputBgColor={inputBgColor} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Nível de Experiência</label>
                  <div style={{ position: 'relative' }}>
                    <BarChart size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <select value={seniority} onChange={(e) => setSeniority(e.target.value)} style={{...inputStyle, paddingLeft: '40px', appearance: 'none', cursor: 'pointer', fontWeight: '600'}}>
                      <option value="Estudante">Estudante</option>
                      <option value="Júnior">Júnior</option>
                      <option value="Pleno">Pleno</option>
                      <option value="Sênior">Sênior</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Nível de Inglês</label>
                  <div style={{ position: 'relative' }}>
                    <Languages size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <select value={englishLevel} onChange={(e) => setEnglishLevel(e.target.value)} style={{...inputStyle, paddingLeft: '40px', appearance: 'none', cursor: 'pointer', fontWeight: '600'}}>
                      <option value="Básico">Básico</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                      <option value="Fluente">Fluente / Nativo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Disponibilidade Profissional</label>
                <select value={availability} onChange={(e) => setAvailability(e.target.value)} style={{...inputStyle, appearance: 'none', cursor: 'pointer', fontWeight: '600'}}>
                  <option value="Open to Work">🟢 Disponível para novas oportunidades</option>
                  <option value="Freelancer">🟡 Disponível para projetos Freelance</option>
                  <option value="Employed">🔴 Não procuro no momento (Empregado)</option>
                </select>
              </div>
            </section>

            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={20} color={colors.primary}/> Stack Tecnológico
                </h3>
                <span style={{ fontSize: '12px', fontWeight: '800', background: `${colors.primary}20`, color: colors.primary, padding: '6px 12px', borderRadius: '12px' }}>{selectedSkills.length}/15</span>
              </div>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Pesquise por ferramentas, linguagens ou sistemas..." style={{...inputStyle, paddingLeft: '40px'}} />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px', maxHeight: '180px', overflowY: 'auto', padding: '15px', background: inputBgColor, borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                {filteredSkills.length > 0 ? filteredSkills.map(skill => (
                  <button type="button" key={skill} onClick={() => toggleSkill(skill)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: colors.card, color: colors.text, border: `1px solid ${colors.border}`, padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = colors.primary} onMouseOut={e => e.currentTarget.style.borderColor = colors.border}>
                    <Plus size={14} color={colors.primary} /> <SkillIcon slug={skill} size={14} fallbackColor={colors.textMuted} /> {skill}
                  </button>
                )) : <span style={{ fontSize: '13px', color: colors.textMuted, margin: 'auto' }}>Nenhuma tecnologia encontrada.</span>}
              </div>

              {selectedSkills.length > 0 && (
                <div style={{ background: colors.card, padding: '20px', borderRadius: '16px', border: `1px dashed ${colors.border}` }}>
                  <p style={{ fontSize: '13px', color: colors.text, fontWeight: '800', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><GripVertical size={14}/> As suas Seleções (Arraste para ordenar ou clique para remover):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedSkills.map((skill, index) => (
                      <div 
                        key={skill} draggable 
                        onDragStart={(e) => (dragItem.current = index)}
                        onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSortSkills}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => toggleSkill(skill)} 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${colors.primary}15`, color: colors.primary, border: `1px solid ${colors.primary}40`, padding: '8px 14px', borderRadius: '12px', cursor: 'grab', fontSize: '13px', fontWeight: '800', transition: 'all 0.1s' }}
                        onMouseOver={e => e.currentTarget.style.background = `${colors.primary}30`} onMouseOut={e => e.currentTarget.style.background = `${colors.primary}15`}
                        title="Clique para remover"
                      >
                        <GripVertical size={14} style={{ opacity: 0.5 }} onClick={(e) => e.stopPropagation()} />
                        <SkillIcon slug={skill} size={16} fallbackColor={colors.primary} />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* === PASSO 3: FORMAÇÃO & CONTACTOS === */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={20} color={colors.primary}/> 3. Formação Académica (Opcional)</span>
                {education.length < 3 && (
                  <button type="button" onClick={addEducation} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${colors.primary}15`, color: colors.primary, border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=> e.currentTarget.style.background=`${colors.primary}25`} onMouseOut={e=> e.currentTarget.style.background=`${colors.primary}15`}>
                    <Plus size={14} /> Adicionar Formação ({education.length}/3)
                  </button>
                )}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map((edu, index) => (
                  <div key={edu.id} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: inputBgColor, padding: '25px', borderRadius: '16px', border: `1px solid ${colors.border}`, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-12px', top: '25px', background: colors.primary, color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', border: `4px solid ${pageBgColor}` }}>{index + 1}</div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Instituição de Ensino</label>
                          <CustomAutocomplete maxLength={50} value={edu.institution} onChange={(v: string) => updateEducation(edu.id, 'institution', v)} options={INSTITUTIONS} placeholder="Ex: Universidade Potiguar (UnP)" icon={Briefcase} colors={colors} inputBgColor={colors.card} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Área de Estudo / Curso</label>
                          <CustomAutocomplete maxLength={50} value={edu.fieldOfStudy} onChange={(v: string) => updateEducation(edu.id, 'fieldOfStudy', v)} options={COURSES} placeholder="Ex: Ciência da Computação" icon={GraduationCap} colors={colors} inputBgColor={colors.card} />
                        </div>
                      </div>
                      
                      {/* DATAS (MÊS E ANO SUSPENSOS) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Data de Início</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={edu.startMonth} onChange={(e) => updateEducation(edu.id, 'startMonth', e.target.value)} style={{...inputStyle, background: colors.card, appearance: 'none', cursor: 'pointer', flex: 1}}>
                              <option value="">Mês</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={edu.startYear} onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)} style={{...inputStyle, background: colors.card, appearance: 'none', cursor: 'pointer', width: '100px'}}>
                              <option value="">Ano</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Término (ou Previsão)</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={edu.endMonth} onChange={(e) => updateEducation(edu.id, 'endMonth', e.target.value)} style={{...inputStyle, background: colors.card, appearance: 'none', cursor: 'pointer', flex: 1}}>
                              <option value="">Mês</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={edu.endYear} onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)} style={{...inputStyle, background: colors.card, appearance: 'none', cursor: 'pointer', width: '100px'}}>
                              <option value="">Ano</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                    </div>
                    {education.length > 1 && (
                      <button type="button" onClick={() => removeEducation(edu.id)} style={{ background: '#ef444415', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginTop: '22px', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#ef444425'} onMouseOut={e=>e.currentTarget.style.background='#ef444415'} title="Remover Formação">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px' }}>
                <Globe size={20} color={colors.primary}/> Contactos e Redes Sociais
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Email Profissional Público <span style={{fontWeight: '400', color: colors.textMuted}}>(Opcional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input type="email" value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)} placeholder="Email para contacto" style={{...inputStyle, paddingLeft: '40px'}} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>WhatsApp Profissional <span style={{fontWeight: '400', color: colors.textMuted}}>(Opcional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input value={whatsapp} onChange={handlePhoneChange} placeholder="+55 (00) 00000-0000" style={{...inputStyle, paddingLeft: '40px'}} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>GitHub <span style={{fontWeight: '400', color: colors.textMuted}}>(Opcional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <Github size={16} color={errors.github ? '#ef4444' : colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input value={github} onChange={(e) => { setGithub(e.target.value); setErrors({...errors, github: validateUrl(e.target.value, 'github')}); }} placeholder="https://github.com/seunome" style={{...inputStyle, paddingLeft: '40px', borderColor: errors.github ? '#ef4444' : colors.border}} />
                    {errors.github && <small style={{ color: '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}><AlertCircle size={12}/> {errors.github}</small>}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>LinkedIn <span style={{fontWeight: '400', color: colors.textMuted}}>(Opcional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <Linkedin size={16} color={errors.linkedin ? '#ef4444' : colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <input value={linkedin} onChange={(e) => { setLinkedin(e.target.value); setErrors({...errors, linkedin: validateUrl(e.target.value, 'linkedin')}); }} placeholder="https://linkedin.com/in/seunome" style={{...inputStyle, paddingLeft: '40px', borderColor: errors.linkedin ? '#ef4444' : colors.border}} />
                    {errors.linkedin && <small style={{ color: '#ef4444', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}><AlertCircle size={12}/> {errors.linkedin}</small>}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Portfólio / Site Pessoal <span style={{fontWeight: '400', color: colors.textMuted}}>(Opcional)</span></label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} color={colors.textMuted} style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://seusite.dev" style={{...inputStyle, paddingLeft: '40px'}} />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* NAVEGAÇÃO DO WIZARD (BOTÕES) */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          {step > 1 && (
            <button type="button" onClick={prevStep} style={{ flex: 0.3, padding: '18px', background: 'transparent', color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background=inputBgColor} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <ArrowLeft size={20} /> Voltar
            </button>
          )}

          {step < 3 ? (
            <button type="button" onClick={nextStep} style={{ flex: 1, padding: '18px', background: colors.primary, color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 8px 30px ${colors.primary}50`, transition: 'transform 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              Próximo Passo <ArrowRight size={20} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isLoading} style={{ flex: 1, padding: '18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: `0 8px 30px rgba(16,185,129,0.4)`, transition: 'transform 0.2s', opacity: isLoading ? 0.7 : 1 }} onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-3px)')} onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}>
              {isLoading ? 'A preparar ambiente...' : <><CheckCircle size={22} /> Guardar e Lançar Perfil</>}
            </button>
          )}
        </div>

      </main>

      <footer style={{ background: theme === 'light' ? '#f8fafc' : '#1a1a1a', color: colors.textMuted, padding: '3rem 1rem', display: 'flex', justifyContent: 'center', marginTop: 'auto', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', textAlign: 'center', fontWeight: '600' }}>© {new Date().getFullYear()} Todos os direitos reservados.</div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: '600' }}>
            <a href="/termos" style={{ color: colors.textMuted, textDecoration: 'none', cursor: 'pointer' }}>Termos de Serviço</a>
            <a href="/privacidade" style={{ color: colors.textMuted, textDecoration: 'none', cursor: 'pointer' }}>Política de Privacidade</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}