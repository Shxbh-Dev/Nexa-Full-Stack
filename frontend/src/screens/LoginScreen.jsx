// frontend/src/screens/LoginScreen.jsx

import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setCredentials } = useContext(AuthContext);

  // If the user was trying to checkout, redirect them back there after login
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // If already logged in, push them away from the login screen
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Send login request to our new Node.js backend route
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      
      // Save user to global state
      setCredentials(data);
      navigate(redirect);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Welcome back to NEXA. Please enter your details.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submitHandler} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              style={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              style={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="premium-btn" style={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div style={styles.registerPrompt}>
          New customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={styles.link}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { display: 'flex', justifyContent: 'center', paddingTop: '80px', paddingBottom: '120px' },
  formWrapper: { width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '50px 40px', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' },
  title: { fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '10px', textAlign: 'center', color: 'var(--text-dark)' },
  subtitle: { fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '30px' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '2px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' },
  submitBtn: { marginTop: '10px', backgroundColor: '#222', color: '#fff', border: 'none', padding: '16px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' },
  registerPrompt: { marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' },
  link: { color: 'var(--text-dark)', fontWeight: 'bold', textDecoration: 'underline' }
};

export default LoginScreen;