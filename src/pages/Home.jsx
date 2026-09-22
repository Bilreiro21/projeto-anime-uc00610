import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [topAnimesHero, setTopAnimesHero] = useState([])
  const [seasonNow, setSeasonNow] = useState([])
  const [heroAnime, setHeroAnime] = useState(null)

  const PLACEHOLDER_IMG = "https://placehold.co/400x600/16161a/ffffff?text=Sem+Imagem"

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resSeason = await fetch('https://api.jikan.moe/v4/seasons/now?limit=10');
        if (resSeason.ok) {
          const data = await resSeason.json();
          const animes = data.data || [];
          setSeasonNow(animes);
          // Pick the highest scored or most popular anime from this season for the Hero
          if (animes.length > 0) {
            setHeroAnime(animes[0]);
          }
        }

        await new Promise(r => setTimeout(r, 800));

        const resTop = await fetch('https://api.jikan.moe/v4/top/anime?limit=14');
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
    <div>
      {/* HERO SECTION */}
      <div 
        className="hero-animated" 
        style={{ 
          backgroundImage: heroAnime 
            ? `url(${heroAnime.trailer?.images?.maximum_image_url || heroAnime.images?.jpg?.large_image_url})` 
            : 'url(https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop)'
        }}
      >
        <div className="container hero-content">
          <div className="row">
            <div className="col-lg-6">
              <span className="badge bg-primary mb-3 text-uppercase fw-bold tracking-wide" style={{ background: 'var(--accent-color)' }}>
                Em Destaque
              </span>
              <h1 className="hero-title">{heroAnime ? heroAnime.title : 'Bem-vindo ao AniVerse'}</h1>
              <p className="lead mb-4 hero-description" style={{ color: 'var(--text-muted)' }}>
                {heroAnime?.synopsis ? `${heroAnime.synopsis.substring(0, 150)}...` : 'Descobre os teus animes favoritos, cria a tua Anime List e acompanha as tuas séries!'}
              </p>
              <div className="d-flex gap-3 hero-buttons">
                {heroAnime && (
                  <Link to={`/detalhes/anime/${heroAnime.mal_id}`} className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
                    <i className="bi bi-play-fill me-2"></i> Ver Detalhes
                  </Link>
                )}
                <Link to="/animes" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', border: 'none' }}>
                  Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        
        {/* SECÇÃO: TEMPORADA ATUAL (Horizontal Scroll) */}
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fw-800 m-0" style={{ fontSize: '1.5rem' }}>
              <span style={{ color: 'var(--accent-color)' }}>|</span> A sair nesta Temporada
            </h2>
            <Link to="/animes" className="text-decoration-none fw-bold" style={{ color: 'var(--text-muted)' }}>Ver todos &rarr;</Link>
          </div>

          <div className="horizontal-scroll">
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
                      <span>{anime.year || 'Em curso'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECÇÃO: TOP ANIMES (Grelha) */}
        <div className="mb-5 mt-5">
          <div className="d-flex align-items-center mb-4">
            <h2 className="fw-800 m-0" style={{ fontSize: '1.5rem' }}>
              <span style={{ color: 'var(--accent-color)' }}>|</span> Top Animes Populares
            </h2>
          </div>

          <div className="anime-grid">
            {topAnimesHero.map((anime) => (
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
                      <span>{anime.episodes ? `${anime.episodes} eps` : anime.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home