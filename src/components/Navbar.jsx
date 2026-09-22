import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const closeMenu = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: 'rgba(0,0,0,0.8) !important', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container-fluid px-4 px-md-5">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white" to="/" onClick={closeMenu}>
          <span className="fw-800" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>
            AniVerse
          </span>
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
          
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-lg-4 fw-bold">
            <li className="nav-item">
              <Link to="/" className={`nav-link link-hover ${isActive('/')}`} onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/animes" className={`nav-link link-hover ${isActive('/animes')}`} onClick={closeMenu}>Animes</Link>
            </li>
            <li className="nav-item">
              <Link to="/temporadas" className={`nav-link link-hover ${isActive('/temporadas')}`} onClick={closeMenu}>Temporadas</Link>
            </li>
            <li className="nav-item">
              <Link to="/mangas" className={`nav-link link-hover ${isActive('/mangas')}`} onClick={closeMenu}>Mangas</Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            {user ? (
              <div className="dropdown">
                <button className="btn text-white dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', backgroundColor: '#f05039', fontWeight: 'bold', color: '#fff' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-bold text-white">{user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ backgroundColor: 'var(--bg-panel)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
                  <li><Link className="dropdown-item text-white" to="/favoritos" onClick={closeMenu}>A Minha Lista</Link></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></li>
                  <li><button className="dropdown-item text-danger" onClick={() => { logout(); closeMenu(); }}>Terminar Sessão</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 w-100 align-items-center">
                <Link to="/login" className="text-white text-decoration-none fw-bold px-3 transition-all" onClick={closeMenu}>Sign in</Link>
                <Link to="/register" className="btn fw-bold px-4 transition-all" style={{ borderRadius: '12px', backgroundColor: '#fff', color: '#000', border: 'none' }} onClick={closeMenu}>Create Account</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;