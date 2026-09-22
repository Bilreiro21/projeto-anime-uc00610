import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
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
        navigate(`/detalhes/anime/${randomId}`);
      })
      .catch(err => {
        console.error(err);
        setLoadingRandom(false);
      });
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid px-4 px-md-5">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white" to="/" onClick={closeMenu}>
          <span style={{ fontFamily: 'var(--font-marck-script), cursive', fontSize: '2rem' }}>Sorai</span>
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
          
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-lg-4">
            
            <li className="nav-item">
              <Link to="/" className={`nav-link link-hover ${isActive('/')}`} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/animes" className={`nav-link link-hover ${isActive('/animes')}`} onClick={closeMenu}>
                Animes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/temporadas" className={`nav-link link-hover ${isActive('/temporadas')}`} onClick={closeMenu}>
                Temporadas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/mangas" className={`nav-link link-hover ${isActive('/mangas')}`} onClick={closeMenu}>
                Mangas
              </Link>
            </li>

          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            <button 
              className="btn btn-outline-light d-flex align-items-center gap-2"
              onClick={handleRandomAnime}
              disabled={loadingRandom}
              style={{ borderRadius: '12px', borderColor: 'var(--border-color)', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              {loadingRandom ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                <><i className="bi bi-dice-5"></i> Random</>
              )}
            </button>

            <div className="vr d-none d-lg-block mx-2" style={{ backgroundColor: 'var(--border-color)' }}></div>

            {user ? (
              <div className="dropdown">
                <button className="btn text-white dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', backgroundColor: 'var(--accent-color)', fontWeight: 'bold' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-bold">{user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                  <li><Link className="dropdown-item text-white" to="/favoritos" onClick={closeMenu}>Minha Lista</Link></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} /></li>
                  <li><button className="dropdown-item text-danger" onClick={() => { logout(); closeMenu(); }}>Sign out</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                <Link to="/login" className="btn text-white fw-bold px-4 transition-all" style={{ border: '1px solid var(--glass-bg)', borderRadius: '12px' }} onClick={closeMenu}>Sign in</Link>
                <Link to="/register" className="btn btn-light text-dark fw-bold px-4 transition-all" style={{ borderRadius: '12px' }} onClick={closeMenu}>Create free account</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;