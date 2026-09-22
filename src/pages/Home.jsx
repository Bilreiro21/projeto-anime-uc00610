import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const [topAnimesHero, setTopAnimesHero] = useState([])
  const [seasonNow, setSeasonNow] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const PLACEHOLDER_IMG = "https://placehold.co/400x600/16161a/ffffff?text=Sem+Imagem"

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resSeason = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8');
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
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* HERO BANNER */}
      {loading ? (
        <div className="w-100 placeholder" style={{ height: '560px' }}></div>
      ) : (
        <div className="hero-animated" style={{ 
          backgroundImage: topAnimesHero.length > 0 ? `url(${topAnimesHero[0].trailer?.images?.maximum_image_url || topAnimesHero[0].images?.jpg?.large_image_url})` : 'none'
        }}>
          <div className="hero-content max-w-container mx-auto px-4 px-md-5 w-100">
            {topAnimesHero.length > 0 && (
              <div className="pb-5">
                <span className="badge mb-3 text-uppercase fw-bold" style={{ backgroundColor: '#f05039', color: '#fff', padding: '6px 12px' }}>
                  #1 Em Destaque
                </span>
                <h1 className="hero-title text-white">{topAnimesHero[0].title}</h1>
                <p className="text-muted d-none d-md-block mb-4" style={{ maxWidth: '600px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {topAnimesHero[0].synopsis ? topAnimesHero[0].synopsis.slice(0, 180) + '...' : 'Sem sinopse.'}
                </p>
                <div className="d-flex gap-3">
                  <Link to={`/detalhes/anime/${topAnimesHero[0].mal_id}`} className="btn-coral text-center text-decoration-none d-inline-flex align-items-center justify-content-center" style={{ width: 'auto' }}>
                    <i className="bi bi-play-fill fs-5 me-1"></i> Ver Detalhes
                  </Link>
                  <Link to="/animes" className="btn text-white fw-bold px-4 py-2" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', transition: 'all 0.2s' }}>
                    Explorar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="max-w-container mx-auto px-4 px-md-5 py-5">
        
        {/* IN SEASON & TOP ANIME GRID */}
        <section className="mb-5">
          <div className="row g-5">
            {/* Esquerda: IN SEASON */}
            <div className="col-xl-8">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', backgroundColor: 'rgba(240, 80, 57, 0.1)' }}>
                    <i className="bi bi-stars" style={{ color: '#f05039', fontSize: '1rem' }}></i>
                  </div>
                  <h2 className="text-white m-0 fw-bold" style={{ fontSize: '1.5rem' }}>In Season</h2>
                </div>
                <Link to="/temporadas" className="text-decoration-none small text-primary d-flex align-items-center gap-1 hover-glow">
                  View all <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
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
                  seasonNow.map((anime) => (
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
                            <p className="text-muted m-0 small">{anime.type}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Direita: TOP ANIME */}
            <div className="col-xl-4">
              <div className="top-ranking">
                <div className="top-ranking__header">
                  <div className="top-ranking__header-title text-white">
                    <i className="bi bi-trophy text-warning"></i> Top Anime
                  </div>
                  <div className="top-ranking__tabs">
                    <button className="top-ranking__tab top-ranking__tab--active">All Time</button>
                  </div>
                </div>

                <div className="top-ranking__list">
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="top-ranking__row">
                        <span className="top-ranking__rank placeholder">#</span>
                        <div className="top-ranking__info placeholder" style={{ height: '24px', borderRadius: '4px' }}></div>
                      </div>
                    ))
                  ) : (
                    topAnimesHero.map((anime, index) => (
                      <Link to={`/detalhes/anime/${anime.mal_id}`} key={anime.mal_id} className="text-decoration-none">
                        <div className="top-ranking__row">
                          <span className={`top-ranking__rank ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>
                            #{index + 1}
                          </span>
                          <img 
                            src={anime.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                            alt={anime.title}
                            className="top-ranking__cover"
                            onError={handleImageError}
                          />
                          <div className="top-ranking__info">
                            <h4 className="text-white top-ranking__title">{anime.title}</h4>
                            <div className="d-flex align-items-center gap-2">
                              <span className="top-ranking__score"><i className="bi bi-star-fill" style={{ fontSize: '0.8rem' }}></i> {anime.score}</span>
                              <span className="text-muted small">• {anime.year || anime.type}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        {!user && (
          <section className="mb-5 mt-5">
            <div className="rounded-4 overflow-hidden position-relative p-4 p-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' }}>
              
              <div className="position-absolute top-0 end-0 rounded-circle pointer-events-none" style={{ width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.05)', transform: 'translate(35%, -35%)' }}></div>
              
              <div className="position-relative z-1 text-center text-md-start">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                  <i className="bi bi-book" style={{ color: '#ddd6fe' }}></i>
                  <span style={{ color: '#ddd6fe', fontSize: '0.9rem' }}>Completely free</span>
                </div>
                <h3 className="text-white mb-2 fw-bold" style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>
                  Track your progress,<br className="d-none d-md-block" />organize your anime list
                </h3>
                <p style={{ color: '#ddd6fe', fontSize: '0.95rem' }} className="m-0">
                  Keep track of everything you watch, your scores, and much more.
                </p>
              </div>

              <div className="position-relative z-1 d-flex flex-column flex-sm-row gap-3">
                <Link to="/register" className="btn text-primary fw-bold" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '12px 24px' }}>
                  Create free account
                </Link>
                <Link to="/login" className="btn text-white fw-bold" style={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '12px 24px' }}>
                  Sign in
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Home