import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";

function Detalhes() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((response) => response.json())
      .then((data) => { setAnime(data.data); setLoading(false); })
      .catch((error) => { console.error("Erro:", error); setLoading(false); });
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
      <Link to="/" className="btn btn-outline-secondary mb-4">&larr; Voltar à Lista</Link>
      <div className="row">
        <div className="col-md-4 mb-4">
          <img src={anime.images.jpg.large_image_url} alt={anime.title} className="img-fluid rounded shadow w-100" />
          <div className="mt-4 p-3 rounded shadow-sm border bg-light">
            <h5>Informações</h5>
            <ul className="list-unstyled mb-0">
              <li><strong>Episódios:</strong> {anime.episodes || "Desc."}</li>
              <li><strong>Duração:</strong> {anime.duration}</li>
              <li><strong>Estado:</strong> {anime.status}</li>
              <li><strong>Tipo:</strong> {anime.type}</li>
            </ul>
          </div>
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">{anime.title}</h1>
          <div className="mb-4">
            <span className="badge bg-warning text-dark me-2">Nota Geral: {anime.score}</span>
            <span className="badge bg-info text-dark me-2">Ano: {anime.year}</span>
            {anime.genres.map((genre) => <span key={genre.mal_id} className="badge border text-dark me-1">{genre.name}</span>)}
          </div>

          <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
            <Rating valorAtual={userRating} onRate={handleRate} />
          </div>

          <h3>Sinopse</h3>
          <p className="lead fs-6" style={{ textAlign: 'justify' }}>{anime.synopsis || "Sem sinopse."}</p>
          <hr />

          {anime.trailer.embed_url ? (
            <div className="mt-4">
              <h3 className="mb-3">Trailer Oficial</h3>
              <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
                <iframe src={anime.trailer.embed_url} title="Trailer" allowFullScreen></iframe>
              </div>
            </div>
          ) : <div className="alert alert-secondary mt-4">Sem trailer disponível.</div>}

          <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">Ver mais no MyAnimeList</a>
        </div>
      </div>
    </div>
  );
}
export default Detalhes;