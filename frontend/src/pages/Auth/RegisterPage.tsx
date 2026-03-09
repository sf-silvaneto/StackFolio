import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, Lock, Sun, Moon, ArrowRight, Eye, EyeOff, AlertTriangle,
  User, Cake, Phone, Briefcase, MapPin, X, Terminal, Code, Plus, CheckCircle, 
  MessageCircle, Loader2, UserCircle, Ban, AtSign, ChevronDown, 
  Languages, Clock, GripVertical, Award, BookOpen, Github, Linkedin, Building, GraduationCap, Calendar, Users
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
      'unreal engine': 'unrealengine', 'blender': 'blender',
      'sketch': 'sketch', 'adobe xd': 'adobexd', 'photoshop': 'adobephotoshop',
      'illustrator': 'adobeillustrator', 'indesign': 'adobeindesign', 'canva': 'canva',
      'miro': 'miro', 'framer': 'framer', 'vercel': 'vercel', 'netlify': 'netlify',
      'heroku': 'heroku', 'digitalocean': 'digitalocean', 'postman': 'postman',
      'webpack': 'webpack', 'redux': 'redux', 'material ui': 'mui', 'chakra ui': 'chakraui',
      'ant design': 'antdesign', 'bootstrap': 'bootstrap', 'three.js': 'threedotjs',
      'swagger': 'swagger', 'fastapi': 'fastapi', 'flask': 'flask', 'ruby on rails': 'rubyonrails',
      '.net': 'dotnet', 'playwright': 'playwright', 'storybook': 'storybook'
    };
    return map[val] || val.replace(/[^a-z0-9]/g, '');
  };
  
  const finalSlug = getCorrectSlug(slug);
  if (error || !finalSlug) return <Terminal size={size} color="#fff" />;
  
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

const TECH_ROLES = [
  "Analista de Dados", "Arquiteto de Software", "Data Scientist", "Desenvolvedor Android",
  "Desenvolvedor Backend", "Desenvolvedor Frontend", "Desenvolvedor Fullstack", "Desenvolvedor iOS", 
  "Desenvolvedor Mobile", "Dev IoT & Robotics", "DevOps Engineer", "Engenheiro de Dados", 
  "Engenheiro de Software", "Especialista em Cloud", "Product Designer", "Product Manager", 
  "QA Engineer", "SRE", "Scrum Master", "Tech Lead", "UI/UX Designer"
].sort();

const TECH_COURSES = [
  "Análise e Desenvolvimento de Sistemas", "Banco de Dados", "Ciência da Computação", 
  "Ciência de Dados", "Design Digital", "Design Gráfico", "Engenharia da Computação", 
  "Engenharia de Software", "Gestão da Tecnologia da Informação", "Inteligência Artificial",
  "Jogos Digitais", "Mecatrônica", "Redes de Computadores", "Segurança da Informação", 
  "Sistemas Embarcados", "Sistemas de Informação", "UX/UI Design"
].sort();

const AVAILABLE_TOOLS = [
  ".NET", "Adobe XD", "Angular", "Ansible", "Ant Design", "Apache", "Arduino", "AWS", "Axios", 
  "Azure", "Bash", "Bitbucket", "Blender", "Bootstrap", "C#", "C++", "Canva", "Chakra UI", "CSS3", 
  "Cypress", "Dart", "Datadog", "DigitalOcean", "Django", "Docker", "Elasticsearch", "ESP32", 
  "Excel", "Express", "FastAPI", "Figma", "Firebase", "Flask", "Flutter", "Framer", "Git", 
  "GitHub", "GitLab", "Go", "Google Cloud", "Grafana", "GraphQL", "Heroku", "HTML5", "Illustrator", 
  "InDesign", "Java", "JavaScript", "Jenkins", "Jest", "Jira", "Kotlin", "Kubernetes", "Laravel", 
  "Linux", "Magento", "Material UI", "Miro", "MobX", "MongoDB", "MySQL", "NestJS", "Netlify", 
  "Next.js", "Nginx", "Node.js", "Nuxt.js", "Photoshop", "PHP", "Playwright", "PostgreSQL", 
  "Postman", "PowerBI", "PowerShell", "Prisma", "Prometheus", "Puppeteer", "Python", "RabbitMQ", 
  "React", "React Native", "Redis", "Redux", "Ruby", "Ruby on Rails", "Rust", "Salesforce", 
  "Sass", "Shopify", "Sketch", "Socket.io", "Spring", "Storybook", "Supabase", "Svelte", 
  "Swagger", "Swift", "Tableau", "Tailwind CSS", "Terraform", "Three.js", "TypeScript", 
  "Unity", "Unreal Engine", "Vercel", "Vite", "Vue.js", "Webflow", "Webpack", "WebRTC", "WordPress", "Zustand"
].sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));

