import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Scale } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export function TermsPage() {
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
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px' }}>Termos de Serviço</h1>
          <p style={{ color: colors.textMuted, fontSize: '15px' }}>Última atualização: 8 de março de 2026</p>
        </div>

        <div style={{ background: theme === 'dark' ? '#1e293b' : '#fef3c7', borderLeft: `4px solid #f59e0b`, padding: '24px', borderRadius: '0 12px 12px 0', marginBottom: '50px', display: 'flex', gap: '16px' }}>
          <Scale size={28} color="#f59e0b" style={{ flexShrink: 0, marginTop: '4px' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: theme === 'dark' ? '#fff' : '#b45309' }}>Resumo (TL;DR)</h3>
            <p style={{ fontSize: '14px', color: theme === 'dark' ? '#cbd5e1' : '#78350f', margin: 0, lineHeight: '1.6' }}>
              Seja respeitoso com a comunidade. Não faça spam, não tente derrubar nossos servidores nem se passe por membros da equipe do StackFolio. O conteúdo que você publica (textos, links e projetos) é de sua inteira responsabilidade. Nós nos reservamos o direito de suspender contas que violem estas regras, sem aviso prévio.
            </p>
          </div>
        </div>

        <section>
          <p style={pStyle}>
            Estes Termos de Serviço ("Termos") constituem um acordo legal entre você e o StackFolio. Ao acessar, se cadastrar ou utilizar nossos serviços, você declara ter lido, compreendido e concordado em ficar vinculado a estes Termos.
          </p>

          <h2 style={h2Style}>1. Requisitos de Conta e Elegibilidade</h2>
          <ul style={ulStyle}>
            <li>Para criar uma conta, você deve ter pelo menos 18 anos de idade.</li>
            <li>Você é inteiramente responsável por manter a confidencialidade de suas credenciais de acesso (senha e acesso ao seu e-mail associado).</li>
            <li>Você concorda em fornecer informações verdadeiras, precisas e atualizadas. A utilização de perfis fraudulentos (ou que personifiquem terceiros) é estritamente proibida.</li>
          </ul>

          <h2 style={h2Style}>2. Regras de Conduta e Uso Aceitável</h2>
          <p style={pStyle}>Ao utilizar o StackFolio, o usuário concorda expressamente em <strong>NÃO</strong>:</p>
          <ul style={ulStyle}>
            <li>Utilizar nomes de usuário (*usernames*) reservados pelo sistema, termos que simulem administração oficial (ex: "suporte", "admin"), ou palavras obscenas e de baixo calão.</li>
            <li>Realizar atividades de *scraping*, extração de dados automatizada, mineração ou utilizar bots para coletar informações de outros usuários.</li>
            <li>Tentar explorar vulnerabilidades, realizar ataques de negação de serviço (DDoS) ou perturbar de qualquer forma a infraestrutura da plataforma.</li>
            <li>Publicar conteúdo ilícito, pornográfico, discriminatório, que promova o ódio, ou que viole direitos de propriedade intelectual de terceiros.</li>
          </ul>

          <h2 style={h2Style}>3. Propriedade Intelectual do Usuário</h2>
          <p style={pStyle}>
            O StackFolio não reivindica a propriedade sobre o seu trabalho. Todo o código, descrições de projetos, imagens e links que você insere no seu portfólio permanecem como sua propriedade intelectual (ou de seus respectivos empregadores/clientes, conforme aplicável).
          </p>
          <p style={pStyle}>
            Ao publicar o conteúdo no StackFolio, você assume total responsabilidade legal pelo mesmo e nos concede uma licença global, não exclusiva e isenta de *royalties* unicamente para hospedar, armazenar e exibir publicamente esse conteúdo na nossa plataforma.
          </p>

          <h2 style={h2Style}>4. Propriedade Intelectual do StackFolio</h2>
          <p style={pStyle}>
            Todo o código fonte subjacente, logotipos, design de interface (UI/UX), textos do sistema e arquitetura de dados do StackFolio são propriedade exclusiva de nossa equipe e encontram-se protegidos pelas leis de direitos autorais. É estritamente proibido copiar, clonar ou modificar a nossa plataforma para a criação de serviços concorrentes.
          </p>

          <h2 style={h2Style}>5. Links para Terceiros</h2>
          <p style={pStyle}>
            Os portfólios dos usuários podem conter links para sites externos (como repositórios no GitHub, redes sociais ou sites pessoais). O StackFolio não monitora e não assume qualquer responsabilidade pelo conteúdo, políticas de privacidade ou segurança desses sites de terceiros.
          </p>

          <h2 style={h2Style}>6. Suspensão e Rescisão de Conta</h2>
          <p style={pStyle}>
            O StackFolio reserva-se o direito de suspender, desativar ou apagar permanentemente, a qualquer momento e sem aviso prévio, contas de usuários que desrespeitem as disposições destes Termos de Serviço, gerem riscos de segurança ou criem passivos legais para a plataforma.
          </p>

          <h2 style={h2Style}>7. Isenção de Garantias e Limitação de Responsabilidade</h2>
          <p style={pStyle}>
            A plataforma é fornecida "como está" (*as is*) e "conforme disponível". Não garantimos que o serviço será ininterrupto, livre de erros ou 100% seguro.
          </p>
          <p style={pStyle}>
            Em nenhum caso o StackFolio, seus criadores ou parceiros serão responsabilizados por quaisquer danos diretos, indiretos, incidentais ou perda de lucros e de dados resultantes da utilização (ou incapacidade de utilização) da plataforma, incluindo falhas na hospedagem do seu portfólio.
          </p>

          <h2 style={h2Style}>8. Alterações aos Termos</h2>
          <p style={pStyle}>
            Temos o direito de rever estes Termos periodicamente. As modificações entram em vigor no momento em que são publicadas nesta página. A continuação da utilização da plataforma após as alterações constitui a sua aceitação aos novos Termos de Serviço.
          </p>
        </section>

      </main>

      <style>{`
        .hover-bg:hover { background: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important; }
      `}</style>
    </div>
  );
}