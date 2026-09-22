import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor preenche todos os campos.');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciais incorretas. Tenta novamente.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '60px' }}>
      <div className="auth-modal p-5 w-100" style={{ maxWidth: '420px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h2 className="fw-800 text-white m-0 d-flex align-items-center gap-2" style={{ fontSize: '1.5rem' }}>
            <div className="d-flex align-items-center justify-content-center rounded" style={{ backgroundColor: 'rgba(240, 80, 57, 0.1)', width: '32px', height: '32px' }}>
              <i className="bi bi-box-arrow-in-right" style={{ color: '#f05039' }}></i>
            </div>
            SIGN IN
          </h2>
          <Link to="/" className="text-muted hover-neon"><i className="bi bi-x-lg"></i></Link>
        </div>
        
        <p className="text-muted mb-4 pb-2" style={{ fontSize: '0.9rem' }}>Welcome back to AniVerse</p>

        {error && <div className="alert alert-danger p-2 small border-0" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          <div>
            <label className="form-label text-white fw-bold mb-2 small">Email</label>
            <div className="sorai-input-wrapper">
              <i className="bi bi-envelope input-icon"></i>
              <input 
                type="email" 
                className="sorai-input" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="form-label text-white fw-bold mb-2 small">Password</label>
            <div className="sorai-input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="sorai-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i 
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} action-icon`} 
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>
          
          <button type="submit" className="btn-coral mt-2 d-flex justify-content-center align-items-center gap-2">
            <i className="bi bi-box-arrow-in-right"></i> Sign In
          </button>
        </form>

        <div className="text-center mt-4 pt-2">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none small fw-bold" style={{ color: '#f05039' }}>Sign up free</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
