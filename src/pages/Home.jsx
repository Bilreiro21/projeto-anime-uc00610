import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [topAnimesHero, setTopAnimesHero] = useState([])
  const [seasonNow, setSeasonNow] = useState([])

  // Imagem de substituição caso a API falhe (Um cinzento neutro com texto)
  const PLACEHOLDER_IMG = "https://placehold.co/400x600/2c3e50/ffffff?text=Sem+Imagem";

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // 1. Carregar Top Animes
        const resTop = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
        if (resTop.ok) {
          const data = await resTop.json();
          setTopAnimesHero(data.data || []);
        }

        // Delay para não bloquear a API
        await new Promise(r => setTimeout(r, 800));

        // 2. Carregar Temporada Atual
        const resSeason = await fetch('https://api.jikan.moe/v4/seasons/now?limit=6');
        if (resSeason.ok) {
          const data = await resSeason.json();
          setSeasonNow(data.data || []);
        }

      } catch (error) {
        console.error("Erro ao carregar Home:", error);
      }
    };

    carregarDados();
  }, []);

  // Função para tratar erro de imagem (se a imagem quebrar, põe a de substituição)
  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div>
      {/* HERO SECTION ANIMADA */}
      <div className="hero-animated">
        <div className="container text-center">
          <h1 className="hero-title display-4 mb-3">O Teu Portal de Anime</h1>
          <p className="lead mb-5 opacity-75">
            Acompanha as tuas séries favoritas, descobre novos mangas e organiza a tua lista.
          </p>
          
          {/* NAVEGAÇÃO VISUAL (CARTÕES) */}
          <div className="row justify-content-center g-4 mb-5">
            
            {/* Cartão ANIME - Usei uma imagem mais estável */}
            <div className="col-md-5">
              <Link to="/animes">
                <div className="nav-card">
                  <img 
                    src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop" 
                    alt="Animes" 
                    className="nav-card-bg"
                    onError={handleImageError} 
                  />
                  <div className="nav-card-content">
                    <h2 className="nav-card-title">🎬 Animes</h2>
                    <span className="btn btn-outline-light rounded-pill px-4 mt-2">Explorar</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Cartão MANGA - Usei uma imagem mais estável */}
            <div className="col-md-5">
              <Link to="/mangas">
                <div className="nav-card">
                  <img 
                    src="https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1000&auto=format&fit=crop" 
                    alt="Mangas" 
                    className="nav-card-bg" 
                    onError={handleImageError}
                  />
                  <div className="nav-card-content">
                    <h2 className="nav-card-title">📚 Mangas</h2>
                    <span className="btn btn-outline-light rounded-pill px-4 mt-2">Ler Mais</span>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* MARQUEE (FAIXA A CORRER) */}
        {topAnimesHero.length > 0 && (
          <div className="marquee-container" style={{ marginTop: '40px' }}>
            <div className="marquee-track">
              {[...topAnimesHero, ...topAnimesHero].map((item, index) => (
                <div key={index} className="marquee-item">
                  <img 
                    src={item.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                    alt={item.title} 
                    onError={handleImageError}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECÇÃO: DESTAQUES DA TEMPORADA */}
      <div className="container my-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold border-start border-4 border-primary ps-3">🔥 A sair nesta Temporada</h2>
          <Link to="/animes" className="text-decoration-none fw-bold">Ver todos &rarr;</Link>
        </div>

        <div className="row">
          {seasonNow.map((anime) => (
            <div key={anime.mal_id} className="col-6 col-md-4 col-lg-2 mb-4">
              <div className="card h-100 shadow-sm border-0 hover-effect">
                <Link to={`/detalhes/${anime.mal_id}`} className="text-decoration-none text-dark">
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px' }}>
                    {/* Aqui usamos Optional Chaining (?.) para não dar erro se a imagem faltar */}
                    <img 
                      src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || PLACEHOLDER_IMG} 
                      className="card-img-top" 
                      style={{ height: '250px', objectFit: 'cover' }} 
                      alt={anime.title} 
                      onError={handleImageError}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-2" 
                         style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <span className="text-white small fw-bold">⭐ {anime.score || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="card-body p-2">
                    <h6 className="card-title small fw-bold text-truncate mb-0 mt-1">
                      {anime.title}
                    </h6>
                    <small className="text-muted">{anime.episodes ? `${anime.episodes} eps` : 'Em curso'}</small>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home