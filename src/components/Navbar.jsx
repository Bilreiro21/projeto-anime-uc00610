import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [loadingRandom, setLoadingRandom] = useState(false);

  const handleRandomAnime = () => {
    setLoadingRandom(true);
    fetch('https://api.jikan.moe/v4/random/anime')
      .then(res => res.json())
      .then(data => {
        const randomId = data.data.mal_id;
        setLoadingRandom(false);
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
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
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: '1.5rem' }}>📺</span> 
          <span className="fw-bold tracking-wide">Jikan Animes</span>
        </Link>

        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-start align-items-lg-center">
            <li className="nav-item mt-3 mt-lg-0">
              <button 
                className="btn btn-warning fw-bold d-flex align-items-center gap-2 shadow-sm text-nowrap"
                onClick={handleRandomAnime}
                disabled={loadingRandom}
                style={{ borderRadius: '50px', padding: '8px 20px', fontSize: '0.9rem' }}
              >
                {loadingRandom ? <div className="spinner-border spinner-border-sm" role="status"></div> : <>🎲 Surpreende-me</>}
              </button>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            <Link 
              to="/favoritos" 
              className="nav-link text-white fw-bold d-flex align-items-center gap-2 link-hover"
              onClick={() => {
                 const nav = document.getElementById('navbarNav');
                 if(nav.classList.contains('show')) nav.classList.remove('show');
              }}
            >
              ❤️ Meus Favoritos
            </Link>

            <div className="d-none d-lg-block mx-2" style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

            <button 
              className={`btn ${darkMode ? 'btn-dark border-secondary' : 'btn-light'} btn-sm d-flex align-items-center gap-2`}
              onClick={() => {
                toggleTheme();
                const nav = document.getElementById('navbarNav');
                if(nav.classList.contains('show')) nav.classList.remove('show');
              }}
              style={{ borderRadius: '20px', padding: '6px 15px', minWidth: '140px' }}
            >
              <span>{darkMode ? '🌙' : '☀️'}</span>
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;