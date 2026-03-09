import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export function PrivacyPage() {
  const { theme, colors } = useTheme() as any;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pStyle = { color: theme === 'dark' ? '#cbd5e1' : '#334155', fontSize: '15px', marginBottom: '16px', lineHeight: '1.8' };
  const h2Style = { fontSize: '20px', fontWeight: '800', marginBottom: '16px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px', marginTop: '40px' };
  const ulStyle = { color: theme === 'dark' ? '#cbd5e1' : '#334155', fontSize: '15px', paddingLeft: '20px', display: 'flex', flexDirection: 'column' as 'column', gap: '10px', marginBottom: '20px', lineHeight: '1.8' };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', color: colors.text, fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 40px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, background: theme === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: colors.text, cursor: 'pointer', fontWeight: '700', fontSize: '14px', padding: '8px 12px', borderRadius: '8px', transition: 'background 0.2s' }} className="hover-bg">
          <ArrowLeft size={18} /> Voltar
        </button>
        <img src={logoImg} alt="StackFolio Logo" style={{ height: '35px', mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }} />
        <div style={{ width: '85px' }} />
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px' }}>Política de Privacidade</h1>
          <p style={{ color: colors.textMuted, fontSize: '15px' }}>Última atualização: 8 de Março de 2026</p>
        </div>

        <div style={{ background: theme === 'dark' ? '#1e293b' : '#e0f2fe', borderLeft: `4px solid ${colors.primary}`, padding: '24px', borderRadius: '0 12px 12px 0', marginBottom: '50px', display: 'flex', gap: '16px' }}>
          <ShieldCheck size={28} color={colors.primary} style={{ flexShrink: 0, marginTop: '4px' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: theme === 'dark' ? '#fff' : '#0369a1' }}>Resumo (TL;DR)</h3>
            <p style={{ fontSize: '14px', color: theme === 'dark' ? '#cbd5e1' : '#0c4a6e', margin: 0, lineHeight: '1.6' }}>
              Sua privacidade é fundamental. Não vendemos seus dados a anunciantes. Seu código e portfólio pertencem a você. Coletamos apenas informações necessárias para operar e manter a plataforma segura. Utilizamos cookies apenas para gerenciar sua sessão (não rastreamos você pela internet). Você pode excluir sua conta a qualquer momento.
            </p>
          </div>
        </div>

        <section>
          <p style={pStyle}>
            Esta Política de Privacidade descreve como o StackFolio coleta, utiliza, protege e compartilha informações relacionadas ao uso da plataforma por seus usuários.
          </p>

          <h2 style={h2Style}>1. Informações que Coletamos</h2>

          <p style={pStyle}>
            Para fornecer, operar e melhorar nossos serviços, podemos coletar determinadas informações relacionadas à criação e utilização de contas na plataforma.
          </p>

          <p style={pStyle}>
            Essas informações podem incluir dados fornecidos voluntariamente pelo usuário durante o cadastro ou ao utilizar funcionalidades da plataforma, bem como informações técnicas necessárias para o funcionamento adequado, segurança e manutenção do serviço.
          </p>

          <p style={pStyle}>
            Também podemos utilizar tecnologias como cookies ou mecanismos semelhantes, estritamente necessários para manter sessões ativas, garantir a autenticação do usuário e assegurar a integridade da plataforma.
          </p>

          <h2 style={h2Style}>2. Como Utilizamos Suas Informações</h2>
          <p style={pStyle}>As informações tratadas pela plataforma são utilizadas exclusivamente para as seguintes finalidades:</p>

          <ul style={ulStyle}>
            <li><strong>Fornecimento do Serviço:</strong> Criar, hospedar e exibir seu portfólio público na internet através do seu URL personalizado.</li>
            <li><strong>Segurança e Autenticação:</strong> Enviar códigos de verificação (via e-mail) para confirmar sua identidade e proteger sua conta contra acessos não autorizados.</li>
            <li><strong>Comunicações:</strong> Enviar notificações importantes sobre atualizações do sistema, alterações de políticas ou alertas de segurança.</li>
            <li><strong>Melhoria Contínua:</strong> Analisar estatísticas anônimas e agregadas para melhorar a plataforma e a experiência do usuário.</li>
          </ul>

          <h2 style={h2Style}>3. Compartilhamento e Divulgação de Dados</h2>

          <p style={pStyle}>
            <strong>O StackFolio não vende, aluga ou comercializa seus dados pessoais.</strong> O compartilhamento de informações ocorre apenas nos seguintes cenários limitados:
          </p>

          <ul style={ulStyle}>
            <li><strong>Perfil Público:</strong> As informações que você inserir voluntariamente em seu portfólio estarão visíveis para qualquer pessoa que acessar seu link público. Informações privadas de conta nunca são exibidas publicamente.</li>
            <li><strong>Prestadores de Serviço:</strong> Podemos utilizar provedores de infraestrutura ou serviços técnicos necessários para operar a plataforma, sempre respeitando requisitos de segurança e confidencialidade.</li>
            <li><strong>Obrigações Legais:</strong> Podemos divulgar informações caso sejamos legalmente obrigados a fazê-lo por ordem judicial ou para proteger os direitos, a propriedade e a segurança do StackFolio e de seus usuários.</li>
          </ul>

          <h2 style={h2Style}>4. Armazenamento e Segurança</h2>

          <p style={pStyle}>
            Implementamos medidas técnicas e organizacionais de segurança para proteger as informações armazenadas. As credenciais de acesso são protegidas por mecanismos de criptografia e técnicas modernas de segurança. A comunicação entre seu navegador e nossos servidores ocorre por meio de conexões seguras (HTTPS).
            Apesar dos nossos esforços para proteger os dados, nenhuma transmissão pela internet pode ser considerada totalmente segura.
          </p>

          <h2 style={h2Style}>5. Retenção de Dados</h2>

          <p style={pStyle}>
            As informações associadas à conta do usuário são mantidas enquanto a conta permanecer ativa ou enquanto forem necessárias para o funcionamento do serviço. Caso o usuário solicite a exclusão da conta, os dados associados serão removidos das bases de dados ativas, podendo permanecer temporariamente em backups de segurança por um período limitado.
          </p>

          <h2 style={h2Style}>6. Seus Direitos (LGPD / RGPD)</h2>

          <p style={pStyle}>De acordo com as leis de proteção de dados aplicáveis, você tem o direito de:</p>

          <ul style={ulStyle}>
            <li>Acessar e solicitar uma cópia dos seus dados pessoais.</li>
            <li>Corrigir ou atualizar informações incorretas diretamente no seu painel de configurações.</li>
            <li>Solicitar a exclusão completa da sua conta e das informações associadas.</li>
            <li>Revogar consentimentos relacionados a comunicações não essenciais.</li>
          </ul>

          <h2 style={h2Style}>7. Alterações nesta Política</h2>

          <p style={pStyle}>
            Temos o direito de rever estes Termos periodicamente. As modificações entram em vigor no momento em que são publicadas nesta página. A continuação da utilização da plataforma após as alterações constitui a sua aceitação à nova Política de Privacidade.
          </p>
        </section>

      </main>

      <style>{`
        .hover-bg:hover { background: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important; }
      `}</style>
    </div>
  );
}