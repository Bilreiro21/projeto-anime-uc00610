import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'anime', 'manga'

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    setFavoritos(salvos);
  }, []);

  const removerFavorito = (id) => {
    const novaLista = favoritos.filter(item => item.mal_id !== id);
    setFavoritos(novaLista);
    localStorage.setItem('meus-favoritos', JSON.stringify(novaLista));
    toast.success('Removido com sucesso!', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  // --- LÓGICA DE FILTRAGEM ---
  const favoritosFiltrados = favoritos.filter((item) => {
    if (filtro === 'todos') return true;
    // O Jikan tem sempre "/anime/" ou "/manga/" na URL. Usamos isso para distinguir.
    if (filtro === 'anime') return item.url?.includes('/anime/');
    if (filtro === 'manga') return item.url?.includes('/manga/');
    return true;
  });

  // Contagens para mostrar nos botões
  const totalAnimes = favoritos.filter(i => i.url?.includes('/anime/')).length;
  const totalMangas = favoritos.filter(i => i.url?.includes('/manga/')).length;

  return (
    <div className="container" style={{ paddingTop: '140px', minHeight: '80vh' }}>
      
      <h1 className="text-center mb-4 fw-bold display-5">❤️ Meus Favoritos</h1>

      {/* BOTÕES DE FILTRO */}
      {favoritos.length > 0 && (
        <div className="d-flex justify-content-center gap-2 mb-5">
          <button 
            className={`btn rounded-pill px-4 fw-bold ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({favoritos.length})
          </button>
          <button 
            className={`btn rounded-pill px-4 fw-bold ${filtro === 'anime' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro('anime')}
          >
            🎬 Animes ({totalAnimes})
          </button>
          <button 
            className={`btn rounded-pill px-4 fw-bold ${filtro === 'manga' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro('manga')}
          >
            📚 Mangas ({totalMangas})
          </button>
        </div>
      )}

      {/* LISTAGEM */}
      {favoritos.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '40vh' }}>
          <h3 className="text-muted mb-4">Ainda não tens favoritos guardados.</h3>
          <div className="d-flex gap-3">
            <Link to="/animes" className="btn btn-primary btn-lg rounded-pill px-4 shadow">
              Explorar Animes
            </Link>
            <Link to="/mangas" className="btn btn-outline-primary btn-lg rounded-pill px-4 shadow">
              Explorar Mangas
            </Link>
          </div>
        </div>
      ) : favoritosFiltrados.length === 0 ? (
        // Caso tenhas favoritos, mas o filtro atual esteja vazio (ex: tens animes mas clicaste em Mangas)
        <div className="text-center mt-5">
          <h4 className="text-muted">Não tens {filtro === 'anime' ? 'animes' : 'mangas'} nos favoritos.</h4>
        </div>
      ) : (
        <div className="row">
          {favoritosFiltrados.map((item) => (
            <div key={item.mal_id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0 hover-effect">
                <div style={{ position: 'relative' }}>
                  <Link to={`/detalhes/${item.mal_id}`}>
                    <img 
                      src={item.images.jpg.image_url} 
                      className="card-img-top" 
                      alt={item.title} 
                      style={{ height: '300px', objectFit: 'cover' }} 
                    />
                  </Link>
                  <button 
                    className="btn btn-danger rounded-circle shadow-sm" 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      zIndex: 10 
                    }} 
                    onClick={() => removerFavorito(item.mal_id)}
                    title="Remover"
                  >
                    ✖️
                  </button>
                  {/* Etiqueta pequena para identificar visualmente */}
                  <span 
                    className="badge position-absolute bottom-0 start-0 m-2 shadow-sm"
                    style={{ 
                      background: item.url?.includes('/anime/') ? '#4ca1af' : '#ff9966',
                      color: 'white'
                    }}
                  >
                    {item.url?.includes('/anime/') ? 'ANIME' : 'MANGA'}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{item.title}</h5>
                  <div className="mb-2">
                    <span className="badge bg-warning text-dark me-1">★ {item.score || '?'}</span>
                    <span className="badge bg-secondary">{item.year || 'N/A'}</span>
                  </div>
                  <Link to={`/detalhes/${item.mal_id}`} className="btn btn-primary mt-auto rounded-pill">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;