const RESERVED_WORDS = [
  'admin', 'login', 'logar', 'entrar', 'signin', 'sign-in', 'register', 'registrar', 
  'registro', 'cadastro', 'cadastrar', 'signup', 'sign-up', 'logout', 'sair', 'auth', 
  'password', 'senha', 'recover', 'recuperar', 'reset', 'forgot', 'esqueci', 'verify', 
  'verificar', 'oauth', 'oauth2', 'sso', 'mfa', '2fa', 'magiclink',
  'perfil', 'profile', 'home', 'index', 'dashboard', 'painel', 'settings', 'config', 
  'configuracoes', 'explore', 'explorar', 'feed', 'timeline', 'search', 'busca', 
  'buscar', 'pesquisa', 'jobs', 'vaga', 'vagas', 'careers', 'carreiras', 'empresas', 
  'companies', 'company', 'projetos', 'projects', 'project', 'portfolio', 'curriculo', 
  'cv', 'resume', 'network', 'conexoes', 'connections', 'friends', 'amigos', 
  'followers', 'seguidores', 'following', 'seguindo', 'inbox', 'messages', 'message', 
  'mensagens', 'mensagem', 'chat', 'dm', 'pm', 'talk', 'conversas', 'notifications', 
  'notificacoes', 'forum', 'community', 'comunidade', 'events', 'eventos', 'courses', 
  'cursos', 'learn', 'aprender', 'certifications', 'certificados', 'talents', 'talentos', 
  'recruiters', 'recrutadores', 'hire', 'contratar', 'freelance', 'freelancer', 
  'analytics', 'stats', 'estatisticas', 'post', 'posts', 'article', 'artigo', 
  'news', 'noticias', 'blog', 'update', 'updates', 'changelog', 'releases',
  'likes', 'favoritos', 'favorites', 'saved', 'salvos', 'bookmarks', 'groups', 
  'grupos', 'pages', 'paginas', 'trending', 'popular', 'latest', 'recentes',
  'suporte', 'help', 'ajuda', 'faq', 'contact', 'contato', 'about', 'sobre', 
  'stackfolio', 'termos', 'terms', 'privacy', 'privacidade', 'legal', 'tos', 
  'copyright', 'dmca', 'report', 'reportar', 'denunciar', 'abuse', 'abuso', 
  'status', 'pricing', 'planos', 'billing', 'assinatura', 'pagamento', 'premium', 
  'pro', 'vip', 'sponsor', 'patrocinador', 'partner', 'parceiros', 'press', 
  'imprensa', 'media', 'midia', 'official', 'oficial', 'verified', 'verificado', 
  'trust', 'security', 'seguranca', 'marketing', 'ads', 'afiliados', 'affiliates', 
  'promo', 'promocao', 'sales', 'vendas', 'hr', 'rh', 'it', 'ti',
  'api', 'graphql', 'rest', 'webhook', 'webhooks', 'root', 'system', 'sysadmin', 
  'administrator', 'moderator', 'mod', 'staff', 'test', 'teste', 'demo', 'sandbox', 
  'guest', 'convidado', 'anonymous', 'anonimo', 'null', 'undefined', 'void', 'user', 
  'users', 'app', 'web', 'mail', 'email', 'host', 'server', 'bot', 'robot', 'assets', 
  'static', 'public', 'images', 'img', 'css', 'js', 'fonts', 'favicon', 'robots', 
  'sitemap', 'rss', 'json', 'xml', 'yaml', 'yml', 'md', 'mdx', 'socket', 'ws', 
  'cdn', 'swagger', 'openapi', '.well-known', 'manifest', 'pwa',
  'foda', 'fodase', 'foda-se', 'caralho', 'puta', 'puto', 'merda', 'bosta', 'cu',
  'buceta', 'pica', 'cacete', 'porra', 'corno', 'arrombado', 'viado', 'viadinho', 
  'babaca', 'fdp', 'pqp', 'vtnc', 'vsf', 'kct', 'vagabundo', 'vagabunda', 'safado', 
  'safada', 'pinto', 'rola', 'xoxota', 'macaco', 'boquete', 'punheta', 'siririca', 
  'cuzao', 'cuzinho', 'sapatao', 'vadia', 'rapariga', 'maconheiro', 'incel',
  'fuck', 'shit', 'bitch', 'cunt', 'dick', 'ass', 'asshole', 'slut', 'whore', 'fag', 
  'faggot', 'dyke', 'tranny', 'retard', 'nigga', 'nigger', 'kys', 'kill',
  'retardado', 'trouxa', 'otario', 'lixo', 'nazi', 'nazista', 'nazism', 'hitler',
  'racista', 'fascista', 'terrorista', 'terrorist', 'pedofilo', 'pedofilia', 
  'estupro', 'estuprador', 'rape', 'suicidio', 'suicide', 'murder', 'assassinato',
  'gore', 'porn', 'porno', 'nsfw', 'xxx', 'sex', 'sexo', 'nude', 'nudes', 'onlyfans'
];

