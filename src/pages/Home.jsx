import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const [topAnimesHero, setTopAnimesHero] = useState([])
  const [seasonNow, setSeasonNow] = useState([])
  const { user } = useAuth()

  const PLACEHOLDER_IMG = "https://placehold.co/400x600/16161a/ffffff?text=Sem+Imagem"

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resSeason = await fetch('https://api.jikan.moe/v4/seasons/now?limit=12');
        if (resSeason.ok) {
          const data = await resSeason.json();
          setSeasonNow(data.data || []);
        }

        await new Promise(r => setTimeout(r, 800));

        const resTop = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
        if (resTop.ok) {
          const data = await resTop.json();
          setTopAnimesHero(data.data || []);
        }

      } catch (error) {
        console.error("Erro ao carregar Home:", error);
      }
    };

    carregarDados();
  }, []);

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="container mt-4 mb-5" style={{ minHeight: '80vh' }}>
      
      {/* SORAI HERO BANNER */}
      <div 
        className="mb-5 rounded-4 overflow-hidden position-relative d-flex align-items-end p-5" 
        style={{ 
          minHeight: '400px',
          backgroundImage: seasonNow.length > 0 ? `url(${seasonNow[0].trailer?.images?.maximum_image_url || seasonNow[0].images?.jpg?.large_image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }}></div>
        
        <div className="position-relative w-100" style={{ zIndex: 2 }}>
          <span className="badge mb-3 text-uppercase fw-bold tracking-wide" style={{ background: 'var(--accent-color)' }}>
            Em Destaque
          </span>
          <h1 className="fw-800 text-white mb-3" style={{ fontSize: '3rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {seasonNow.length > 0 ? seasonNow[0].title : 'Bem-vindo ao Sorai'}
          </h1>
          <div className="d-flex gap-3">
            {seasonNow.length > 0 && (
              <Link to={`/detalhes/anime/${seasonNow[0].mal_id}`} className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '12px' }}>
                <i className="bi bi-play-fill me-2"></i> Ver Detalhes
              </Link>
            )}
            <Link to="/animes" className="btn btn-outline-light fw-bold px-4 py-2" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)' }}>
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-5">
        {/* SECÇÃO: TEMPORADA ATUAL */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fw-bold m-0 text-white" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-stars me-2" style={{ color: 'var(--accent-color)' }}></i> In Season
            </h2>
            <Link to="/temporadas" className="text-primary text-decoration-none small fw-bold transition-all hover:gap-2">View all &rarr;</Link>
          </div>

          <div className="anime-grid">
            {seasonNow.map((anime) => (
              <Link to={`/detalhes/anime/${anime.mal_id}`} key={anime.mal_id} className="text-decoration-none">
                <div className="anime-card">
                  <img 
                    src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                    className="anime-card-img" 
                    alt={anime.title} 
                    onError={handleImageError}
                  />
                  <div className="score-badge">
                    <span>★</span> {anime.score ? anime.score.toFixed(1) : 'N/A'}
                  </div>
                  <div className="anime-card-overlay">
                    <h3 className="anime-card-title">{anime.title}</h3>
                    <div className="anime-card-meta">
                      <span>{anime.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECÇÃO: TOP ANIMES (Lista Vertical) */}
        <div className="col-lg-4">
          <div className="d-flex align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
            <h2 className="fw-bold m-0 text-white" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-trophy text-warning me-2"></i> Top Anime
            </h2>
          </div>

          <div className="d-flex flex-column gap-3">
            {topAnimesHero.map((anime, index) => (
              <Link to={`/detalhes/anime/${anime.mal_id}`} key={anime.mal_id} className="text-decoration-none text-white d-flex align-items-center gap-3 p-2 rounded transition-all" style={{ backgroundColor: 'var(--bg-panel)' }}>
                <div className="fw-800 ms-2" style={{ color: index < 3 ? 'var(--accent-color)' : 'var(--text-muted)', fontSize: '1.2rem', minWidth: '25px' }}>
                  #{index + 1}
                </div>
                <img 
                  src={anime.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                  alt={anime.title}
                  className="rounded"
                  style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1 overflow-hidden">
                  <h6 className="mb-1 text-truncate fw-bold">{anime.title}</h6>
                  <small className="text-muted d-block">★ {anime.score} • {anime.year || 'N/A'}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BANNER PROMOCIONAL SORAI */}
      {!user && (
        <section className="mt-5 mb-5 pt-5">
          <div className="rounded-4 p-5 d-flex flex-column flex-md-row align-items-center justify-content-between bg-sorai-gradient shadow-lg" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            
            <div className="position-relative z-1">
              <div className="d-flex align-items-center gap-2 mb-2 text-white-50 small fw-bold">
                <i className="bi bi-book"></i> Completely free
              </div>
              <h3 className="text-white fw-bold mb-2" style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>
                Track your progress,<br/>organize your anime list
              </h3>
              <p className="text-white-50 m-0" style={{ fontSize: '0.9rem' }}>
                Keep track of everything you watch, your scores, and much more.
              </p>
            </div>
            
            <div className="d-flex gap-3 mt-4 mt-md-0 position-relative z-1">
              <Link to="/register" className="btn bg-white text-dark fw-bold px-4 py-2 transition-all hover:scale-105" style={{ borderRadius: '12px' }}>
                Create free account
              </Link>
              <Link to="/login" className="btn text-white fw-bold px-4 py-2 transition-all" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)' }}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

export default Home