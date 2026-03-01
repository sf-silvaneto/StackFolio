import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div style={{ padding: '40px 10%', backgroundColor: '#0a0a0a', color: '#ededed', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Link to="/" style={{ color: '#6366f1', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← Voltar para a Home</Link>
      
      <h1 style={{ color: '#fff' }}>Política de Privacidade</h1>
      <p style={{ color: '#a1a1aa' }}>Última atualização: Fevereiro de 2026</p>
      
      <div style={{ marginTop: '30px', lineHeight: '1.6', color: '#d4d4d8' }}>
        <h2>1. Coleta de Informações</h2>
        <p>Ao utilizar o login social (Google), o StackFolio coleta informações básicas de perfil estritamente necessárias para a criação da sua conta, como seu Nome e Endereço de E-mail. Nenhuma senha do Google é acessada ou armazenada por nós.</p>

        <h2>2. Uso dos Dados</h2>
        <p>As informações coletadas são usadas exclusivamente para identificar a autoria dos projetos (arquitetura de software, redes, IA, etc.) que você cadastrar na plataforma e para personalizar sua experiência no painel de controle.</p>

        <h2>3. Proteção e Armazenamento</h2>
        <p>Seus dados são armazenados em um banco de dados seguro utilizando práticas modernas de criptografia (Tokens JWT). Não compartilhamos, vendemos ou alugamos suas informações pessoais para terceiros.</p>

        <h2>4. Seus Direitos</h2>
        <p>Você tem o direito de solicitar a exclusão da sua conta e de todos os projetos associados a ela a qualquer momento. Para isso, basta excluir seu perfil nas configurações do sistema.</p>
      </div>
    </div>
  );
}