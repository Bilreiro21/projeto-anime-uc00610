import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function Favoritos() {
  const { user } = useAuth();
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'watching', 'completed', 'plan_to_watch', 'dropped'

  useEffect(() => {
    if (!user) return;
    const storageKey = `sorai-lista-${user.id}`;
    const salvos = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Migração de favoritos antigos para o novo formato de "Anime List"
    const listAtualizada = salvos.map(item => {
      if (!item.listStatus) {
        return { ...item, listStatus: 'plan_to_watch', listScore: null };
      }
      return item;
    });

    setLista(listAtualizada);
    if (JSON.stringify(salvos) !== JSON.stringify(listAtualizada)) {
      localStorage.setItem(storageKey, JSON.stringify(listAtualizada));
    }
  }, [user]);

  const removerFavorito = (e, id) => {
    e.preventDefault(); // Impede de navegar para os detalhes
    const novaLista = lista.filter(item => item.mal_id !== id);
    setLista(novaLista);
    localStorage.setItem(`sorai-lista-${user.id}`, JSON.stringify(novaLista));
    toast.success('Removido da lista!', { icon: '🗑️' });
  };

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'watching', label: 'A Ver', icon: '📺' },
    { id: 'plan_to_watch', label: 'Planeio Ver', icon: '🗓️' },
    { id: 'completed', label: 'Completo', icon: '✅' },
    { id: 'dropped', label: 'Desisti', icon: '❌' }
  ];

  const listaFiltrada = lista.filter(item => {
    if (filtro === 'todos') return true;
    return item.listStatus === filtro;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'watching': return '#28a745'; // verde
      case 'completed': return '#007bff'; // azul
      case 'plan_to_watch': return '#ffc107'; // amarelo
      case 'dropped': return '#dc3545'; // vermelho
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    const tab = tabs.find(t => t.id === status);
    return tab ? tab.label : 'Lista';
  }

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <h1 className="fw-800 mb-5 text-center" style={{ fontSize: '3rem' }}>
        Minha <span style={{ color: 'var(--accent-color)' }}>Anime List</span>
      </h1>

      {!user ? (
        <div className="text-center" style={{ marginTop: '10vh' }}>
          <h3 className="text-white mb-4">Please sign in to view your list.</h3>
          <p className="text-muted mb-4">You need an account to save and track your favorite anime and manga.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">Sign in</Link>
            <Link to="/register" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" style={{ borderColor: 'var(--border-color)' }}>Create free account</Link>
          </div>
        </div>
      ) : (
        <>

      {/* SEPARADORES / TABS (MODERN SEGMENTED CONTROL) */}
      <div className="d-flex justify-content-center mb-5">
        <div className="bento-box d-inline-flex flex-wrap gap-2 p-2" style={{ borderRadius: '999px' }}>
          {tabs.map(tab => {
            const count = tab.id === 'todos' ? lista.length : lista.filter(i => i.listStatus === tab.id).length;
            const isActive = filtro === tab.id;
            
            return (
              <button 
                key={tab.id}
                className={`btn fw-bold px-4 py-2 rounded-pill d-flex align-items-center gap-2`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
                onClick={() => setFiltro(tab.id)}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                <span 
                  className="badge rounded-pill" 
                  style={{ 
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LISTAGEM */}
      {lista.length === 0 ? (
        <div className="text-center" style={{ marginTop: '10vh' }}>
          <h3 className="text-muted mb-4">A tua lista está vazia.</h3>
          <Link to="/animes" className="btn btn-primary rounded-pill px-5 py-3 fw-bold">
            Explorar Catálogo
          </Link>
        </div>
      ) : listaFiltrada.length === 0 ? (
        <div className="text-center mt-5">
          <h4 className="text-muted">Não há animes com este estado.</h4>
        </div>
      ) : (
        <div className="anime-grid">
          {listaFiltrada.map((item) => {
            const itemType = item.url?.includes('/manga/') ? 'manga' : 'anime';
            return (
              <Link to={`/detalhes/${itemType}/${item.mal_id}`} key={item.mal_id} className="text-decoration-none" style={{ position: 'relative', display: 'block' }}>
              <div className="anime-card">
                <img 
                  src={item.images?.jpg?.large_image_url || item.images?.jpg?.image_url} 
                  className="anime-card-img" 
                  alt={item.title} 
                />
                
                <div className="score-badge d-flex flex-column gap-1" style={{ top: '10px', right: '10px', alignItems: 'flex-end', background: 'transparent' }}>
                  {item.listScore && (
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <span style={{ color: '#e61c6b' }}>★</span> {item.listScore}/10
                    </div>
                  )}
                  <div style={{ 
                    background: getStatusColor(item.listStatus), 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    color: '#fff', 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {getStatusLabel(item.listStatus)}
                  </div>
                </div>

                <div className="anime-card-overlay">
                  <h3 className="anime-card-title">{item.title}</h3>
                </div>
              </div>
              
              <button 
                className="btn btn-danger rounded-circle shadow" 
                style={{ 
                  position: 'absolute', 
                  top: '-10px', 
                  left: '-10px', 
                  width: '35px', 
                  height: '35px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 20,
                  fontSize: '0.8rem'
                }} 
                onClick={(e) => removerFavorito(e, item.mal_id)}
                title="Remover"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </Link>
            );
          })}
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default Favoritos;