const seniorityOptions = [
  { label: "Nenhuma", color: "#94a3b8" },
  { label: "Estudante", color: "#38bdf8" },
  { label: "Júnior", color: "#22c55e" },
  { label: "Pleno", color: "#eab308" },
  { label: "Sênior", color: "#f97316" },
  { label: "Especialista", color: "#8b5cf6" },
  { label: "Tech Lead", color: "#ef4444" },
];

const educationOptions = [
  { label: "Autodidata", color: "#94a3b8" },
  { label: "Técnico (Cursando)", color: "#38bdf8" },
  { label: "Técnico (Concluído)", color: "#0ea5e9" },
  { label: "Graduação (Cursando)", color: "#eab308" },
  { label: "Graduação (Concluída)", color: "#22c55e" },
  { label: "Pós / Mestrado", color: "#8b5cf6" },
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

const genderOptions = [
  { label: "Masculino" },
  { label: "Feminino" },
  { label: "Prefere não informar" },
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

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

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
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showEnglishDropdown, setShowEnglishDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    username: '', displayName: '', fullName: '', 
    birthDate: '', phone: '', gender: '',
    role: '', seniority: '', englishLevel: '', availability: '', bio: '', 
    cep: '', location: '', github: '', linkedin: '', tools: [] as string[],
    educationLevel: '', institution: '', course: '', eduStartDate: '', eduEndDate: ''
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
      const val = formData.username.toLowerCase();
      if (val.length >= 5) {
        if (RESERVED_WORDS.includes(val)) {
          setIsUsernameAvailable(false);
          return;
        }
        setIsUsernameChecking(true);
        try {
          const response = await api.get(`/auth/check-username?username=${val}`);
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
        setShowEducationDropdown(false);
        setShowEnglishDropdown(false);
        setShowAvailabilityDropdown(false);
        setShowToolDropdown(false);
        setShowGenderDropdown(false);
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
      toast.success("Código enviado para o seu e-mail!");
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
      setIsFetchingCep(true);
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
      } finally {
        setIsFetchingCep(false);
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    setFormData({...formData, role: val.substring(0, 25)});
  };

  const handleAddTool = (tool: string) => {
    if (formData.tools.length < 10 && !formData.tools.includes(tool)) {
      setFormData({ ...formData, tools: [...formData.tools, tool] });
      setToolSearch('');
      setShowToolDropdown(false);
    } else if (formData.tools.length >= 10) {
      toast.error("Limite máximo de 10 ferramentas atingido.");
    }
  };

  const handleToolKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        handleAddTool(filteredTools[0]);
      }
    }
  };

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

    let educationPayload = undefined;
    if (formData.educationLevel || formData.institution || formData.course) {
      educationPayload = JSON.stringify({
        level: formData.educationLevel,
        institution: formData.institution,
        course: formData.course,
        start: formData.eduStartDate,
        end: formData.eduEndDate
      });
    }

    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        displayName: formData.displayName,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        birthDate: formData.birthDate || undefined,
        gender: formData.gender || undefined,
        role: formData.role || undefined,
        seniority: formData.seniority || undefined,
        education: educationPayload, 
        englishLevel: formData.englishLevel || undefined,
        availability: formData.availability || undefined,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined,
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
  
  const isStep1Valid = isEmailValid && isPasswordStrong && passwordsMatch && isEmailAvailable === true && isEmailVerified && agreedToTerms;

  const isStep2Valid = 
    formData.username.length >= 5 && isUsernameAvailable === true && 
    formData.displayName.length >= 5 && formData.fullName.length >= 15 && 
    isAdult(formData.birthDate) && formData.gender !== '';

  const isStep3Valid = formData.role.trim() !== '' && formData.seniority !== '' && formData.availability !== '' && formData.englishLevel !== '';

  const calculateProgress = () => {
    let score = 0;
    if (isEmailValid && isEmailAvailable && isEmailVerified) score += 20;
    if (isStep1Valid) score += 20;
    if (formData.username.length >= 5 && isUsernameAvailable === true) score += 20;
    if (formData.displayName.length >= 5 && formData.fullName.length >= 15 && isAdult(formData.birthDate) && formData.gender !== '') score += 20;
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

  const toggleDropdown = (e: React.MouseEvent, setter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
    e.stopPropagation();
    if (currentState) {
      setter(false); 
    } else {
      setShowSeniorityDropdown(false); setShowEducationDropdown(false); setShowEnglishDropdown(false); setShowAvailabilityDropdown(false); setShowToolDropdown(false); setShowGenderDropdown(false);
      setter(true);
    }
  };

  const filteredTools = AVAILABLE_TOOLS.filter(t => t.toLowerCase().includes(toolSearch.toLowerCase()) && !formData.tools.includes(t));

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', color: colors.text, position: 'relative', zIndex: 1, overflowX: 'hidden' }}>
      
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
        <div style={{ 
          background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '28px', padding: '50px', 
          width: '100%', 
          maxWidth: step === 3 ? '850px' : '660px', 
          boxShadow: '0 15px 50px rgba(0,0,0,0.06)',
          transition: 'max-width 0.4s ease'
        }}>
          
          {/* ======================= PASSO 1 ======================= */}
          {step === 1 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '30px' }}>Criar Conta</h2>
              <span style={inputLabelStyle}>E-MAIL OBRIGATÓRIO</span>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', marginTop: '10px' }}>
                <div>
                  <span style={inputLabelStyle}>SENHA</span>
                  <div style={inputContainerStyle(!isPasswordStrong && formData.password.length > 0)}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted, zIndex: 1 }} />
                    <input type={showPass ? "text" : "password"} maxLength={20} autoComplete="new-password" placeholder="" style={{ ...inputRawStyle, color: theme === 'light' ? '#64748b' : '#94a3b8' }} onPaste={(e) => { e.preventDefault(); toast.error("Digite manualmente."); }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value.replace(/\s/g, '')})} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                      {!isPasswordStrong && formData.password.length > 0 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Requer: 8+ chars, maiúscula, nº e símbolo</div></div>}
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

              {/* ACEITE DE TERMOS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#10b981' }} />
                <label htmlFor="terms" style={{ fontSize: '12px', color: colors.textMuted, cursor: 'pointer', lineHeight: '1.4' }}>
                  Li e concordo com os <span onClick={(e) => {e.preventDefault(); navigate('/termos');}} style={{ color: colors.primary, fontWeight: '600' }}>Termos de Uso</span> e a <span onClick={(e) => {e.preventDefault(); navigate('/privacidade');}} style={{ color: colors.primary, fontWeight: '600' }}>Política de Privacidade</span>.
                </label>
              </div>

              <button disabled={!isStep1Valid} onClick={() => setStep(2)} onMouseEnter={() => setIsHoveringNext(true)} onMouseLeave={() => setIsHoveringNext(false)} style={{ width: '100%', padding: '20px', background: isStep1Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: isStep1Valid ? 'pointer' : 'not-allowed', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}>
                <span>Próximo Passo</span> {!isStep1Valid && isHoveringNext ? <Ban size={18} /> : <ArrowRight size={18} />}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '13px', color: colors.textMuted }}>
                  Já tem uma conta? <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: colors.primary, fontWeight: '800', cursor: 'pointer', padding: 0 }}>Entrar</button>
                </span>
              </div>
            </div>
          )}

          {/* ======================= PASSO 2 ======================= */}
          {step === 2 && (
            <div className="animate-in" ref={dropdownRef}>
              <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px' }}>Identidade</h2>
              
              <span style={inputLabelStyle}>LINK DO PERFIL</span>
              <div style={inputContainerStyle(formData.username.length > 0 && formData.username.length < 5, isUsernameAvailable === false)}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '15px', height: '100%' }}>
                  <span style={{ color: colors.textMuted, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', userSelect: 'none' }}>stackfolio.com/</span>
                  <input maxLength={15} placeholder="usuario" style={{ flex: 1, background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '14px', fontWeight: '900', padding: 0, height: '100%' }} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} />
                </div>
                <div style={{ position: 'absolute', right: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUsernameChecking && <Loader2 size={16} className="animate-spin" color={colors.textMuted} />}
                  {isUsernameAvailable === true && !isUsernameChecking && <CheckCircle size={18} color="#10b981" />}
                  {isUsernameAvailable === false && <div className="tooltip-container" style={{ color: '#ef4444', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Usuário em uso ou reservado</div></div>}
                  {formData.username.length > 0 && formData.username.length < 5 && <div className="tooltip-container" style={{ color: '#f59e0b', display: 'flex' }}><AlertTriangle size={18} /><div className="tooltip-box">Mínimo 5 caracteres</div></div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '5px' }}>
                <div>
                  <span style={inputLabelStyle}>NOME DE EXIBIÇÃO</span>
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

              {/* GRID DE 3 COLUNAS PARA NASCIMENTO, GÊNERO E TELEFONE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <span style={inputLabelStyle}>DATA DE NASCIMENTO</span>
                  <div style={inputContainerStyle(formData.birthDate !== '' && !isAdult(formData.birthDate))}>
                    <Cake size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input type="date" style={inputRawStyle} value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                    {formData.birthDate !== '' && !isAdult(formData.birthDate) && <div className="tooltip-container" style={{ position: 'absolute', right: '10px', color: '#f59e0b', display: 'flex', zIndex: 2 }}><AlertTriangle size={18} /><div className="tooltip-box" style={{ background: '#ef4444' }}>Precisa ter 18+ anos</div></div>}
                  </div>
                </div>
                
                {/* NOVO CAMPO: GÊNERO / SEXUALIDADE */}
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>GÊNERO / SEXUALIDADE</span>
                  <div onClick={(e) => toggleDropdown(e, setShowGenderDropdown, showGenderDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Users size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.gender ? colors.text : colors.textMuted }}>
                      {formData.gender ? formData.gender : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showGenderDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {genderOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, gender: opt.label}); setShowGenderDropdown(false);}}>
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span style={inputLabelStyle}>TELEFONE (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <Phone size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input placeholder="(00) 00000-0000" style={inputRawStyle} value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} />
                  </div>
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
              <p style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '25px' }}>Quase lá! Completa a tua Stack e redes para criar o teu perfil de dev.</p>
              
              {/* --- BLOCO 1: ATUAÇÃO PROFISSIONAL E DISPONIBILIDADE --- */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <span style={inputLabelStyle}><span>CARGO ATUAL</span><span>{formData.role.length}/25</span></span>
                  <div style={inputContainerStyle(false)}>
                    <Briefcase size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input list="roles" maxLength={25} placeholder="Ex: Desenvolvedor..." style={inputRawStyle} value={formData.role} onChange={handleRoleChange} />
                    <datalist id="roles">{TECH_ROLES.map(r => <option key={r} value={r}/>)}</datalist>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>SENIORIDADE</span>
                  <div onClick={(e) => toggleDropdown(e, setShowSeniorityDropdown, showSeniorityDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Award size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.seniority ? colors.text : colors.textMuted }}>
                      {formData.seniority ? <><div className="status-dot" style={{ background: seniorityOptions.find(o => o.label === formData.seniority)?.color }} /><span>{formData.seniority}</span></> : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showSeniorityDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {seniorityOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, seniority: opt.label}); setShowSeniorityDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>DISPONIBILIDADE</span>
                  <div onClick={(e) => toggleDropdown(e, setShowAvailabilityDropdown, showAvailabilityDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Clock size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.availability ? colors.text : colors.textMuted }}>
                      {formData.availability ? <><div className="status-dot" style={{ background: availabilityOptions.find(o => o.label === formData.availability)?.color }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.availability}</span></> : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showAvailabilityDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {availabilityOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, availability: opt.label}); setShowAvailabilityDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* --- BLOCO 2: LOCALIZAÇÃO E IDIOMA --- */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <span style={inputLabelStyle}>NÍVEL DE INGLÊS</span>
                  <div onClick={(e) => toggleDropdown(e, setShowEnglishDropdown, showEnglishDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                    <Languages size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.englishLevel ? colors.text : colors.textMuted }}>
                      {formData.englishLevel ? <><div className="status-dot" style={{ background: englishOptions.find(o => o.label === formData.englishLevel)?.color }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.englishLevel}</span></> : 'Selecionar...'}
                    </div>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                  </div>
                  {showEnglishDropdown && (
                    <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                      {englishOptions.map(opt => (
                        <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, englishLevel: opt.label}); setShowEnglishDropdown(false);}}>
                          <div className="status-dot" style={{ background: opt.color }} /> <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span style={inputLabelStyle}>CEP (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <MapPin size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <input maxLength={9} placeholder="00000-000" style={inputRawStyle} value={formData.cep} onChange={e => handleCepChange(e.target.value)} />
                  </div>
                </div>

                <div>
                  <span style={inputLabelStyle}>CIDADE / ESTADO (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <input placeholder={isFetchingCep ? "A procurar localização..." : "Preenchido pelo CEP"} style={{...inputRawStyle, paddingLeft: '15px', opacity: 0.7}} value={isFetchingCep ? "A procurar..." : formData.location} disabled />
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: colors.border, margin: '25px 0' }} />

              {/* --- BLOCO 3: FORMAÇÃO ACADÊMICA DETALHADA --- */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={18} color={colors.primary} /> Formação Acadêmica (Opcional)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={inputLabelStyle}>NÍVEL / STATUS</span>
                    <div onClick={(e) => toggleDropdown(e, setShowEducationDropdown, showEducationDropdown)} style={{ ...inputContainerStyle(false), cursor: 'pointer', userSelect: 'none' }}>
                      <BookOpen size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                      <div style={{ ...inputRawStyle, display: 'flex', alignItems: 'center', color: formData.educationLevel ? colors.text : colors.textMuted }}>
                        {formData.educationLevel ? <><div className="status-dot" style={{ background: educationOptions.find(o => o.label === formData.educationLevel)?.color }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.educationLevel}</span></> : 'Selecionar...'}
                      </div>
                      <ChevronDown size={16} style={{ position: 'absolute', right: '15px', color: colors.textMuted }} />
                    </div>
                    {showEducationDropdown && (
                      <div className="custom-dropdown" style={{ background: theme === 'dark' ? '#1e293b' : '#fff', border: `1px solid ${colors.border}` }}>
                        {educationOptions.map(opt => (
                          <div key={opt.label} className="dropdown-item" onClick={() => {setFormData({...formData, educationLevel: opt.label}); setShowEducationDropdown(false);}}>
                            <div className="status-dot" style={{ background: opt.color }} /> <span>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <span style={inputLabelStyle}>INSTITUIÇÃO / FACULDADE</span>
                    <div style={inputContainerStyle(false)}>
                      <Building size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                      <input maxLength={50} placeholder="Ex: USP, FIAP, Udemy..." style={inputRawStyle} value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <span style={inputLabelStyle}>NOME DO CURSO</span>
                    <div style={inputContainerStyle(false)}>
                      <Code size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                      <input list="courses" maxLength={50} placeholder="Ex: Engenharia..." style={inputRawStyle} value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
                      <datalist id="courses">{TECH_COURSES.map(c => <option key={c} value={c}/>)}</datalist>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <span style={inputLabelStyle}>DATA DE INÍCIO</span>
                    <div style={inputContainerStyle(false)}>
                      <Calendar size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                      <input type="month" style={{ ...inputRawStyle, textTransform: 'capitalize' }} value={formData.eduStartDate} onChange={e => setFormData({...formData, eduStartDate: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <span style={inputLabelStyle}>TÉRMINO / PREVISÃO</span>
                    <div style={inputContainerStyle(false)}>
                      <Calendar size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                      <input type="month" style={{ ...inputRawStyle, textTransform: 'capitalize' }} value={formData.eduEndDate} onChange={e => setFormData({...formData, eduEndDate: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: colors.border, margin: '25px 0' }} />

              {/* --- BLOCO 4: REDES E SKILLS --- */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <span style={inputLabelStyle}>GITHUB (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <Github size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '45px', height: '100%' }}>
                      <span style={{ color: colors.textMuted, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', userSelect: 'none' }}>github.com/</span>
                      <input maxLength={30} placeholder="usuario" style={{ flex: 1, background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '14px', fontWeight: '700', padding: 0, height: '100%' }} value={formData.github} onChange={e => setFormData({...formData, github: e.target.value.replace(/[^a-zA-Z0-9-]/g, '')})} />
                    </div>
                  </div>
                </div>

                <div>
                  <span style={inputLabelStyle}>LINKEDIN (OPCIONAL)</span>
                  <div style={inputContainerStyle(false)}>
                    <Linkedin size={18} style={{ position: 'absolute', left: '15px', color: '#0a66c2' }} />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '45px', height: '100%' }}>
                      <span style={{ color: colors.textMuted, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', userSelect: 'none' }}>linkedin.com/in/</span>
                      <input maxLength={30} placeholder="usuario" style={{ flex: 1, background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '14px', fontWeight: '700', padding: 0, height: '100%' }} value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value.replace(/[^a-zA-Z0-9-]/g, '')})} />
                    </div>
                  </div>
                </div>
              </div>

              <span style={inputLabelStyle}><span>RESUMO / BIO (OPCIONAL)</span><span>{formData.bio.length}/500</span></span>
              <div style={{ ...inputContainerStyle(false), height: '100px', padding: '12px 15px', alignItems: 'flex-start' }}>
                <textarea className="custom-scrollbar" maxLength={500} placeholder="Conte um pouco sobre a sua experiência, tecnologias favoritas e objetivos de carreira..." style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '13px', resize: 'none', lineHeight: '1.6' }} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>

              <span style={inputLabelStyle}><span>FERRAMENTAS E TECNOLOGIAS (OPCIONAL)</span><span>{formData.tools.length}/10</span></span>
              <div style={{ ...inputContainerStyle(false), height: 'auto', minHeight: '52px', flexWrap: 'wrap', padding: '6px 14px', gap: '8px', alignItems: 'center' }}>
                {formData.tools.length === 0 && <Code size={18} style={{ position: 'absolute', left: '15px', color: colors.textMuted }} />}
                
                {formData.tools.map((t, index) => (
                  <div key={t} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, index)} className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#0f172a', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'grab', border: `1px solid ${colors.border}` }}>
                    <GripVertical size={12} style={{ color: colors.textMuted, marginLeft: '-4px' }} />
                    <SkillIcon slug={t} size={14} /> {t}
                    <X size={12} style={{ cursor: 'pointer', opacity: 0.8, color: '#ef4444' }} onClick={() => setFormData({...formData, tools: formData.tools.filter(s => s !== t)})} />
                  </div>
                ))}
                
                {formData.tools.length < 10 && (
                  <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
                    <input placeholder={formData.tools.length === 0 ? "Pesquisar tecnologia..." : "Pesquisar mais..."} style={{ width: '100%', background: 'transparent', border: 'none', color: colors.text, outline: 'none', fontSize: '14px', paddingLeft: formData.tools.length === 0 ? '28px' : '4px', height: '36px' }} value={toolSearch} onChange={e => { setToolSearch(e.target.value); setShowToolDropdown(true); }} onFocus={() => { setShowToolDropdown(true); setShowSeniorityDropdown(false); setShowEducationDropdown(false); setShowEnglishDropdown(false); setShowAvailabilityDropdown(false); }} onKeyDown={handleToolKeyDown} />
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

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button onClick={() => setStep(2)} disabled={isRegistering} style={{ flex: 0.4, padding: '18px', borderRadius: '14px', border: `1px solid ${colors.border}`, color: colors.text, background: 'none', fontWeight: '800', cursor: isRegistering ? 'not-allowed' : 'pointer', opacity: isRegistering ? 0.5 : 1, transition: 'all 0.2s' }}>Voltar</button>
                <button onClick={handleRegister} disabled={isRegistering || !isStep3Valid} style={{ flex: 1, padding: '18px', background: isStep3Valid ? colors.primary : colors.border, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: isRegistering || !isStep3Valid ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                  {isRegistering ? <Loader2 size={18} className="animate-spin" /> : <>Criar Conta e Perfil <ArrowRight size={18} /></>}
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
        
        .custom-dropdown { position: absolute; top: calc(100% + 5px); left: 0; width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 50; max-height: 200px; overflow-y: auto; }
        .dropdown-item { padding: 12px 15px; font-size: 13px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; }
        .dropdown-item:hover { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-right: 8px; transform: translateY(0.5px); }

        /* Estilização dos inputs tipo month para esconder os spinners extras no Chrome/Edge e manter o visual limpo */
        input[type="month"]::-webkit-inner-spin-button, input[type="month"]::-webkit-calendar-picker-indicator { opacity: 1; cursor: pointer; }

        .custom-scrollbar::-webkit-scrollbar, .custom-dropdown::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track, .custom-dropdown::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb, .custom-dropdown::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 10px; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}