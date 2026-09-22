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

  // Dropdown options
  const anosDisponiveis = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear + 1 - i); // de 1990 até o proximo ano

  const carregarTemporada = () => {
    setLoading(true);
    setErro(null);

    let url = 'https://api.jikan.moe/v4/seasons/now';
    if (estacao !== 'now') {
      url = `https://api.jikan.moe/v4/seasons/${ano}/${estacao}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erro na API do Jikan');
        return res.json();
      })
      .then(data => {
        setAnimes(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErro("Não foi possível carregar os animes desta temporada.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarTemporada();
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

  return (
    <div className="container mt-4 mb-5" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <h1 className="text-center mb-4 fw-800" style={{ fontSize: '3rem' }}>
        Animes da <span style={{ color: 'var(--accent-color)' }}>Temporada</span>
      </h1>

      {/* CONTROLOS DE FILTRAGEM E ESTAÇÃO */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-10">
          <div className="bento-box d-flex flex-column flex-md-row justify-content-between gap-4 p-4">
            
            {/* Esquerda: Seletor de Ano/Estação */}
            <div className="d-flex flex-column flex-md-row gap-3">
              <select 
                className="form-select border-0 text-white fw-bold" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', minWidth: '150px' }}
                value={estacao}
                onChange={(e) => setEstacao(e.target.value)}
              >
                <option value="now" style={{ color: '#000' }}>Temporada Atual</option>
                <option value="winter" style={{ color: '#000' }}>Inverno</option>
                <option value="spring" style={{ color: '#000' }}>Primavera</option>
                <option value="summer" style={{ color: '#000' }}>Verão</option>
                <option value="fall" style={{ color: '#000' }}>Outono</option>
              </select>

              <select 
                className="form-select border-0 text-white fw-bold" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', minWidth: '120px' }}
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
            <div className="d-flex flex-wrap gap-1 p-1 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {tipos.map(t => (
                <button
                  key={t.id}
                  className={`btn rounded-pill fw-bold px-3 py-1 text-uppercase`}
                  style={{
                    backgroundColor: filtroTipo === t.id ? 'var(--accent-color)' : 'transparent',
                    color: filtroTipo === t.id ? '#fff' : 'var(--text-muted)',
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
      </div>

      {loading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border" style={{ color: 'var(--accent-color)' }}></div></div>}
      {erro && <div className="alert text-center mx-auto" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid #dc3545', maxWidth: '600px' }}>{erro}</div>}

      {!loading && !erro && animesFiltrados.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <h4>Nenhum anime encontrado para este filtro.</h4>
        </div>
      )}

      {!loading && !erro && animesFiltrados.length > 0 && (
        <div className="anime-grid">
          {animesFiltrados.map((anime) => (
            <Link to={`/detalhes/anime/${anime.mal_id}`} key={anime.mal_id} className="text-decoration-none">
              <div className="anime-card">
                <img 
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} 
                  className="anime-card-img" 
                  alt={anime.title} 
                />
                <div className="score-badge">
                  <span>★</span> {anime.score ? anime.score.toFixed(1) : 'N/A'}
                </div>
                <div className="anime-card-overlay">
                  <h3 className="anime-card-title">{anime.title}</h3>
                  <div className="anime-card-meta">
                    <span>{anime.type}</span>
                    <span>{anime.episodes ? `${anime.episodes} eps` : 'Em curso'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Temporadas;
