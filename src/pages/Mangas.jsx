import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Mangas() {
  const [mangas, setMangas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  
  const [pesquisa, setPesquisa] = useState('') 
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [ordem, setOrdem] = useState('popularity') 

  const carregarMangas = () => {
    setLoading(true); setErro(null);
    let url = `https://api.jikan.moe/v4/manga?page=${page}&order_by=${ordem}&sort=desc`
    if (pesquisa) {
      url += `&q=${pesquisa}`
    } else {
      if (ordem === 'popularity') url = `https://api.jikan.moe/v4/top/manga?page=${page}&filter=bypopularity`
      else if (ordem === 'score') url = `https://api.jikan.moe/v4/top/manga?page=${page}`
    }

    fetch(url)
      .then(res => { if (!res.ok) throw new Error('Erro na API'); return res.json(); })
      .then(data => { setMangas(data.data || []); setLastPage(data.pagination?.last_visible_page || 1); setLoading(false); })
      .catch(err => { console.error(err); setErro("Erro ao carregar mangas."); setLoading(false); })
  }

  useEffect(() => { carregarMangas() }, [page, ordem]) 

  const handlePesquisa = (e) => { e.preventDefault(); setPage(1); carregarMangas(); }
  const handleLimpar = () => { window.location.reload(); }

  return (
    <div className="container mt-4 mb-5" style={{ paddingTop: '100px', minHeight: '80vh' }}> 
      
      <h1 className="text-center mb-5 fw-800" style={{ fontSize: '3rem' }}>
        Explorar <span style={{ color: 'var(--accent-color)' }}>Mangas</span>
      </h1>
      
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-10">
          <form onSubmit={handlePesquisa} className="bento-box d-flex flex-column flex-md-row gap-3 p-4">
            <input 
              type="text" 
              className="form-control border-0 text-white" 
              placeholder="Pesquisar manga..." 
              value={pesquisa} 
              onChange={(e) => setPesquisa(e.target.value)} 
              style={{ backgroundColor: 'transparent' }}
            />
            <div className="vr d-none d-md-block" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <select 
              className="form-select border-0 text-white" 
              style={{ maxWidth: '200px', backgroundColor: 'transparent' }} 
              value={ordem} 
              onChange={(e) => { setOrdem(e.target.value); setPage(1); }}
            >
              <option value="popularity" style={{ color: '#000' }}>Mais Populares</option>
              <option value="score" style={{ color: '#000' }}>Melhor Nota</option>
              <option value="start_date" style={{ color: '#000' }}>Mais Recentes</option>
              <option value="chapters" style={{ color: '#000' }}>Mais Capítulos</option>
            </select>
            <button type="submit" className="btn btn-primary px-4 fw-bold">Ir</button>
            <button type="button" className="btn btn-outline-light" style={{ borderColor: 'var(--border-color)' }} onClick={handleLimpar}>Limpar</button>
          </form>
        </div>
      </div>

      {loading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border" style={{ color: 'var(--accent-color)' }}></div></div>}
      {erro && <div className="alert text-center" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid #dc3545' }}>{erro}</div>}

      {!loading && !erro && (
        <>
          <div className="anime-grid">
            {mangas.map((manga) => (
              <Link to={`/detalhes/manga/${manga.mal_id}`} key={manga.mal_id} className="text-decoration-none">
                <div className="anime-card">
                  <img 
                    src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url} 
                    className="anime-card-img" 
                    alt={manga.title} 
                  />
                  <div className="score-badge">
                    <span>★</span> {manga.score ? manga.score.toFixed(1) : 'N/A'}
                  </div>
                  <div className="anime-card-overlay">
                    <h3 className="anime-card-title">{manga.title}</h3>
                    <div className="anime-card-meta">
                      <span>{manga.chapters ? `${manga.chapters} caps` : manga.type}</span>
                      <span>{manga.published?.prop?.from?.year || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <button className="btn btn-outline-light rounded-pill px-4 fw-bold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }} onClick={() => setPage(page - 1)} disabled={page === 1}>&larr; Anterior</button>
            <span className="fw-bold" style={{ color: 'var(--text-muted)' }}>Página {page} de {lastPage}</span>
            <button className="btn btn-outline-light rounded-pill px-4 fw-bold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }} onClick={() => setPage(page + 1)} disabled={page === lastPage}>Próximo &rarr;</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Mangas