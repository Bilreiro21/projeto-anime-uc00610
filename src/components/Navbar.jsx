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
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid px-4 px-md-5">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white" to="/" onClick={closeMenu}>
          <span className="fw-800" style={{ fontSize: '1.8rem', letterSpacing: '-1px', background: 'linear-gradient(to right, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
            {user ? (
              <div className="dropdown">
                <button className="btn text-white dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', background: 'linear-gradient(45deg, #00f2fe, #4facfe)', fontWeight: 'bold', color: '#000' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-bold text-white">{user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ backgroundColor: 'var(--bg-panel)', backdropFilter: 'blur(10px)' }}>
                  <li><Link className="dropdown-item text-white hover-neon" to="/favoritos" onClick={closeMenu}>Minha Lista</Link></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></li>
                  <li><button className="dropdown-item text-danger hover-neon" onClick={() => { logout(); closeMenu(); }}>Terminar Sessão</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                <Link to="/login" className="btn fw-bold px-4 transition-all hover-glow" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn text-dark fw-bold px-4 transition-all btn-neon" style={{ borderRadius: '12px', background: 'linear-gradient(to right, #00f2fe, #4facfe)', border: 'none' }} onClick={closeMenu}>Criar Conta</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;