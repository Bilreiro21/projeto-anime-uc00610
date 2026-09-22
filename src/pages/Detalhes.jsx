import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function ReviewItem({ review }) {
  const [expandido, setExpandido] = useState(false);
  const maxLength = 300;
  const texto = review.review || "";
  const isLongo = texto.length > maxLength;

  return (
    <div className="card mb-3 border-0" style={{ backgroundColor: 'var(--bg-panel)' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <img 
              src={review.user?.images?.jpg?.image_url || "https://placehold.co/50"} 
              alt={review.user?.username} 
              className="rounded-circle shadow-sm"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            <div>
              <h6 className="fw-bold mb-0 text-white">{review.user?.username}</h6>
              <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
          </div>
          <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#f05039', color: '#fff' }}>
            ★ {review.score}
          </span>
        </div>

        <p className="text-muted" style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
          {expandido ? texto : (isLongo ? texto.slice(0, maxLength) + "..." : texto)}
        </p>

        {isLongo && (
          <button 
            onClick={() => setExpandido(!expandido)} 
            className="btn btn-link p-0 text-decoration-none fw-bold"
            style={{ fontSize: '0.9rem', color: '#f05039' }}
          >
            {expandido ? "Ler menos" : "Ler review completa"}
          </button>
        )}
      </div>
    </div>
  );
}

function Detalhes() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado da Lista
  const [listStatus, setListStatus] = useState(''); // 'watching', 'completed', 'plan_to_watch', 'dropped'
  const [listScore, setListScore] = useState(0);

  const [recs, setRecs] = useState([]);
  const [chars, setChars] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); 
    setLoading(true);

    // Load list status se estiver logado
    if (user) {
      const storageKey = `sorai-lista-${user.id}`;
      const favoritos = JSON.parse(localStorage.getItem(storageKey)) || [];
      const savedEntry = favoritos.find(fav => fav.mal_id == id);
      if (savedEntry) {
        setListStatus(savedEntry.listStatus || 'plan_to_watch');
        setListScore(savedEntry.listScore || 0);
      } else {
        setListStatus('');
        setListScore(0);
      }
    }

    fetch(`https://api.jikan.moe/v4/${type}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.data);
        return fetch(`https://api.jikan.moe/v4/${type}/${id}/recommendations`);
      })
      .then((res) => res.json())
      .then((data) => {
        setRecs(data.data || []);
        return fetch(`https://api.jikan.moe/v4/${type}/${id}/characters`);
      })
      .then((res) => res.json())
      .then((data) => {
        const principais = data.data?.filter(c => c.role === "Main") || data.data?.slice(0, 10);
        const listaFinal = principais.length < 5 ? data.data?.slice(0, 15) : principais;
        setChars(listaFinal || []);
        return fetch(`https://api.jikan.moe/v4/${type}/${id}/reviews`);
      })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.data?.slice(0, 6) || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
        setLoading(false);
      });
  }, [id, user]);

  const handleUpdateList = () => {
    if (!user) {
      toast.error('Precisas de iniciar sessão para adicionar à lista!');
      return;
    }

    if (!listStatus) {
      toast.error('Escolhe um estado para adicionar!', { icon: '⚠️' });
      return;
    }

    const storageKey = `sorai-lista-${user.id}`;
    let favoritos = JSON.parse(localStorage.getItem(storageKey)) || [];
    // Remove if already exists
    favoritos = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
    
    // Add updated entry
    favoritos.push({
      ...anime,
      listStatus: listStatus,
      listScore: listScore
    });

    localStorage.setItem(storageKey, JSON.stringify(favoritos));
    toast.success('Lista atualizada!', { icon: '✅' });
  };

  const handleRemoveFromList = () => {
    if (!user) return;
    const storageKey = `sorai-lista-${user.id}`;
    let favoritos = JSON.parse(localStorage.getItem(storageKey)) || [];
    favoritos = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
    localStorage.setItem(storageKey, JSON.stringify(favoritos));
    setListStatus('');
    setListScore(0);
    toast.success('Removido da lista.', { icon: '🗑️' });
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" style={{ color: '#f05039' }}></div></div>;
  if (!anime) return <div className="container mt-5">Conteúdo não encontrado.</div>;

  return (
    <>
      {/* HERO BANNER DE TOPO */}
      <div 
        className="anime-hero-banner"
        style={{ backgroundImage: `url(${anime.trailer?.images?.maximum_image_url || anime.images.jpg.large_image_url})` }}
      >
      </div>

      <div className="container mb-5" style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
        <div className="row g-5">
          
          {/* ESQUERDA: CONTEÚDO PRINCIPAL (2/3) */}
          <div className="col-lg-8 order-2 order-lg-1 mt-5 mt-lg-0">
            <h1 className="mb-2 fw-800 text-white" style={{ fontSize: '3rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {anime.title}
            </h1>
            
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              {anime.title_english ? anime.title_english : anime.title_japanese}
            </p>

            <h4 className="mb-3 text-white">Sinopse</h4>
            <p className="lead fs-6 text-muted" style={{ textAlign: 'justify', lineHeight: '1.8' }}>{anime.synopsis || "Sem sinopse."}</p>
            
            <hr style={{ borderColor: 'var(--border-color)' }} className="my-5"/>

            {/* PERSONAGENS */}
            {chars.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-4 text-white">Personagens Principais</h4>
                <div className="horizontal-scroll pb-3">
                  {chars.map((item, index) => (
                    <div key={index} style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}>
                      <div className="mb-2">
                        <img 
                          src={item.character.images.jpg.image_url} 
                          alt={item.character.name}
                          className="rounded-circle"
                          style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                        />
                      </div>
                      <h6 className="small fw-bold mb-0 text-truncate text-white">{item.character.name}</h6>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.role}</small>
                    </div>
                  ))}
                </div>
                <hr style={{ borderColor: 'var(--border-color)' }} className="my-5"/>
              </div>
            )}

            {/* MÚSICAS */}
            <div className="row mb-5">
              <div className="col-md-6 mb-3 mb-md-0">
                <h5 className="fw-bold mb-3" style={{ color: '#00b894' }}>🎵 Openings</h5>
                <ul className="list-group list-group-flush rounded" style={{ backgroundColor: 'var(--bg-panel)' }}>
                  {anime.theme?.openings?.length > 0 ? (
                    anime.theme.openings.map((op, i) => <li key={i} className="list-group-item small text-muted" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-color)' }}>{op}</li>)
                  ) : <li className="list-group-item small text-muted" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-color)' }}>Sem informação.</li>}
                </ul>
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold mb-3" style={{ color: '#d63031' }}>🎵 Endings</h5>
                <ul className="list-group list-group-flush rounded" style={{ backgroundColor: 'var(--bg-panel)' }}>
                  {anime.theme?.endings?.length > 0 ? (
                    anime.theme.endings.map((ed, i) => <li key={i} className="list-group-item small text-muted" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-color)' }}>{ed}</li>)
                  ) : <li className="list-group-item small text-muted" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-color)' }}>Sem informação.</li>}
                </ul>
              </div>
            </div>
            <hr style={{ borderColor: 'var(--border-color)' }} className="my-5"/>

            {/* REVIEWS */}
            {reviews.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-4 fw-bold text-white">💬 Opiniões da Comunidade</h3>
                <div className="row">
                  {reviews.map((review) => (
                     <div key={review.mal_id} className="col-12">
                        <ReviewItem review={review} />
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMENDAÇÕES */}
            {recs.length > 0 && (
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h3 className="mb-4 fw-bold text-white">Recomendações</h3>
                <div className="horizontal-scroll pb-3">
                  {recs.slice(0, 10).map((item) => (
                    <Link to={`/detalhes/${type}/${item.entry.mal_id}`} key={item.entry.mal_id} className="text-decoration-none" style={{ minWidth: '160px' }}>
                      <div className="anime-card">
                        <img src={item.entry.images.jpg.image_url} className="anime-card-img" alt={item.entry.title} />
                        <div className="anime-card-overlay">
                          <h6 className="anime-card-title text-center m-0">{item.entry.title}</h6>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* DIREITA: BARRA LATERAL E TRACKING (1/3) */}
          <div className="col-lg-4 order-1 order-lg-2">
            
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title} 
              className="img-fluid rounded-4 w-100 mb-4" 
              style={{ 
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.1)' 
              }} 
            />

            <div className="mb-4 d-flex flex-wrap gap-2">
              <span className="badge text-dark fw-bold px-3 py-2" style={{ backgroundColor: '#ffc107', fontSize: '1rem' }}>★ {anime.score || 'N/A'}</span>
              <span className="badge px-3 py-2" style={{ backgroundColor: 'var(--bg-panel)', color: '#fff', fontSize: '1rem', border: '1px solid var(--border-color)' }}>{anime.year || 'N/A'}</span>
              <span className="badge px-3 py-2" style={{ backgroundColor: 'rgba(240, 80, 57, 0.1)', color: '#f05039', fontSize: '1rem', border: '1px solid rgba(240, 80, 57, 0.3)' }}>{anime.status}</span>
            </div>
            
            {/* MyAnimeList Tracker Panel */}
            <div className="auth-modal p-4 mb-4">
              <h5 className="fw-bold mb-3 text-white border-bottom pb-2" style={{ borderColor: 'var(--border-color) !important' }}>Add to List</h5>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Estado</label>
                <select 
                  className="sorai-input" 
                  value={listStatus} 
                  onChange={(e) => setListStatus(e.target.value)}
                  style={{ paddingLeft: '14px' }}
                >
                  <option value="">-- Selecionar --</option>
                  <option value="watching">A Ver</option>
                  <option value="plan_to_watch">Planeio Ver</option>
                  <option value="completed">Completo</option>
                  <option value="dropped">Desisti</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Nota (Score)</label>
                <select 
                  className="sorai-input" 
                  value={listScore} 
                  onChange={(e) => setListScore(Number(e.target.value))}
                  style={{ paddingLeft: '14px' }}
                >
                  <option value="0">-- Sem Nota --</option>
                  {[10,9,8,7,6,5,4,3,2,1].map(n => (
                    <option key={n} value={n}>({n}) {
                      n === 10 ? 'Masterpiece' : 
                      n >= 8 ? 'Great' : 
                      n >= 6 ? 'Fine' : 
                      n >= 4 ? 'Bad' : 'Appalling'
                    }</option>
                  ))}
                </select>
              </div>

              <div className="d-flex flex-column gap-2">
                <button onClick={handleUpdateList} className="btn-coral">
                  Guardar
                </button>
                {listStatus && (
                  <button onClick={handleRemoveFromList} className="btn-coral-soft fw-bold p-2">
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="auth-modal p-4 mb-4">
              <h6 className="fw-bold text-white mb-3">Informações</h6>
              <ul className="list-unstyled mb-0 small text-muted">
                <li className="mb-2 d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <strong className="text-white">{type === 'manga' ? 'Capítulos' : 'Episódios'}</strong> 
                  <span>{anime.chapters || anime.episodes || "?"}</span>
                </li>
                {type === 'anime' && (
                  <li className="mb-2 d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                    <strong className="text-white">Duração</strong> 
                    <span>{anime.duration}</span>
                  </li>
                )}
                <li className="mb-2 d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <strong className="text-white">Estúdio/Autor</strong> 
                  <span className="text-end" style={{ color: '#f05039' }}>{anime.studios?.[0]?.name || anime.authors?.[0]?.name || "N/A"}</span>
                </li>
                <li className="mt-3">
                  <div className="d-flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span key={genre.mal_id} className="badge" style={{ backgroundColor: '#262626', color: '#a1a1aa' }}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light w-100 rounded-3">
                Ver no MyAnimeList <i className="bi bi-box-arrow-up-right ms-2"></i>
            </a>

          </div>
        </div>
      </div>
    </>
  );
}
export default Detalhes;