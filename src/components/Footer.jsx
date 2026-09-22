import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-panel)', borderTop: '1px solid rgba(0, 242, 254, 0.2)' }} className="text-muted mt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-12 col-md-4">
            <Link to="/" className="text-white text-decoration-none d-inline-block mb-3">
              <span className="fw-800" style={{ fontSize: '2rem', letterSpacing: '-1px', background: 'linear-gradient(to right, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AniVerse
              </span>
            </Link>
            <p className="small text-muted mb-4" style={{ maxWidth: '260px' }}>
              Your personal space to track, organize, and discover anime. Keep control of everything you watch.
            </p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center justify-content-center text-muted transition-colors rounded" style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <i className="bi bi-github hover-neon"></i>
            </a>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Browse</h6>
            <ul className="list-unstyled space-y-2 mb-0 small">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none transition-colors hover-neon">Home</Link></li>
              <li className="mb-2"><Link to="/animes" className="text-muted text-decoration-none transition-colors hover-neon">Most Popular</Link></li>
              <li className="mb-2"><Link to="/temporadas" className="text-muted text-decoration-none transition-colors hover-neon">Seasonal Anime</Link></li>
              <li className="mb-2"><Link to="/mangas" className="text-muted text-decoration-none transition-colors hover-neon">Mangas</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Genres</h6>
            <ul className="list-unstyled space-y-2 mb-0 small">
              <li className="mb-2"><Link to="/animes?genre=1" className="text-muted text-decoration-none transition-colors hover-neon">Action</Link></li>
              <li className="mb-2"><Link to="/animes?genre=22" className="text-muted text-decoration-none transition-colors hover-neon">Romance</Link></li>
              <li className="mb-2"><Link to="/animes?genre=27" className="text-muted text-decoration-none transition-colors hover-neon">Shounen</Link></li>
              <li className="mb-2"><Link to="/animes?genre=24" className="text-muted text-decoration-none transition-colors hover-neon">Sci-Fi</Link></li>
              <li className="mb-2"><Link to="/animes?genre=10" className="text-muted text-decoration-none transition-colors hover-neon">Fantasy</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Season 2026</h6>
            <ul className="list-unstyled space-y-2 mb-0 small">
              <li className="mb-2"><Link to="/temporadas?season=winter" className="text-muted text-decoration-none transition-colors hover-neon">Winter</Link></li>
              <li className="mb-2"><Link to="/temporadas?season=spring" className="text-muted text-decoration-none transition-colors hover-neon">Spring</Link></li>
              <li className="mb-2"><Link to="/temporadas?season=summer" className="text-muted text-decoration-none transition-colors hover-neon">Summer</Link></li>
              <li className="mb-2"><Link to="/temporadas?season=fall" className="text-muted text-decoration-none transition-colors hover-neon">Fall</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Formats</h6>
            <ul className="list-unstyled space-y-2 mb-0 small">
              <li className="mb-2"><Link to="/animes?type=tv" className="text-muted text-decoration-none transition-colors hover-neon">TV</Link></li>
              <li className="mb-2"><Link to="/animes?type=ova" className="text-muted text-decoration-none transition-colors hover-neon">OVAs</Link></li>
              <li className="mb-2"><Link to="/animes?type=special" className="text-muted text-decoration-none transition-colors hover-neon">Specials</Link></li>
              <li className="mb-2"><Link to="/animes?type=movie" className="text-muted text-decoration-none transition-colors hover-neon">Movies</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small" style={{ fontSize: '0.75rem' }}>
          <span>Powered by <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-underline hover-neon">Jikan API</a></span>
          <span>© 2026 AniVerse. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-underline hover-neon">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-underline hover-neon">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;