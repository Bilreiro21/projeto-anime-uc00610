import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SkeletonCard from '../components/SkeletonCard'

function Animes() {
  const [animes, setAnimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  
  const [pesquisa, setPesquisa] = useState('') 
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [ordem, setOrdem] = useState('popularity') 

  const [favoritos, setFavoritos] = useState([])
  const [userRatings, setUserRatings] = useState({})

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    setFavoritos(favs);
    const ratings = JSON.parse(localStorage.getItem('meus-ratings')) || {};
    setUserRatings(ratings);
  }, []);

  const toggleFavorito = (anime) => {
    let novaLista;
    const existe = favoritos.find(fav => fav.mal_id === anime.mal_id);

    if (existe) {
      novaLista = favoritos.filter(fav => fav.mal_id !== anime.mal_id);
      toast.error(`Removido: ${anime.title}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    } else {
      novaLista = [...favoritos, anime];
      toast.success(`Adicionado: ${anime.title}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }, icon: '❤️' });
    }
    setFavoritos(novaLista);
    localStorage.setItem('meus-favoritos', JSON.stringify(novaLista));
  }

  const isFavorito = (id) => favoritos.some(fav => fav.mal_id === id);
  const getMyRating = (id) => userRatings[id] || 0;

  const carregarAnimes = () => {
    setLoading(true); setErro(null);
    let url = `https://api.jikan.moe/v4/anime?page=${page}&order_by=${ordem}&sort=desc`
    if (pesquisa) url += `&q=${pesquisa}`
    else if (ordem === 'popularity') url = `https://api.jikan.moe/v4/top/anime?page=${page}`

    fetch(url)
      .then(res => { if (!res.ok) throw new Error('Erro na API'); return res.json(); })
      .then(data => { setAnimes(data.data || []); setLastPage(data.pagination?.last_visible_page || 1); setLoading(false); })
      .catch(err => { console.error(err); setErro("Erro ao carregar animes."); setLoading(false); })
  }

  useEffect(() => { carregarAnimes() }, [page, ordem]) 

  const handlePesquisa = (e) => { e.preventDefault(); setPage(1); carregarAnimes(); }
  const handleLimpar = () => { window.location.reload(); }

  return (
    // AQUI ESTÁ A MUDANÇA: paddingTop passou de 80px para 140px
    <div className="container mt-4 mb-5" style={{ paddingTop: '140px' }}> 
      
      <h1 className="text-center mb-4 fw-bold display-5">🎬 Explorar Animes</h1>
      
      {/* BARRA DE PESQUISA */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-10">
          <form onSubmit={handlePesquisa} className="d-flex flex-column flex-md-row gap-2 p-3 bg-light rounded shadow-sm border">
            <input 
              type="text" 
              className="form-control border-0 bg-light" 
              placeholder="Pesquisar anime..." 
              value={pesquisa} 
              onChange={(e) => setPesquisa(e.target.value)} 
            />
            <div className="vr d-none d-md-block"></div>
            <select 
              className="form-select border-0 bg-light" 
              style={{ maxWidth: '200px' }} 
              value={ordem} 
              onChange={(e) => { setOrdem(e.target.value); setPage(1); }}
            >
              <option value="popularity">Mais Populares</option>
              <option value="score">Melhor Nota</option>
              <option value="start_date">Mais Recentes</option>
              <option value="episodes">Mais Episódios</option>
            </select>
            <button type="submit" className="btn btn-primary px-4">Ir</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleLimpar}>Limpar</button>
          </form>
        </div>
      </div>

      {loading && <div className="row">{[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}</div>}
      {erro && <div className="alert alert-danger text-center">{erro}</div>}

      {!loading && !erro && (
        <>
          <div className="row">
            {animes.map((anime) => {
              const myRate = getMyRating(anime.mal_id);
              return (
                <div key={anime.mal_id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0 hover-effect">
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                      <Link to={`/detalhes/${anime.mal_id}`}>
                        <img src={anime.images.jpg.image_url} className="card-img-top" alt={anime.title} style={{ height: '300px', objectFit: 'cover' }} />
                      </Link>
                      <button className="btn btn-light rounded-circle shadow-sm" style={{ position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }} onClick={() => toggleFavorito(anime)}>
                        {isFavorito(anime.mal_id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate fw-bold">{anime.title}</h5>
                      <div className="mb-2">
                          <span className="badge bg-warning text-dark me-1">★ {anime.score}</span>
                          <span className="badge bg-secondary me-1">{anime.year || 'N/A'}</span>
                          {myRate > 0 && <span className="badge bg-success border border-light">Minha: {myRate} ★</span>}
                      </div>
                      <Link to={`/detalhes/${anime.mal_id}`} className="btn btn-primary mt-auto rounded-pill">Ver Detalhes</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <button className="btn btn-secondary rounded-pill px-4" onClick={() => setPage(page - 1)} disabled={page === 1}>&larr; Anterior</button>
            <span className="fw-bold">Página {page} de {lastPage}</span>
            <button className="btn btn-secondary rounded-pill px-4" onClick={() => setPage(page + 1)} disabled={page === lastPage}>Próximo &rarr;</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Animes