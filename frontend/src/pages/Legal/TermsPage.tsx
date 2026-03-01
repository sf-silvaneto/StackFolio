import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <div style={{ padding: '40px 10%', backgroundColor: '#0a0a0a', color: '#ededed', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Link to="/" style={{ color: '#6366f1', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← Voltar para a Home</Link>
      
      <h1 style={{ color: '#fff' }}>Termos de Serviço</h1>
      <p style={{ color: '#a1a1aa' }}>Última atualização: Fevereiro de 2026</p>
      
      <div style={{ marginTop: '30px', lineHeight: '1.6', color: '#d4d4d8' }}>
        <h2>1. Aceitação dos Termos</h2>
        <p>Ao acessar e usar o StackFolio, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.</p>

        <h2>2. Uso da Plataforma</h2>
        <p>O StackFolio é um portfólio digital e hub de projetos. Os usuários são responsáveis por garantir que os códigos, diagramas de rede e projetos postados não infrinjam direitos autorais de terceiros ou contenham dados sensíveis de empresas.</p>

        <h2>3. Isenção de Responsabilidade</h2>
        <p>Os materiais no StackFolio são fornecidos "como estão". Não oferecemos garantias de que a plataforma estará livre de interrupções ou erros, dado o seu caráter educacional e de desenvolvimento contínuo.</p>

        <h2>4. Modificações</h2>
        <p>O StackFolio pode revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual destes termos de serviço.</p>
      </div>
    </div>
  );
}