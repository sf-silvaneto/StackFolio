import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Scale, UserPlus, Code2, AlertTriangle, ArrowLeft } from 'lucide-react';

export function TermsPage() {
  const { colors, theme } = useTheme() as any;
  const navigate = useNavigate();

  const sectionStyle = { marginBottom: '40px' };
  const titleStyle = { fontSize: '20px', fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: colors.primary };
  const textStyle = { fontSize: '15px', lineHeight: '1.8', color: colors.textMuted };

  return (
    <div style={{ background: theme === 'light' ? '#f8fafc' : '#0f172a', minHeight: '100vh', padding: '60px 20px', color: colors.text }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: colors.card, padding: '50px', borderRadius: '32px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <header style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '30px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>Termos de Serviço</h1>
          <p style={{ color: colors.textMuted, fontSize: '14px' }}><strong>Última atualização:</strong> 01 de março de 2026</p>
        </header>

        <section style={sectionStyle}>
          <p style={textStyle}>
            Por favor, leia estes Termos cuidadosamente. Ao acessar ou usar o <strong>StackFolio</strong>, você concorda em ficar vinculado por estes Termos. Se você discordar de qualquer parte, não poderá utilizar o serviço.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><UserPlus size={22} /> 1. Elegibilidade</h2>
          <p style={textStyle}>
            Para usar o StackFolio, você deve ser um entusiasta, estudante ou profissional da área de tecnologia. Ao se registrar via Google Auth, você garante que as informações fornecidas são verídicas.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><Code2 size={22} /> 2. Propriedade Intelectual e Conteúdo</h2>
          <p style={textStyle}>
            O usuário mantém todos os direitos de propriedade sobre o código e projetos publicados. No entanto, ao publicar no StackFolio, você concede à plataforma uma licença mundial para exibir seu conteúdo publicamente para fins de portfólio.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><AlertTriangle size={22} /> 3. Conduta Proibida</h2>
          <ul style={textStyle}>
            <li>Publicar projetos que não sejam de sua autoria sem os devidos créditos.</li>
            <li>Introduzir malwares ou scripts maliciosos.</li>
            <li>Utilizar a plataforma para assédio ou disseminação de discurso de ódio.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><Scale size={22} /> 4. Isenção de Responsabilidade</h2>
          <p style={textStyle}>
            O StackFolio é fornecido "como está". Não garantimos que a plataforma estará livre de erros ou interrupções. Não nos responsabilizamos por contratações ou decisões de negócios tomadas com base nas informações dos perfis.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}><FileText size={22} /> 5. Foro</h2>
          <p style={textStyle}>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca para dirimir quaisquer controvérsias.
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