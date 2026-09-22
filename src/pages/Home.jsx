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
    <div className="container mt-4 mb-5" style={{ minHeight: '80vh' }}>
      {/* HERO SECTION (Bento Box Style) */}
      <div 
        className="bento-box mb-5 overflow-hidden position-relative d-flex align-items-end p-5" 
        style={{ 
          minHeight: '400px',
          backgroundImage: heroAnime 
            ? `url(${heroAnime.trailer?.images?.maximum_image_url || heroAnime.images?.jpg?.large_image_url})` 
            : 'url(https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: 'none'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.2) 100%)', zIndex: 1 }}></div>
        
        <div className="position-relative z-index-2 w-100" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-lg-8">
              <span className="badge mb-3 text-uppercase fw-bold tracking-wide" style={{ background: 'var(--accent-color)' }}>
                Em Destaque
              </span>
              <h1 className="hero-title text-white">{heroAnime ? heroAnime.title : 'Bem-vindo ao AniVerse'}</h1>
              <p className="lead mb-4 hero-description text-white" style={{ opacity: 0.9 }}>
                {heroAnime?.synopsis ? `${heroAnime.synopsis.substring(0, 150)}...` : 'Descobre os teus animes favoritos, cria a tua Anime List e acompanha as tuas séries!'}
              </p>
              <div className="d-flex gap-3 hero-buttons">
                {heroAnime && (
                  <Link to={`/detalhes/anime/${heroAnime.mal_id}`} className="btn btn-primary">
                    <i className="bi bi-play-fill me-2"></i> Ver Detalhes
                  </Link>
                )}
                <Link to="/animes" className="btn btn-outline-primary" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                  Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* SECÇÃO: TEMPORADA ATUAL (Horizontal Scroll) */}
        <div className="col-12 mb-4">
          <div className="bento-box">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="fw-800 m-0" style={{ fontSize: '1.5rem' }}>
                A sair nesta Temporada
              </h2>
              <Link to="/animes" className="btn btn-outline-primary btn-sm px-3">Ver todos</Link>
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
        </div>

        {/* SECÇÃO: TOP ANIMES (Grelha) */}
        <div className="col-12">
          <div className="bento-box">
            <div className="d-flex align-items-center mb-4">
              <h2 className="fw-800 m-0" style={{ fontSize: '1.5rem' }}>
                Top Animes Populares
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
    </div>
  )
}

export default Home