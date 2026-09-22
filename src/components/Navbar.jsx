import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingRandom, setLoadingRandom] = useState(false);

  const closeMenu = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  const handleRandomAnime = () => {
    setLoadingRandom(true);
    fetch('https://api.jikan.moe/v4/random/anime')
      .then(res => res.json())
      .then(data => {
        const randomId = data.data.mal_id;
        setLoadingRandom(false);
        closeMenu();
        navigate(`/detalhes/${randomId}`);
      })
      .catch(err => {
        console.error(err);
        setLoadingRandom(false);
      });
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white" to="/" onClick={closeMenu}>
          <span style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>▶</span> 
          <span>AniVerse</span>
        </Link>

        {/* MOBILE TOGGLE */}
        <button 
          className="navbar-toggler border-0 shadow-none text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-lg-4">
            
            <li className="nav-item">
              <Link to="/animes" className={`nav-link link-hover ${isActive('/animes')}`} onClick={closeMenu}>
                Animes
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/mangas" className={`nav-link link-hover ${isActive('/mangas')}`} onClick={closeMenu}>
                Mangas
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/favoritos" className={`nav-link link-hover fw-bold ${isActive('/favoritos')}`} onClick={closeMenu} style={{ color: 'var(--accent-color)' }}>
                Minha Lista
              </Link>
            </li>

            <li className="nav-item mt-3 mt-lg-0 ms-lg-2">
              <button 
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleRandomAnime}
                disabled={loadingRandom}
                style={{ borderRadius: '50px', padding: '8px 24px' }}
              >
                {loadingRandom ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <>Surpreende-me 🎲</>
                )}
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;