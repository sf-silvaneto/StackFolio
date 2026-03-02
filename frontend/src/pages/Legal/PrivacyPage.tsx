import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, Lock, Eye, Database, UserCheck, ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
  const { colors, theme } = useTheme() as any;
  const navigate = useNavigate();

  const sectionStyle = { marginBottom: '40px' };
  const titleStyle = { fontSize: '20px', fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: colors.primary };
  const textStyle = { fontSize: '15px', lineHeight: '1.8', color: colors.textMuted };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', padding: '60px 20px', color: colors.text }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: colors.card, padding: '50px', borderRadius: '32px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <header style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '30px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>Política de Privacidade</h1>
          <p style={{ color: colors.textMuted, fontSize: '14px' }}><strong>Última atualização:</strong> 01 de março de 2026</p>
        </header>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><ShieldCheck size={22} /> 1. Compromisso com a Privacidade</h2>
          <p style={textStyle}>
            O <strong>StackFolio</strong>, plataforma desenvolvida para exposição de portfólios tecnológicos, está empenhado em proteger a sua privacidade e garantir a conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. Este documento explica como lidamos com as suas informações.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><Database size={22} /> 2. Informações que Coletamos</h2>
          <p style={textStyle}><strong>2.1. Através do Google Auth:</strong></p>
          <ul style={textStyle}>
            <li>Identificação básica: Nome completo, endereço de e-mail e foto de perfil.</li>
          </ul>
          <p style={{...textStyle, marginTop: '15px'}}><strong>2.2. Dados Profissionais (Fornecidos por você):</strong></p>
          <ul style={textStyle}>
            <li>Links de redes sociais (GitHub, LinkedIn), biografia, competências técnicas (Stack), nível de inglês e histórico acadêmico.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><UserCheck size={22} /> 3. Finalidade do Tratamento</h2>
          <p style={textStyle}>
            Seus dados são coletados exclusivamente para a criação do seu perfil profissional público. O StackFolio atua como o <strong>Controlador</strong> dos dados da sua conta, permitindo que recrutadores e outros desenvolvedores visualizem o seu progresso técnico.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><Lock size={22} /> 4. Segurança e Armazenamento</h2>
          <p style={textStyle}>
            Empregamos medidas técnicas como criptografia em repouso e backups regulares para proteger suas informações contra acessos não autorizados. Seus dados são mantidos enquanto a sua conta estiver ativa em nossa plataforma.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><Eye size={22} /> 5. Seus Direitos (LGPD)</h2>
          <p style={textStyle}>
            Você tem o direito de confirmar a existência do tratamento de dados, acessar seus dados, corrigir informações incompletas ou solicitar a exclusão definitiva do seu perfil a qualquer momento através das configurações da plataforma.
          </p>
        </section>

        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: `1px solid ${colors.border}` }}>
          <button 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} /> Voltar
          </button>
        </div>
      </div>
    </div>
  );
}