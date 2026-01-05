import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Rating from "../components/Rating";

// --- COMPONENTE AUXILIAR PARA UMA REVIEW INDIVIDUAL ---
// (Serve para gerir o botão "Ler mais" de cada comentário)
function ReviewItem({ review }) {
  const [expandido, setExpandido] = useState(false);
  const maxLength = 300; // Número de caracteres antes de cortar
  const texto = review.review || "";
  const isLongo = texto.length > maxLength;

  return (
    <div className="card mb-3 shadow-sm border-0 bg-light">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          {/* Info do Utilizador */}
          <div className="d-flex align-items-center gap-3">
            <img 
              src={review.user?.images?.jpg?.image_url || "https://placehold.co/50"} 
              alt={review.user?.username} 
              className="rounded-circle border border-2 border-white shadow-sm"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            <div>
              <h6 className="fw-bold mb-0">{review.user?.username}</h6>
              <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
          </div>
          {/* Nota dada pelo utilizador */}
          <span className="badge bg-primary rounded-pill px-3 py-2">
            ★ {review.score}
          </span>
        </div>

        {/* Texto da Review */}
        <p className="text-muted" style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
          {expandido ? texto : (isLongo ? texto.slice(0, maxLength) + "..." : texto)}
        </p>

        {/* Botão Ler Mais */}
        {isLongo && (
          <button 
            onClick={() => setExpandido(!expandido)} 
            className="btn btn-link p-0 text-decoration-none fw-bold"
            style={{ fontSize: '0.9rem' }}
          >
            {expandido ? "Ler menos" : "Ler review completa"}
          </button>
        )}
      </div>
    </div>
  );
}

