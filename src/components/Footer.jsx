import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-5 pt-5 pb-4" style={{ backgroundColor: '#0a0a0c', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4 mb-4 mb-md-0">
            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-white">
              <span style={{ color: 'var(--accent-color)' }}>▶</span> AniVerse
            </h4>
            <p className="text-muted small" style={{ lineHeight: '1.8' }}>
              O teu portal definitivo para explorar, descobrir e organizar as tuas séries de anime e manga favoritas. Acompanha os lançamentos da temporada e cria a tua lista perfeita.
            </p>
          </div>
          <div className="col-md-2 col-6 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-3">Navegação</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none hover-accent">Home</Link></li>
              <li className="mb-2"><Link to="/animes" className="text-muted text-decoration-none hover-accent">Animes</Link></li>
              <li className="mb-2"><Link to="/mangas" className="text-muted text-decoration-none hover-accent">Mangas</Link></li>
              <li className="mb-2"><Link to="/favoritos" className="text-muted text-decoration-none hover-accent">Minha Lista</Link></li>
            </ul>
          </div>
          <div className="col-md-2 col-6 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-accent">Termos de Serviço</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-accent">Privacidade</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-accent">Contactos</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-accent">DMCA</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white fw-bold mb-3">Redes Sociais</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted fs-5 hover-accent"><i className="bi bi-discord"></i></a>
              <a href="#" className="text-muted fs-5 hover-accent"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-muted fs-5 hover-accent"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted fs-5 hover-accent"><i className="bi bi-github"></i></a>
            </div>
          </div>
        </div>
        <div className="row border-top pt-4 mt-4" style={{ borderColor: 'var(--border-color) !important' }}>
          <div className="col-12 text-center">
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} AniVerse. Desenvolvido por Diogo Bilreiro para a UC00610.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .hover-accent:hover { color: var(--accent-color) !important; }
      `}</style>
    </footer>
  );
}

export default Footer;