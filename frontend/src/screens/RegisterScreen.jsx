// frontend/src/screens/RegisterScreen.jsx

import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setCredentials } = useContext(AuthContext);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      // Call our new registration route!
      const { data } = await axios.post('/api/users', { name, email, password }, config);
      
      setCredentials(data);
      navigate(redirect);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="container" style={styles.screenContainer}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join NEXA for a seamless shopping experience.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submitHandler} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              style={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              style={styles.input} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="premium-btn" style={styles.submitBtn}>
            Register
          </button>
        </form>

        <div style={styles.loginPrompt}>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenContainer: { display: 'flex', justifyContent: 'center', paddingTop: '60px', paddingBottom: '100px' },
  formWrapper: { width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '50px 40px', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' },
  title: { fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '10px', textAlign: 'center', color: 'var(--text-dark)' },
  subtitle: { fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '30px' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '4px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '2px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' },
  submitBtn: { marginTop: '10px', backgroundColor: '#222', color: '#fff', border: 'none', padding: '16px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' },
  loginPrompt: { marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' },
  link: { color: 'var(--text-dark)', fontWeight: 'bold', textDecoration: 'underline' }
};

export default RegisterScreen;