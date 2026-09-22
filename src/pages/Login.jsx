import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div className="bento-box p-5 w-100 glass-panel border-neon" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-800 text-white" style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AniVerse</h2>
          <p className="text-muted small">Acede à tua conta</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">Email</label>
            <input 
              type="email" 
              className="form-control bg-transparent text-white border-secondary" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control bg-transparent text-white border-secondary" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold rounded-xl mb-3"
            disabled={isSubmitting}
            style={{ borderRadius: '12px' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small">
            Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
