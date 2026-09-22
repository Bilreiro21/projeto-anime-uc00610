import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Animes() {
  const [animes, setAnimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  
  const [pesquisa, setPesquisa] = useState('') 
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [ordem, setOrdem] = useState('popularity') 

  const PLACEHOLDER_IMG = "https://placehold.co/400x600/16161a/ffffff?text=Sem+Imagem"

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

  const carregarAnimes = async () => {
    setLoading(true); setErro(null);
    let url = `https://api.jikan.moe/v4/anime?page=${page}&order_by=${ordem}&sort=desc`
    if (pesquisa) {
      url += `&q=${pesquisa}`
    } else {
      if (ordem === 'popularity') url = `https://api.jikan.moe/v4/top/anime?page=${page}&filter=bypopularity`
      else if (ordem === 'score') url = `https://api.jikan.moe/v4/top/anime?page=${page}`
    }

    try {
      const data = await fetchWithRetry(url);
      setAnimes(data.data || []); 
      setLastPage(data.pagination?.last_visible_page || 1); 
    } catch (err) {
      console.error(err); 
      setErro("Erro ao carregar animes. Por favor, tenta novamente mais tarde (Rate Limit).");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    // Add a slight delay to prevent strict mode double-firing from hitting rate limit instantly
    const timer = setTimeout(() => {
      carregarAnimes();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, ordem]) 

  const handlePesquisa = (e) => { e.preventDefault(); setPage(1); carregarAnimes(); }
  const handleLimpar = () => { setPesquisa(''); setOrdem('popularity'); setPage(1); }

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="min-h-screen bg-background pb-5"> 
      
      <div className="max-w-container mx-auto px-4 px-md-5 pt-5 mt-4">
        <h1 className="fw-bold text-white mb-5" style={{ fontSize: '2.5rem' }}>
          Explore Animes
        </h1>
        
        {/* BARRA DE PESQUISA (Sorai Style) */}
        <div className="bg-panel rounded-4 p-3 mb-5 border" style={{ borderColor: 'var(--border-color)' }}>
          <form onSubmit={handlePesquisa} className="d-flex flex-column flex-md-row gap-3">
            <div className="position-relative flex-grow-1">
              <i className="bi bi-search position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}></i>
              <input 
                type="text" 
                className="form-control text-white w-100" 
                placeholder="Search for animes..." 
                value={pesquisa} 
                onChange={(e) => setPesquisa(e.target.value)} 
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 15px 12px 45px' }}
              />
            </div>
            
            <div className="d-flex gap-3">
              <select 
                className="form-select text-white flex-shrink-0" 
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', width: 'auto', minWidth: '180px' }} 
                value={ordem} 
                onChange={(e) => { setOrdem(e.target.value); setPage(1); }}
              >
                <option value="popularity" style={{ color: '#000' }}>Most Popular</option>
                <option value="score" style={{ color: '#000' }}>Highest Rated</option>
                <option value="start_date" style={{ color: '#000' }}>Newest</option>
                <option value="episodes" style={{ color: '#000' }}>Most Episodes</option>
              </select>
              <button type="submit" className="btn-coral d-flex align-items-center justify-content-center px-4" style={{ width: 'auto' }}>
                Search
              </button>
              <button type="button" className="btn text-white px-3" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }} onClick={handleLimpar}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </form>
        </div>

        {erro && <div className="alert bg-surface border text-danger text-center mb-5" style={{ borderColor: '#f05039' }}>{erro}</div>}

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
            !erro && animes.map((anime) => (
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
                      <p className="text-muted m-0 small">{anime.year || anime.type}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {!loading && !erro && animes.length > 0 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5 pt-4 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
            <button className="btn text-white fw-bold px-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }} onClick={() => setPage(page - 1)} disabled={page === 1}>
              <i className="bi bi-arrow-left me-2"></i> Prev
            </button>
            <span className="fw-bold text-muted">Page {page} of {lastPage}</span>
            <button className="btn text-white fw-bold px-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }} onClick={() => setPage(page + 1)} disabled={page === lastPage}>
              Next <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Animes