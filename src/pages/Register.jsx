import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div className="bento-box p-5 w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-800 text-white" style={{ fontFamily: 'var(--font-marck-script), cursive', fontSize: '2.5rem' }}>Sorai</h2>
          <p className="text-muted small">Create your free account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">Username</label>
            <input 
              type="text" 
              className="form-control bg-transparent text-white border-secondary" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small">
            Already have an account? <Link to="/login" className="text-primary text-decoration-none">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
