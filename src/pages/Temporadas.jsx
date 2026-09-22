import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Temporadas() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // States para controlo
  const currentYear = new Date().getFullYear();
  const [ano, setAno] = useState(currentYear);
  const [estacao, setEstacao] = useState('now'); // 'now', 'winter', 'spring', 'summer', 'fall'
  const [filtroTipo, setFiltroTipo] = useState('tv'); // 'all', 'tv', 'movie', 'ova', 'ona', 'special'

  const PLACEHOLDER_IMG = "https://placehold.co/400x600/16161a/ffffff?text=Sem+Imagem"

  // Dropdown options
  const anosDisponiveis = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear + 1 - i); // de 1990 até o proximo ano

  const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const res = await fetch(url);
      if (res.ok) return res.json();
      if (res.status === 429) {
        // Wait exponentially before retrying
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else {
        throw new Error(`Erro na API: ${res.status}`);
      }
    }
    throw new Error('Max retries reached');
  }

  const carregarTemporada = async () => {
    setLoading(true);
    setErro(null);

    let url = 'https://api.jikan.moe/v4/seasons/now';
    if (estacao !== 'now') {
      url = `https://api.jikan.moe/v4/seasons/${ano}/${estacao}`;
    }

    try {
      const data = await fetchWithRetry(url);
      setAnimes(data.data || []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar os animes desta temporada. (Rate Limit)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarTemporada();
    }, 300);
    return () => clearTimeout(timer);
  }, [ano, estacao]);

  // Filtro client-side para ser instantâneo
  const animesFiltrados = animes.filter(anime => {
    if (filtroTipo === 'all') return true;
    return anime.type?.toLowerCase() === filtroTipo;
  });

  // Tipos para os botões de filtro
  const tipos = [
    { id: 'all', label: 'Todos' },
    { id: 'tv', label: 'TV' },
    { id: 'movie', label: 'Filmes' },
    { id: 'ova', label: 'OVA' },
    { id: 'ona', label: 'ONA' },
    { id: 'special', label: 'Especiais' }
  ];

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="min-h-screen bg-background pb-5">
      <div className="max-w-container mx-auto px-4 px-md-5 pt-5 mt-4">
        <h1 className="fw-bold text-white mb-5" style={{ fontSize: '2.5rem' }}>
          Seasonal Animes
        </h1>

        {/* CONTROLOS DE FILTRAGEM E ESTAÇÃO */}
        <div className="bg-panel rounded-4 p-3 mb-5 border" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            
            {/* Esquerda: Seletor de Ano/Estação */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <select 
                className="form-select text-white" 
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', minWidth: '180px' }}
                value={estacao}
                onChange={(e) => setEstacao(e.target.value)}
              >
                <option value="now" style={{ color: '#000' }}>Current Season</option>
                <option value="winter" style={{ color: '#000' }}>Winter</option>
                <option value="spring" style={{ color: '#000' }}>Spring</option>
                <option value="summer" style={{ color: '#000' }}>Summer</option>
                <option value="fall" style={{ color: '#000' }}>Fall</option>
              </select>

              <select 
                className="form-select text-white" 
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', minWidth: '120px' }}
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                disabled={estacao === 'now'}
              >
                {anosDisponiveis.map(a => (
                  <option key={a} value={a} style={{ color: '#000' }}>{a}</option>
                ))}
              </select>
            </div>

            <div className="vr d-none d-lg-block" style={{ backgroundColor: 'var(--border-color)' }}></div>

            {/* Direita: Segmented Control para Filtro de Formato */}
            <div className="d-flex flex-wrap gap-1 p-1 rounded-pill" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              {tipos.map(t => (
                <button
                  key={t.id}
                  className={`btn rounded-pill fw-bold px-3 py-1 text-uppercase transition-all`}
                  style={{
                    backgroundColor: filtroTipo === t.id ? 'rgba(240, 80, 57, 0.1)' : 'transparent',
                    color: filtroTipo === t.id ? '#f05039' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => setFiltroTipo(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {erro && <div className="alert bg-surface border text-danger text-center mb-5" style={{ borderColor: '#f05039' }}>{erro}</div>}

        {!loading && !erro && animesFiltrados.length === 0 && (
          <div className="text-center mt-5 text-muted">
            <h4>No anime found for this filter.</h4>
          </div>
        )}

        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="col">
                <div className="rounded-4 overflow-hidden bg-surface shadow-card h-100">
                  <div className="placeholder w-100" style={{ aspectRatio: '2/3' }}></div>
                  <div className="p-3">
                    <div className="placeholder w-75 mb-2" style={{ height: '16px', borderRadius: '4px' }}></div>
                    <div className="placeholder w-50" style={{ height: '12px', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !erro && animesFiltrados.map((anime) => (
              <div key={anime.mal_id} className="col">
                <Link to={`/detalhes/anime/${anime.mal_id}`} className="text-decoration-none">
                  <div className="rounded-4 overflow-hidden bg-surface h-100 transition-all hover-glow border" style={{ borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="position-relative" style={{ aspectRatio: '2/3' }}>
                      <img 
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                        alt={anime.title} 
                        className="w-100 h-100 object-fit-cover"
                        onError={handleImageError}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                          <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.7rem' }}></i> {anime.score ? anime.score.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white mb-1 fw-bold text-truncate" style={{ fontSize: '0.95rem' }}>{anime.title}</h3>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="text-muted m-0 small">{anime.type}</p>
                        <p className="text-muted m-0 small">{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Temporadas;
