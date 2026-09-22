import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';

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
          <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--accent-color)', color: '#fff' }}>
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
            style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}
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

    // Load list status
    const favoritos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    const savedEntry = favoritos.find(fav => fav.mal_id == id);
    if (savedEntry) {
      setListStatus(savedEntry.listStatus || 'plan_to_watch');
      setListScore(savedEntry.listScore || 0);
    } else {
      setListStatus('');
      setListScore(0);
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
  }, [id]);

  const handleUpdateList = () => {
    if (!listStatus) {
      toast.error('Escolhe um estado para adicionar!', { icon: '⚠️' });
      return;
    }

    let favoritos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    // Remove if already exists
    favoritos = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
    
    // Add updated entry
    favoritos.push({
      ...anime,
      listStatus: listStatus,
      listScore: listScore
    });

    localStorage.setItem('meus-favoritos', JSON.stringify(favoritos));
    toast.success('Lista atualizada!', { icon: '✅' });
  };

  const handleRemoveFromList = () => {
    let favoritos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    favoritos = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
    localStorage.setItem('meus-favoritos', JSON.stringify(favoritos));
    setListStatus('');
    setListScore(0);
    toast.success('Removido da lista.', { icon: '🗑️' });
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" style={{ color: 'var(--accent-color)' }}></div></div>;
  if (!anime) return <div className="container mt-5">Anime não encontrado.</div>;

  return (
    <div className="container mt-5 mb-5">
      <Link to="/animes" className="btn btn-outline-light mb-4" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>&larr; Voltar à Lista</Link>
      
      <div className="row">
        {/* ESQUERDA (POSTER & PAINEL DA LISTA) */}
        <div className="col-md-4 mb-5 mb-md-4">
          <img 
            src={anime.images.jpg.large_image_url} 
            alt={anime.title} 
            className="img-fluid rounded w-100 mb-4" 
            style={{ 
              boxShadow: '0 10px 40px rgba(230, 28, 107, 0.2), 0 5px 15px rgba(0,0,0,0.5)', 
              border: '1px solid rgba(255,255,255,0.05)' 
            }} 
          />
          
          {/* MyAnimeList Tracker Panel */}
          <div className="bento-box mb-4">
            <h5 className="fw-bold mb-3 text-white border-bottom pb-2" style={{ borderColor: 'var(--border-color) !important' }}>A Minha Lista</h5>
            
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Estado</label>
              <select 
                className="form-select" 
                value={listStatus} 
                onChange={(e) => setListStatus(e.target.value)}
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
                className="form-select" 
                value={listScore} 
                onChange={(e) => setListScore(Number(e.target.value))}
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

            <div className="d-grid gap-2">
              <button onClick={handleUpdateList} className="btn btn-primary fw-bold">
                Guardar
              </button>
              {listStatus && (
                <button onClick={handleRemoveFromList} className="btn text-danger fw-bold" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                  Remover
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <h6 className="fw-bold text-white mb-3">Informações</h6>
            <ul className="list-unstyled mb-0 small text-muted">
              <li className="mb-2"><strong className="text-white">Episódios:</strong> {anime.episodes || "?"}</li>
              <li className="mb-2"><strong className="text-white">Duração:</strong> {anime.duration}</li>
              <li className="mb-2"><strong className="text-white">Estado:</strong> {anime.status}</li>
              <li><strong className="text-white">Estúdio:</strong> {anime.studios?.[0]?.name || "N/A"}</li>
            </ul>
          </div>
        </div>

        {/* DIREITA (INFO PRINCIPAL) */}
        <div className="col-md-8">
          <h1 className="mb-3 fw-800 text-white" style={{ fontSize: '3rem' }}>{anime.title}</h1>

          <div className="mb-4 d-flex flex-wrap gap-2">
            <span className="badge text-dark fw-bold px-3 py-2" style={{ backgroundColor: '#ffc107', fontSize: '1rem' }}>★ {anime.score}</span>
            <span className="badge px-3 py-2" style={{ backgroundColor: 'var(--bg-panel-hover)', color: '#fff', fontSize: '1rem' }}>{anime.year || 'N/A'}</span>
            {anime.genres.map((genre) => (
              <span key={genre.mal_id} className="badge px-3 py-2" style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}>
                {genre.name}
              </span>
            ))}
          </div>

          <h4 className="mb-3 text-white">Sinopse</h4>
          <p className="lead fs-6 text-muted" style={{ textAlign: 'justify', lineHeight: '1.8' }}>{anime.synopsis || "Sem sinopse."}</p>
          
          <div className="mt-4 mb-5">
            <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light rounded-pill px-4">
                Ver no MyAnimeList <i className="bi bi-box-arrow-up-right ms-2"></i>
            </a>
          </div>

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
              <hr style={{ borderColor: 'var(--border-color)' }} className="my-5"/>
            </div>
          )}

          {/* TRAILER */}
          {anime.trailer.embed_url && (
            <div className="mb-5">
              <h4 className="mb-4 text-white">Trailer</h4>
              <div className="ratio ratio-16x9 rounded overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                <iframe src={anime.trailer.embed_url} title="Trailer" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      {recs.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <h3 className="mb-4 fw-bold text-white">Se gostaste, vê também...</h3>
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
  );
}
export default Detalhes;