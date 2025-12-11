import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // <--- 1. IMPORTAR A BIBLIOTECA

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('meus-favoritos')) || [];
    setFavoritos(guardados);
  }, []);

  const removerFavorito = (anime) => { // <--- 2. RECEBER O ANIME INTEIRO, NÃO SÓ O ID
    const novaLista = favoritos.filter(item => item.mal_id !== anime.mal_id);
    setFavoritos(novaLista);
    localStorage.setItem('meus-favoritos', JSON.stringify(novaLista));

    // 3. DISPARAR A NOTIFICAÇÃO DE ERRO
    toast.error(`Removido: ${anime.title}`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">❤️ Meus Favoritos</h1>
      {favoritos.length === 0 ? (
        <div className="text-center mt-5">
          <h3>Ainda não tens favoritos.</h3>
          <Link to="/" className="btn btn-primary mt-3">Voltar e adicionar</Link>
        </div>
      ) : (
        <div className="row">
          {favoritos.map((anime) => (
            <div key={anime.mal_id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img 
                  src={anime.images.jpg.image_url} 
                  className="card-img-top" 
                  alt={anime.title} 
                  style={{ height: '300px', objectFit: 'cover' }} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{anime.title}</h5>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/detalhes/${anime.mal_id}`} className="btn btn-primary flex-grow-1">
                      Ver
                    </Link>
                    
                    {/* 4. ATUALIZAR O CLICK PARA PASSAR O ANIME INTEIRO */}
                    <button 
                      className="btn btn-danger" 
                      onClick={() => removerFavorito(anime)}
                    >
                      Remover ❌
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;