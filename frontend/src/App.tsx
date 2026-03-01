import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

const cardStyle = { background: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginBottom: '20px' };
const inputStyle = { padding: '12px', margin: '5px 0', borderRadius: '6px', border: '1px solid #444', background: '#252525', color: 'white', display: 'block', width: '100%' };
const buttonStyle = { padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer', fontWeight: 'bold' as const };

function App() {
  const { signed, user, signOut } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const carregarProjetos = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
  };

  useEffect(() => {
    carregarProjetos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description });
      setTitle(''); setDescription('');
      carregarProjetos();
    } catch (err) {
      alert("Erro ao salvar. Verifique o login.");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1>🚀 StackFolio</h1>
          <p>Projetos de Ciência da Computação | Mossoró-RN</p>
        </div>
        {signed ? (
          <div style={{ textAlign: 'right' }}>
            <p>Bem-vindo, <strong>{user?.name}</strong></p>
            <button onClick={signOut} style={{ ...buttonStyle, backgroundColor: '#ff4444' }}>Sair</button>
          </div>
        ) : (
          <button onClick={() => window.location.href = '/login'} style={buttonStyle}>Login</button>
        )}
      </header>

      {signed && (
        <section style={cardStyle}>
          <h3>➕ Adicionar Novo Projeto</h3>
          <form onSubmit={handleSave}>
            <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} />
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '10px' }}>Salvar Projeto</button>
          </form>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={cardStyle}>
            <h3 style={{ color: '#646cff' }}>{p.title}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;