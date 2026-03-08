import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, Lock, Sun, Moon, ArrowRight, Eye, EyeOff, AlertTriangle,
  User, Cake, Phone, Briefcase, MapPin, X, Terminal, Code, Plus, CheckCircle, MessageCircle, Loader2, UserCircle, Ban, AtSign, ChevronDown, GraduationCap, Languages, Clock, GripVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api'; 
import logoImg from '../../assets/logo.png'; 

const SkillIcon = ({ slug, size }: any) => {
  const [error, setError] = useState(false);
  const getCorrectSlug = (s: string) => {
    if (!s) return '';
    const val = s.trim().toLowerCase();
    const map: Record<string, string> = {
      'arduino': 'arduino', 'esp32': 'espressif', 'python': 'python', 
      'react': 'react', 'node.js': 'nodedotjs', 'typescript': 'typescript',
      'javascript': 'javascript', 'java': 'java', 'docker': 'docker', 'aws': 'amazonaws',
      'azure': 'microsoftazure', 'google cloud': 'googlecloud', 'tailwind css': 'tailwindcss', 
      'jira': 'jira', 'github': 'github', 'linux': 'linux', 'mysql': 'mysql',
      'postgresql': 'postgresql', 'mongodb': 'mongodb', 'firebase': 'firebase', 
      'c#': 'csharp', 'c++': 'cplusplus', 'php': 'php', 'ruby': 'ruby', 'go': 'go', 
      'rust': 'rust', 'swift': 'swift', 'kotlin': 'kotlin', 'dart': 'dart', 
      'flutter': 'flutter', 'react native': 'react', 'vue.js': 'vuedotjs', 
      'angular': 'angular', 'svelte': 'svelte', 'django': 'django', 'spring': 'spring', 
      'laravel': 'laravel', 'express': 'express', 'nestjs': 'nestjs', 'redis': 'redis', 
      'graphql': 'graphql', 'git': 'git', 'gitlab': 'gitlab', 'bitbucket': 'bitbucket', 
      'kubernetes': 'kubernetes', 'terraform': 'terraform', 'figma': 'figma', 
      'sql': 'sqlite', 'html5': 'html5', 'css3': 'css3', 'sass': 'sass',
      'next.js': 'nextdotjs', 'nuxt.js': 'nuxtdotjs', 'vite': 'vite', 'jest': 'jest',
      'cypress': 'cypress', 'supabase': 'supabase', 'prisma': 'prisma', 
      'elasticsearch': 'elasticsearch', 'rabbitmq': 'rabbitmq', 'nginx': 'nginx',
      'apache': 'apache', 'jenkins': 'jenkins', 'ansible': 'ansible', 
      'prometheus': 'prometheus', 'grafana': 'grafana', 'datadog': 'datadog',
      'salesforce': 'salesforce', 'powerbi': 'powerbi', 'tableau': 'tableau',
      'excel': 'microsoftexcel', 'wordpress': 'wordpress', 'shopify': 'shopify',
      'magento': 'magento', 'webflow': 'webflow', 'unity': 'unity', 
      'unreal engine': 'unrealengine', 'blender': 'blender'
    };
    return map[val] || val.replace(/[^a-z0-9]/g, '');
  };
  
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color="#fff" />;
  
  // Workaround especial para o Java que foi removido do SimpleIcons pela Oracle
  let imgSrc = `https://cdn.simpleicons.org/${finalSlug}`;
  if (finalSlug === 'java') {
    imgSrc = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg`;
  }

  return (
    <img 
      src={imgSrc} 
      style={{ width: size, height: size }} 
      alt={slug} onError={() => setError(true)} 
    />
  );
};

const TECH_ROLES = ["Engenheiro de Software", "Desenvolvedor Fullstack", "Desenvolvedor Frontend", "Desenvolvedor Backend", "Dev IoT & Robotics", "DevOps Engineer", "Data Scientist"];

// LISTA GIGANTE E BLOQUEADA (Só aceita o que estiver aqui)
const AVAILABLE_TOOLS = [
  "React", "Node.js", "Python", "Arduino", "ESP32", "TypeScript", "Docker", "Java", "C++", "C#", "SQL",
  "JavaScript", "AWS", "Azure", "Google Cloud", "Tailwind CSS", "Jira", "GitHub", "Linux", "PostgreSQL", 
  "MySQL", "MongoDB", "Firebase", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin", "Dart", "Flutter", 
  "React Native", "Vue.js", "Angular", "Svelte", "Django", "Spring", "Laravel", "Express", "NestJS", 
  "Redis", "GraphQL", "Git", "GitLab", "Bitbucket", "Kubernetes", "Terraform", "Figma", "HTML5", "CSS3",
  "Sass", "Next.js", "Nuxt.js", "Vite", "Jest", "Cypress", "Supabase", "Prisma", "Elasticsearch", "RabbitMQ",
  "Nginx", "Apache", "Jenkins", "Ansible", "Prometheus", "Grafana", "Datadog", "Salesforce", "PowerBI",
  "Tableau", "Excel", "WordPress", "Shopify", "Magento", "Webflow", "Unity", "Unreal Engine", "Blender"
].sort();

// PROGRESSÃO TÉRMICA (Cinza -> Azul -> Verde -> Amarelo -> Laranja -> Roxo -> Vermelho)
const seniorityOptions = [
  { label: "Nenhuma", color: "#94a3b8" },
  { label: "Estudante", color: "#38bdf8" },
  { label: "Júnior", color: "#22c55e" },
  { label: "Pleno", color: "#eab308" },
  { label: "Sênior", color: "#f97316" },
  { label: "Especialista", color: "#8b5cf6" },
  { label: "Tech Lead", color: "#ef4444" },
];

const englishOptions = [
  { label: "Não entende / Não compreende", color: "#ef4444" },
  { label: "Básico", color: "#f97316" },
  { label: "Intermediário", color: "#eab308" },
  { label: "Avançado", color: "#84cc16" },
  { label: "Fluente", color: "#22c55e" },
  { label: "Nativo", color: "#3b82f6" },
];

const availabilityOptions = [
  { label: "Buscando Oportunidades", color: "#10b981" },
  { label: "Apenas Freelance", color: "#f59e0b" },
  { label: "Indisponível", color: "#ef4444" },
];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const { theme, toggleTheme, colors } = useTheme() as any;
  const navigate = useNavigate();

  const [emailFieldName] = useState(`field_${Math.random().toString(36).substring(7)}`);
  const [emailCodeFieldName] = useState(`code_${Math.random().toString(36).substring(7)}`);
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [isHoveringNext, setIsHoveringNext] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);

  const [toolSearch, setToolSearch] = useState('');
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const [showSeniorityDropdown, setShowSeniorityDropdown] = useState(false);
  const [showEnglishDropdown, setShowEnglishDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    username: '', displayName: '', fullName: '', 
    birthDate: '', phone: '',
    role: '', seniority: '', englishLevel: '', availability: '', bio: '', 
    cep: '', location: '', tools: [] as string[]
  });

  const isAdult = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailCooldown > 0) {
      timer = setTimeout(() => setEmailCooldown(emailCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailCooldown]);

  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email.includes('@') && formData.email.endsWith('.com')) {
        setIsEmailChecking(true);
        try {
          const response = await api.get(`/auth/check-email?email=${formData.email}`);
          setIsEmailAvailable(response.data.available);
        } catch (error) { setIsEmailAvailable(true); }
        finally { setIsEmailChecking(false); }
      } else { setIsEmailAvailable(null); }
    };
    const timer = setTimeout(checkEmail, 800);
    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 5) {
        setIsUsernameChecking(true);
        try {
          const response = await api.get(`/auth/check-username?username=${formData.username}`);
          setIsUsernameAvailable(response.data.available);
        } catch (error) { setIsUsernameAvailable(true); }
        finally { setIsUsernameChecking(false); }
      } else { setIsUsernameAvailable(null); }
    };
    const timer = setTimeout(checkUsername, 800);
    return () => clearTimeout(timer);
  }, [formData.username]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSeniorityDropdown(false);
        setShowEnglishDropdown(false);
        setShowAvailabilityDropdown(false);
        setShowToolDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendEmail = async () => {
    if (emailCooldown > 0) return;
    setIsSendingEmail(true);
    try {
      await api.post('/auth/send-email-code', { email: formData.email });
      setEmailSent(true);
      setEmailCooldown(30); 
      toast.success("Código enviado para o teu e-mail!");
    } catch (error) {
      toast.error("Erro ao enviar código de e-mail.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    const verifyEmailCode = async () => {
      if (emailCode.length === 6) {
        setIsValidatingEmail(true);
        try {
          const response = await api.post('/auth/verify-email-code', { email: formData.email, code: emailCode });
          setIsEmailVerified(response.data.valid);
          if (response.data.valid) {
             toast.success("E-mail verificado!");
             setEmailCooldown(0); 
          }
        } catch (error) { setIsEmailVerified(false); }
        finally { setIsValidatingEmail(false); }
      }
    };
    verifyEmailCode();
  }, [emailCode, formData.email]);

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    if (numbers.length > 0) formatted += '(' + numbers.substring(0, 2);
    if (numbers.length >= 3) formatted += ') ' + numbers.substring(2, 7);
    if (numbers.length >= 8) formatted += '-' + numbers.substring(7, 11);
    if (numbers.length <= 11) {
      setFormData({ ...formData, phone: formatted });
    }
  };

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    let formatted = cleanCep;
    if (cleanCep.length > 5) formatted = cleanCep.slice(0, 5) + '-' + cleanCep.slice(5, 8);
    
    setFormData(prev => ({ ...prev, cep: formatted }));

    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (data && !data.erro) {
          setFormData(prev => ({ ...prev, location: `${data.localidade} - ${data.uf}`, cep: formatted }));
        } else {
          toast.error("CEP não encontrado.");
          setFormData(prev => ({ ...prev, location: '' }));
        }
      } catch (err) {
        toast.error("Erro ao buscar o CEP.");
      }
    }
  };

  const handleNameFilter = (value: string, field: 'fullName' | 'displayName') => {
    if (field === 'displayName') {
      let cleanValue = value.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
      const words = cleanValue.split(' ');
      if (words.length > 2) cleanValue = words.slice(0, 2).join(' ');
      setFormData({ ...formData, displayName: cleanValue.substring(0, 15) });
    } else {
      const cleanValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
      setFormData({ ...formData, fullName: cleanValue });
    }
  };

  // Bloqueio rigoroso de espaços duplos e iniciais no Cargo (Máximo 25)
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    setFormData({...formData, role: val.substring(0, 25)});
  };

  // Função para adicionar ferramentas APENAS da lista pré-definida
  const handleAddTool = (tool: string) => {
    if (formData.tools.length < 10 && !formData.tools.includes(tool)) {
      setFormData({ ...formData, tools: [...formData.tools, tool] });
      setToolSearch('');
      setShowToolDropdown(false);
    } else if (formData.tools.length >= 10) {
      toast.error("Limite máximo de 10 ferramentas atingido.");
    }
  };

  // Trava para forçar o Enter a selecionar apenas o que existe
  const handleToolKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        handleAddTool(filteredTools[0]);
      }
    }
  };

  // SISTEMA DE ORDENAÇÃO DE STACK (Drag & Drop)
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIdx === null || draggedItemIdx === index) return;
    const newTools = [...formData.tools];
    const draggedItem = newTools.splice(draggedItemIdx, 1)[0];
    newTools.splice(index, 0, draggedItem);
    setFormData({ ...formData, tools: newTools });
    setDraggedItemIdx(null);
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        displayName: formData.displayName,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        birthDate: formData.birthDate || undefined,
        role: formData.role || undefined,
        seniority: formData.seniority || undefined,
        englishLevel: formData.englishLevel || undefined,
        availability: formData.availability || undefined,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
        tools: formData.tools.length > 0 ? JSON.stringify(formData.tools) : undefined,
      });

      toast.success("Perfil lançado com sucesso!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar conta.");
    } finally {
      setIsRegistering(false);
    }
  };

  const isEmailValid = formData.email.includes('@') && formData.email.endsWith('.com');
  const isPasswordStrong = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /\d/.test(formData.password) && /[!@#$%^&*]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const isStep1Valid = isEmailValid && isPasswordStrong && passwordsMatch && isEmailAvailable === true && isEmailVerified;

  const isStep2Valid = 
    formData.username.length >= 5 && isUsernameAvailable === true && 
    formData.displayName.length >= 5 && formData.fullName.length >= 15 && 
    isAdult(formData.birthDate);

  const isStep3Valid = formData.role !== '' && formData.location !== '';

  const calculateProgress = () => {
    let score = 0;
    if (isEmailValid && isEmailAvailable && isEmailVerified) score += 20;
    if (isStep1Valid) score += 20;
    if (formData.username.length >= 5 && isUsernameAvailable === true) score += 20;
    if (formData.displayName.length >= 5 && formData.fullName.length >= 15 && isAdult(formData.birthDate)) score += 20;
    if (isStep3Valid) score += 20;
    return Math.min(score, 100);
  };

  const inputLabelStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '900', marginBottom: '6px', color: colors.textMuted, paddingLeft: '4px', textTransform: 'uppercase' as 'uppercase' };

  const inputContainerStyle = (errorCondition: boolean, isCritical: boolean = false) => ({
    position: 'relative' as 'relative', width: '100%', height: '52px', marginBottom: '15px',
    border: `1px solid ${isCritical || errorCondition ? '#ef4444' : colors.border}`,
    borderRadius: '12px', background: theme === 'light' ? '#f1f5f9' : '#1e293b',
    display: 'flex', alignItems: 'center', boxSizing: 'border-box' as 'border-box', overflow: 'visible'
  });

  const inputRawStyle = {
    flex: 1, height: '100%', padding: '0 14px 0 45px', background: 'transparent',
    border: 'none', color: colors.text, outline: 'none', fontSize: '14px', width: '100%',
  };

  const actionButtonStyle = (isDisabled: boolean, isCooldown: boolean) => ({
    background: isCooldown ? (theme === 'dark' ? '#334155' : '#e2e8f0') : colors.primary,
    color: isCooldown ? (theme === 'dark' ? '#94a3b8' : '#64748b') : '#fff',
    border: 'none', height: '36px', padding: '0 16px', borderRadius: '8px', cursor: isDisabled || isCooldown ? 'not-allowed' : 'pointer',
    fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px',
    transition: 'all 0.2s ease', boxShadow: isCooldown || isDisabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)',
    opacity: isDisabled && !isCooldown ? 0.7 : 1
  });

  const toggleDropdown = (e: React.MouseEvent, setter: any) => {
    e.stopPropagation();
    setShowSeniorityDropdown(false); setShowEnglishDropdown(false); setShowAvailabilityDropdown(false); setShowToolDropdown(false);
    setter(true);
  };

  const filteredTools = AVAILABLE_TOOLS.filter(t => t.toLowerCase().includes(toolSearch.toLowerCase()) && !formData.tools.includes(t));

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: colors.text }}>
      <header style={{ borderBottom: `1px solid ${colors.border}`, padding: '0 40px', background: colors.card, height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate('/')}><img src={logoImg} alt="Logo" style={{ height: '45px', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} /></div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '240px', height: '8px', background: colors.border, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${calculateProgress()}%`, height: '100%', background: '#10b981', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer', padding: '10px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '50px', width: '100%', maxWidth: '660px', boxShadow: '0 15px 50px rgba(0,0,0,0.06)' }}>
          
          {/* ======================= PASSO 1 ======================= */}
          {step === 1 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '30px' }}>Criar Conta</h2>
              <span style={inputLabelStyle}>E-MAIL</span>
              <div style={inputContainerStyle(formData.email.length > 0 && !isEmailValid, isEmailAvailable === false)}>
                <Mail size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                <input name={emailFieldName} type="text" autoComplete="new-password" maxLength={40} placeholder="exemplo@gmail.com" style={{ ...inputRawStyle, paddingRight: (isEmailAvailable === true && !isEmailVerified) ? '140px' : '45px' }} disabled={isEmailVerified} onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }} value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value.toLowerCase().replace(/[^a-z0-9@._-]/gi, '')}); setEmailSent(false); setIsEmailVerified(false); setEmailCode(''); setEmailCooldown(0); }} />
                <div style={{ position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                    {isEmailChecking && !isEmailVerified && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                    {isEmailAvailable === false && <div className="tooltip-container" style={{ color: '#ef4444', display: 'flex', pointerEvents: 'auto' }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>E-mail em uso</div></div>}
                    {formData.email.length > 0 && !isEmailValid && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex', pointerEvents: 'auto' }}><AlertTriangle size={18} /><div className="tooltip-box">Deve conter @ e .com</div></div>}
                  </div>
                  {isEmailVerified && <CheckCircle size={20} color="#10b981" style={{ marginRight: '8px' }} />}
                  {!isEmailVerified && isEmailAvailable === true && (
                    <button onClick={handleSendEmail} disabled={isSendingEmail || emailCooldown > 0} style={actionButtonStyle(isSendingEmail, emailCooldown > 0)}>
                      {isSendingEmail ? <Loader2 size={16} className="animate-spin" /> : emailCooldown > 0 ? `${emailCooldown}s` : emailSent ? "Reenviar" : "Verificar"}
                    </button>
                  )}
                </div>
              </div>

              {emailSent && !isEmailVerified && (
                <div className="animate-in" style={inputContainerStyle(emailCode.length === 6 && !isEmailVerified)}>
                  <AtSign size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                  <input name={emailCodeFieldName} autoComplete="one-time-code" maxLength={6} placeholder="Código enviado ao e-mail" style={inputRawStyle} value={emailCode} onChange={e => setEmailCode(e.target.value.replace(/\D/g, ''))} />
                  <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isValidatingEmail && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                    {emailCode.length === 6 && !isValidatingEmail && !isEmailVerified && <AlertTriangle size={18} color="#ef4444" />}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', marginTop: '10px' }}>
                <div>
                  <span style={inputLabelStyle}>SENHA</span>
                  <div style={inputContainerStyle(!isPasswordStrong && formData.password.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input type={showPass ? "text" : "password"} maxLength={20} autoComplete="new-password" placeholder="" style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value.replace(/\s/g, '')})} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!isPasswordStrong && formData.password.length > 0 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">mínimo de 8 caracteres, uma letra maiúscula, um número e um símbolo.</div></div>}
                      <button onClick={() => setShowPass(!showPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>CONFIRMAR SENHA</span>
                  <div style={inputContainerStyle(!passwordsMatch && formData.confirmPassword.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input type={showConfirmPass ? "text" : "password"} maxLength={20} autoComplete="new-password" placeholder="" style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} onPaste={(e) => { e.preventDefault(); toast.error("Confirme manualmente."); }} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value.replace(/\s/g, '')})} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!passwordsMatch && formData.confirmPassword.length > 0 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Senhas diferentes</div></div>}
                      <button onClick={() => setShowConfirmPass(!showConfirmPass)} type="button" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>{showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
              </div>
              <button disabled={!isStep1Valid} onClick={() => setStep(2)} onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)} style={{ width: '100%', padding: '20px', background: isStep1Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: isStep1Valid ? 'pointer' : 'not-allowed', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}>
                <span>Próximo Passo</span> {!isStep1Valid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
          )}

          {/* ======================= PASSO 2 ======================= */}
          {step === 2 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px' }}>Identidade</h2>
              <span style={inputLabelStyle}>LINK DO PERFIL</span>
              <div style={inputContainerStyle(formData.username.length > 0 && formData.username.length < 5, isUsernameAvailable === false)}>
                <div style={{ position: 'absolute', left: '15px', color: colors.textMuted, fontSize: '14px', fontWeight: '700', zIndex: 1 }}>stackfolio.com/</div>
                <input maxLength={15} placeholder="usuario" style={{ ...inputRawStyle, paddingLeft: '108px' }} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} />
                <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUsernameChecking && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                  {isUsernameAvailable === true && !isUsernameChecking && <CheckCircle size={18} color="#10b981" />}
                  {isUsernameAvailable === false && <div className="tooltip-container" style={{ color: '#ef4444', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Usuário já em uso</div></div>}
                  {formData.username.length > 0 && formData.username.length < 5 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Mínimo 5 caracteres</div></div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '5px' }}>
                <div>
                  <span style={inputLabelStyle}>NOME DE EXIBIÇÃO (APELIDO)</span>
                  <div style={inputContainerStyle(formData.displayName.length > 0 && formData.displayName.length < 5)}>
                    <UserCircle size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={15} placeholder="Ex: Silva Neto" style={inputRawStyle} value={formData.displayName} onChange={e => handleNameFilter(e.target.value, 'displayName')} />
                    {formData.displayName.length > 0 && formData.displayName.length < 5 && <div className="tooltip-container" style={{ position: 'absolute', right: '15px', color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Mínimo 5 caracteres</div></div>}
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>NOME E SOBRENOME</span>
                  <div style={inputContainerStyle(formData.fullName.length > 0 && formData.fullName.length < 15)}>
                    <User size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={60} placeholder="Ex: Silvestre Fernandes" style={inputRawStyle} value={formData.fullName} onChange={e => handleNameFilter(e.target.value, 'fullName')} />
                    {formData.fullName.length > 0 && formData.fullName.length < 15 && <div className="tooltip-container" style={{ position: 'absolute', right: '15px', color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Mínimo 15 caracteres</div></div>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <span style={inputLabelStyle}>DATA DE NASCIMENTO</span>
                  <div style={inputContainerStyle(formData.birthDate !== '' && !isAdult(formData.birthDate))}>
                    <Cake size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input type="date" style={inputRawStyle} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                    {formData.birthDate !== '' && !isAdult(formData.birthDate) && <div className="tooltip-container" style={{ position: 'absolute', right: '40px', color: '#f59e0b', display: 'flex', zIndex: 2 }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Precisa ter 18+ anos</div></div>}
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>TELEFONE (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <Phone size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input placeholder="(00) 00000-0000" style={inputRawStyle} value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} />
                  </div>
                  <div onClick={() => setIsWhatsApp(!isWhatsApp)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', cursor: 'pointer', padding: '0 4px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} color={isWhatsApp ? '#10b981' : colors.textMuted} /><span style={{ fontSize: '12px', fontWeight: '800', color: isWhatsApp ? '#10b981' : colors.textMuted }}>WhatsApp</span></div><div style={{ width: '34px', height: '18px', background: isWhatsApp ? '#10b981' : colors.border, borderRadius: '20px', position: 'relative', transition: '0.3s' }}><div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: isWhatsApp ? '19px' : '3px', transition: '0.3s' }} /></div></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>Voltar</button>
                <button disabled={!isStep2Valid} onClick={() => setStep(3)} onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)} style={{ flex: 1, padding: '18px', background: isStep2Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isStep2Valid ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
                  <span>Continuar</span> {!isStep2Valid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* ======================= PASSO 3 ======================= */}
          {step === 3 && (
            <div className="animate-in" ref={dropdownRef}>
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '8px' }}>Perfil Profissional</h2>
              <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '25px' }}>Quase lá! Completa a tua Stack para criar o teu perfil de dev.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '5px' }}>
                <div>
                  <span style={inputLabelStyle}>
                    <span>CARGO ATUAL OU PRETENDIDO</span>
                    <span>{formData.role.length}/25</span>
                  </span>
                  <div style={inputContainerStyle(false)}>
                    <Briefcase size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input 
                      list="roles" maxLength={25} placeholder="Ex: Desenvolvedor..." style={inputRawStyle} 
                      value={formData.role} onChange={handleRoleChange} 
                    />
                    <datalist id="roles">{TECH_ROLES.map(r => <option key={r} value={r}/>)}</datalist>
                  </div>
                </div>
                
                {/* DROPDOWN SENIORIDADE CUSTOMIZADO */}
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>SENIORIDADE</span>
                  <div onClick={(e) => toggleDropdown(e, setShowSeniorityDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <GraduationCap size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.seniority ? colors.text : colors.textMuted }}>
                      {formData.seniority ? (
                        <>
                          <div className="status-dot" style={{ background: seniorityOptions.find(o => o.label === formData.seniority)?.color }} />
                          <span>{formData.seniority}</span>
                        </>
                      ) : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showSeniorityDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {seniorityOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, seniority: opt.label}); setShowSeniorityDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> 
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '5px' }}>
                <div>
                  <span style={inputLabelStyle}>CEP (LOCALIZAÇÃO)</span>
                  <div style={inputContainerStyle(false)}>
                    <MapPin size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={9} placeholder="00000-000" style={inputRawStyle} value={formData.cep} onChange={e => handleCepChange(e.target.value)} />
                  </div>
                </div>
                <div>
                  <span style={inputLabelStyle}>CIDADE / ESTADO</span>
                  <div style={inputContainerStyle(false)}>
                    <input placeholder="Preenchido pelo CEP..." style={{...inputRawStyle, paddingLeft: '15px', opacity: 0.7}} value={formData.location} disabled />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '5px' }}>
                {/* DROPDOWN INGLÊS CUSTOMIZADO */}
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>NÍVEL DE INGLÊS</span>
                  <div onClick={(e) => toggleDropdown(e, setShowEnglishDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Languages size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.englishLevel ? colors.text : colors.textMuted }}>
                      {formData.englishLevel ? (
                        <>
                          <div className="status-dot" style={{ background: englishOptions.find(o => o.label === formData.englishLevel)?.color }} />
                          <span>{formData.englishLevel}</span>
                        </>
                      ) : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showEnglishDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {englishOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, englishLevel: opt.label}); setShowEnglishDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> 
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DROPDOWN DISPONIBILIDADE CUSTOMIZADO */}
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>DISPONIBILIDADE</span>
                  <div onClick={(e) => toggleDropdown(e, setShowAvailabilityDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Clock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.availability ? colors.text : colors.textMuted }}>
                      {formData.availability ? (
                        <>
                          <div className="status-dot" style={{ background: availabilityOptions.find(o => o.label === formData.availability)?.color }} />
                          <span>{formData.availability}</span>
                        </>
                      ) : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showAvailabilityDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {availabilityOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, availability: opt.label}); setShowAvailabilityDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> 
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span style={inputLabelStyle}>
                <span>RESUMO / BIO (OPCIONAL)</span>
                <span>{formData.bio.length}/500</span>
              </span>
              <div style={{ ...inputContainerStyle(false), height: '60px', padding: '10px 15px', alignItems: 'flex-start' }}>
                <textarea 
                  maxLength={500}
                  placeholder="Conta um pouco sobre a tua experiência e objetivos..." 
                  style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '13px', resize: 'none' }}
                  value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <span style={inputLabelStyle}>
                <span>FERRAMENTAS E TECNOLOGIAS</span>
                <span>{formData.tools.length}/10</span>
              </span>
              <div style={{ ...inputContainerStyle(false), height: 'auto', minHeight: '52px', flexWrap: 'wrap', padding: '6px 14px', gap: '8px', alignItems: 'center' }}>
                {formData.tools.length === 0 && <Code size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />}
                
                {/* TAGS ORDENÁVEIS (Drag & Drop) */}
                {formData.tools.map((t, index) => (
                  <div 
                    key={t} 
                    draggable 
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, index)}
                    className="animate-in" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'grab', border: `1px solid ${colors.border}` }}
                  >
                    <GripVertical size={12} style={{ color: colors.textMuted, marginLeft: '-4px' }} />
                    <SkillIcon slug={t} size={14} /> {t}
                    <X size={12} style={{ cursor: 'pointer', opacity: 0.8, color: '#ef4444' }} onClick={() => setFormData({...formData, tools: formData.tools.filter(s => s !== t)})} />
                  </div>
                ))}
                
                {/* DROPDOWN PESQUISÁVEL DE FERRAMENTAS (SEM ENTER LIVRE) */}
                {formData.tools.length < 10 && (
                  <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
                    <input 
                      placeholder={formData.tools.length === 0 ? "Pesquisar tecnologia..." : "Pesquisar mais..."} 
                      style={{ width: '100%', background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '14px', paddingLeft: formData.tools.length === 0 ? '28px' : '4px', height: '36px' }}
                      value={toolSearch}
                      onChange={e => { setToolSearch(e.target.value); setShowToolDropdown(true); }}
                      onFocus={() => { setShowToolDropdown(true); setShowSeniorityDropdown(false); setShowEnglishDropdown(false); setShowAvailabilityDropdown(false); }}
                      onKeyDown={handleToolKeyDown} // Impede de adicionar texto livre
                    />
                    {showToolDropdown && filteredTools.length > 0 && (
                      <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                        {filteredTools.map(t => (
                          <div key={t} className="dropdown-item" onClick={() => handleAddTool(t)}>
                            <SkillIcon slug={t} size={14} /> <span style={{ marginLeft: '10px' }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setStep(2)} disabled={isRegistering} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: isRegistering ? 'not-allowed' : 'pointer', opacity: isRegistering ? 0.5 : 1, transition: 'all 0.2s' }}>Voltar</button>
                <button 
                  onClick={handleRegister} 
                  disabled={isRegistering || !isStep3Valid} 
                  style={{ flex: 1, padding: '18px', background: isStep3Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: isRegistering || !isStep3Valid ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                >
                  {isRegistering ? <Loader2 size={18} className="animate-spin" /> : <>Criar Conta <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .tooltip-container { position: relative; }
        .tooltip-box { visibility: hidden; width: 180px; background-color: #334155; color: #fff; text-align: center; border-radius: 8px; padding: 10px; position: absolute; z-index: 100; bottom: 130%; right: 0; opacity: 0; transition: opacity 0.3s; font-size: 11px; font-weight: 600; line-height: 1.4; }
        .tooltip-container:hover .tooltip-box { visibility: visible; opacity: 1; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        
        /* Estilos dos Dropdowns Customizados e Bolinhas Centralizadas */
        .custom-dropdown { position: absolute; top: calc(100% + 5px); left: 0; width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 50; max-height: 200px; overflow-y: auto; }
        .dropdown-item { padding: 12px 15px; font-size: 13px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; }
        .dropdown-item:hover { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-right: 8px; transform: translateY(0.5px); }

        /* Scrollbar subtil para os dropdowns */
        .custom-dropdown::-webkit-scrollbar { width: 6px; }
        .custom-dropdown::-webkit-scrollbar-track { background: transparent; }
        .custom-dropdown::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 10px; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}