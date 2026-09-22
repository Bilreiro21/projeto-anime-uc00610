import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor preenche todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As passwords não coincidem.');
      return;
    }

    const success = register(username, email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Este email já está registado.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="auth-modal p-5 w-100" style={{ maxWidth: '420px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h2 className="fw-800 text-white m-0 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
            <div className="d-flex align-items-center justify-content-center rounded" style={{ backgroundColor: 'rgba(240, 80, 57, 0.1)', width: '32px', height: '32px' }}>
              <i className="bi bi-person-plus" style={{ color: '#f05039' }}></i>
            </div>
            CREATE ACCOUNT
          </h2>
          <Link to="/" className="text-muted hover-neon"><i className="bi bi-x-lg"></i></Link>
        </div>
        
        <p className="text-muted mb-4 pb-2" style={{ fontSize: '0.9rem' }}>Join the AniVerse community</p>

        {error && <div className="alert alert-danger p-2 small border-0" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          <div>
            <label className="form-label text-white fw-bold mb-2 small">Username</label>
            <div className="sorai-input-wrapper">
              <i className="bi bi-person input-icon"></i>
              <input 
                type="text" 
                className="sorai-input" 
                placeholder="my_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div>
            <label className="form-label text-white fw-bold mb-2 small">Confirm password</label>
            <div className="sorai-input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                className="sorai-input" 
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i 
                className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} action-icon`} 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
          </div>
          
          <button type="submit" className="btn-coral mt-2 d-flex justify-content-center align-items-center gap-2">
            <i className="bi bi-person-plus"></i> Create Account
          </button>
        </form>

        <div className="text-center mt-4 pt-2">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="text-decoration-none small fw-bold" style={{ color: '#f05039' }}>Sign in</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