function Detalhes() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  
  const [isFav, setIsFav] = useState(false);
  const [recs, setRecs] = useState([]);
  const [chars, setChars] = useState([]);
  const [reviews, setReviews] = useState([]); // <--- NOVO ESTADO PARA REVIEWS

  useEffect(() => {
    window.scrollTo(0, 0); 
    setLoading(true);

    const favoritos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    const jaExiste = favoritos.some(fav => fav.mal_id == id);
    setIsFav(jaExiste);

    // CADEIA DE FETCHES (Detalhes -> Recs -> Personagens -> Reviews)
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.data);
        return fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
      })
      .then((res) => res.json())
      .then((data) => {
        setRecs(data.data || []);
        return fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
      })
      .then((res) => res.json())
      .then((data) => {
        const principais = data.data?.filter(c => c.role === "Main") || data.data?.slice(0, 10);
        const listaFinal = principais.length < 5 ? data.data?.slice(0, 15) : principais;
        setChars(listaFinal || []);
        
        // --- NOVO FETCH: REVIEWS ---
        return fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
      })
      .then((res) => res.json())
      .then((data) => {
        // Guardamos as primeiras 6 reviews para não encher demasiado a página
        setReviews(data.data?.slice(0, 6) || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('meus-ratings')) || {};
    setUserRating(storedRatings[id] || 0);
  }, [id]);

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    const existe = favoritos.find(fav => fav.mal_id === anime.mal_id);

    let novaLista;
    if (existe) {
      novaLista = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
      toast.error(`Removido: ${anime.title}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      setIsFav(false);
    } else {
      novaLista = [...favoritos, anime];
      toast.success(`Adicionado: ${anime.title}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }, icon: '❤️' });
      setIsFav(true);
    }
    localStorage.setItem('meus-favoritos', JSON.stringify(novaLista));
  };

  const handleRate = (novaNota) => {
    setUserRating(novaNota);
    const storedRatings = JSON.parse(localStorage.getItem('meus-ratings')) || {};
    storedRatings[id] = novaNota;
    localStorage.setItem('meus-ratings', JSON.stringify(storedRatings));
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!anime) return <div className="container mt-5">Anime não encontrado.</div>;

  return (
    <div className="container mt-5 mb-5">
      <Link to="/animes" className="btn btn-outline-secondary mb-4">&larr; Voltar à Lista</Link>
      
      <div className="row">
        {/* ESQUERDA */}
        <div className="col-md-4 mb-4">
          <img src={anime.images.jpg.large_image_url} alt={anime.title} className="img-fluid rounded shadow w-100" />
          <div className="mt-4 p-3 rounded shadow-sm border bg-light">
            <h5>Informações</h5>
            <ul className="list-unstyled mb-0 small">
              <li><strong>Episódios:</strong> {anime.episodes || "?"}</li>
              <li><strong>Duração:</strong> {anime.duration}</li>
              <li><strong>Estado:</strong> {anime.status}</li>
              <li><strong>Estúdio:</strong> {anime.studios?.[0]?.name || "N/A"}</li>
            </ul>
          </div>
        </div>

        {/* DIREITA */}
        <div className="col-md-8">
          <div className="d-flex align-items-start justify-content-between">
            <h1 className="mb-3 fw-bold">{anime.title}</h1>
            <button onClick={toggleFavorito} className="btn btn-lg border-0" style={{ fontSize: '2rem' }}>
                {isFav ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="mb-4">
            <span className="badge bg-warning text-dark me-2">Nota: {anime.score}</span>
            <span className="badge bg-info text-dark me-2">{anime.year}</span>
            {anime.genres.map((genre) => <span key={genre.mal_id} className="badge border text-dark me-1 bg-light">{genre.name}</span>)}
          </div>

          <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
            <Rating valorAtual={userRating} onRate={handleRate} />
          </div>

          <h4 className="mb-3">Sinopse</h4>
          <p className="lead fs-6 text-muted" style={{ textAlign: 'justify', lineHeight: '1.8' }}>{anime.synopsis || "Sem sinopse."}</p>
          
          <div className="d-flex gap-3 mt-4 mb-5">
            <button 
                onClick={toggleFavorito} 
                className={`btn ${isFav ? 'btn-danger' : 'btn-outline-danger'} btn-lg shadow-sm rounded-pill px-4`}
            >
                {isFav ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
            </button>

            <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg shadow-sm rounded-pill px-4">
                Ver no MyAnimeList
            </a>
          </div>

          <hr className="my-5"/>

          {/* PERSONAGENS */}
          {chars.length > 0 && (
            <div className="mb-5">
              <h4 className="mb-3">Personagens Principais</h4>
              <div className="d-flex gap-3 overflow-auto pb-3" style={{ scrollBehavior: 'smooth' }}>
                {chars.map((item, index) => (
                  <div key={index} style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}>
                    <div className="mb-2">
                      <img 
                        src={item.character.images.jpg.image_url} 
                        alt={item.character.name}
                        className="rounded-circle shadow-sm"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #fff' }}
                      />
                    </div>
                    <h6 className="small fw-bold mb-0 text-truncate">{item.character.name}</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.role}</small>
                  </div>
                ))}
              </div>
              <hr className="my-5"/>
            </div>
          )}

          {/* MÚSICAS */}
          <div className="row mb-5">
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 className="fw-bold text-success">🎵 Openings</h5>
              <ul className="list-group list-group-flush shadow-sm rounded">
                {anime.theme?.openings?.length > 0 ? (
                  anime.theme.openings.map((op, i) => <li key={i} className="list-group-item small bg-light">{op}</li>)
                ) : <li className="list-group-item small bg-light text-muted">Sem informação.</li>}
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold text-danger">🎵 Endings</h5>
              <ul className="list-group list-group-flush shadow-sm rounded">
                {anime.theme?.endings?.length > 0 ? (
                  anime.theme.endings.map((ed, i) => <li key={i} className="list-group-item small bg-light">{ed}</li>)
                ) : <li className="list-group-item small bg-light text-muted">Sem informação.</li>}
              </ul>
            </div>
          </div>
          <hr className="my-5"/>

          {/* --- NOVA SECÇÃO: REVIEWS --- */}
          {reviews.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4 fw-bold">💬 Opiniões da Comunidade</h3>
              <div className="row">
                {reviews.map((review) => (
                   <div key={review.mal_id} className="col-12">
                      <ReviewItem review={review} />
                   </div>
                ))}
              </div>
              <hr className="my-5"/>
            </div>
          )}

          {/* TRAILER */}
          {anime.trailer.embed_url && (
            <div className="mb-5">
              <h4 className="mb-3">Trailer</h4>
              <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
                <iframe src={anime.trailer.embed_url} title="Trailer" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      {recs.length > 0 && (
        <div className="mt-5 pt-4 border-top">
          <h3 className="mb-4 fw-bold">Se gostaste de {anime.title}, vê também...</h3>
          <div className="d-flex gap-3 overflow-auto pb-3" style={{ scrollBehavior: 'smooth' }}>
            {recs.slice(0, 10).map((item) => (
              <div key={item.entry.mal_id} style={{ minWidth: '160px', width: '160px' }}>
                <div className="card h-100 shadow-sm border-0 hover-effect">
                  <Link to={`/detalhes/${item.entry.mal_id}`} className="text-decoration-none text-dark">
                    <img src={item.entry.images.jpg.image_url} className="card-img-top" style={{ height: '220px', objectFit: 'cover', borderRadius: '10px' }} alt={item.entry.title} />
                    <div className="card-body p-2 text-center">
                      <h6 className="card-title small fw-bold text-truncate mb-0">{item.entry.title}</h6>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default Detalhes;