import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";

function Detalhes() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  
  // NOVOS ESTADOS
  const [recs, setRecs] = useState([]);
  const [chars, setChars] = useState([]); // Para as personagens

  useEffect(() => {
    window.scrollTo(0, 0); 
    setLoading(true);

    // 1. Fetch Detalhes
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.data);
        // 2. Fetch Recomendações
        return fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
      })
      .then((res) => res.json())
      .then((data) => {
        setRecs(data.data || []);
        // 3. Fetch Personagens (NOVO)
        return fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
      })
      .then((res) => res.json())
      .then((data) => {
        // Guardamos apenas as personagens principais (Main) para não encher demasiado
        // Ou as primeiras 15 se não houver distinção
        const principais = data.data?.filter(c => c.role === "Main") || data.data?.slice(0, 10);
        // Se a lista de principais for muito pequena, mostramos mais algumas secundárias
        const listaFinal = principais.length < 5 ? data.data?.slice(0, 15) : principais;
        
        setChars(listaFinal || []);
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
          <h1 className="mb-3 fw-bold">{anime.title}</h1>
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
          
          <hr className="my-5"/>

          {/* --- NOVA SECÇÃO: PERSONAGENS --- */}
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

          {/* TRAILER */}
          {anime.trailer.embed_url && (
            <div className="mb-5">
              <h4 className="mb-3">Trailer</h4>
              <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
                <iframe src={anime.trailer.embed_url} title="Trailer" allowFullScreen></iframe>
              </div>
            </div>
          )}

          <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Ver no MyAnimeList</a>
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