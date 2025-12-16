import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ darkMode, toggleTheme }) {
  const navigate = useNavigate(); // O nosso "GPS"
  const [loadingRandom, setLoadingRandom] = useState(false);

  // Função auxiliar para fechar o menu hambúrguer no telemóvel
  const closeMenu = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  // Função para buscar anime aleatório
  const handleRandomAnime = () => {
    setLoadingRandom(true);
    fetch('https://api.jikan.moe/v4/random/anime')
      .then(res => res.json())
      .then(data => {
        const randomId = data.data.mal_id;
        setLoadingRandom(false);
        closeMenu(); // Fecha o menu
        navigate(`/detalhes/${randomId}`);
      })
      .catch(err => {
        console.error(err);
        setLoadingRandom(false);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-4 sticky-top py-3">
      <div className="container">
        
        {/* 1. LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <span style={{ fontSize: '1.5rem' }}>📺</span> 
          <span className="fw-bold tracking-wide">AniVerse</span>
        </Link>

        {/* 2. BOTÃO HAMBÚRGUER (Mobile) */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* 3. CONTEÚDO DO MENU */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* LADO ESQUERDO: Botão Aleatório + Navegação */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-lg-3">
            
            {/* Botão Surpreende-me */}
            <li className="nav-item mt-3 mt-lg-0">
              <button 
                className="btn btn-warning fw-bold d-flex align-items-center gap-2 shadow-sm text-nowrap"
                onClick={handleRandomAnime}
                disabled={loadingRandom}
                style={{ borderRadius: '50px', padding: '6px 20px', fontSize: '0.9rem' }}
              >
                {loadingRandom ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <>🎲 Surpreende-me</>
                )}
              </button>
            </li>

            {/* Link ANIMES */}
            <li className="nav-item mt-2 mt-lg-0">
              <Link to="/animes" className="nav-link text-white fw-bold link-hover" onClick={closeMenu}>
                Animes
              </Link>
            </li>

            {/* Link MANGAS */}
            <li className="nav-item">
              <Link to="/mangas" className="nav-link text-white fw-bold link-hover" onClick={closeMenu}>
                Mangas
              </Link>
            </li>

          </ul>

          {/* LADO DIREITO: Favoritos e Dark Mode */}
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            
            {/* Link Favoritos */}
            <Link 
              to="/favoritos" 
              className="nav-link text-white fw-bold d-flex align-items-center gap-2 link-hover"
              onClick={closeMenu}
            >
              ❤️ Meus Favoritos
            </Link>

            {/* Separador (Só aparece no PC) */}
            <div className="d-none d-lg-block mx-2" style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

            {/* Botão Dark Mode */}
            <button 
  className="theme-toggle-btn" 
  onClick={toggleTheme}
  title="Mudar Tema"
>
  {darkMode ? '🌙' : '☀️'}
</button>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;