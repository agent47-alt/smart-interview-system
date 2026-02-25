import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brandBox}>
          <div style={styles.logo}>🎯</div>
          <h1 style={styles.brandName}>InterviewAI</h1>
          <p style={styles.brandTagline}>
            Your personal AI interview coach. Practice anytime, anywhere.
          </p>
        </div>
        <div style={styles.statsRow}>
          {[
            { number: '18+', label: 'Questions' },
            { number: '3', label: 'Categories' },
            { number: 'AI', label: 'Powered' },
          ].map((s, i) => (
            <div key={i} style={styles.statBox}>
              <div style={styles.statNum}>{s.number}</div>
              <div style={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard} className="animate-fade">
          <h2 style={styles.formTitle}>Create account</h2>
          <p style={styles.formSubtitle}>Start practicing for free today</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Athul Krishna"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  leftPanel: {
    flex: 1, backgroundColor: '#1a1a2e',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '60px', color: 'white'
  },
  brandBox: { marginBottom: '50px' },
  logo: { fontSize: '48px', marginBottom: '15px' },
  brandName: {
    fontSize: '36px', fontWeight: '700',
    marginBottom: '10px', letterSpacing: '-0.5px'
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '16px', lineHeight: '1.6'
  },
  statsRow: { display: 'flex', gap: '20px' },
  statBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: '10px', padding: '20px', textAlign: 'center'
  },
  statNum: { fontSize: '28px', fontWeight: '700', color: '#6366f1' },
  statLbl: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' },
  rightPanel: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f5f6fa', padding: '40px'
  },
  formCard: {
    backgroundColor: 'white', padding: '50px',
    borderRadius: '16px', width: '100%', maxWidth: '420px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
  },
  formTitle: {
    fontSize: '26px', fontWeight: '700',
    color: '#1a1a2e', marginBottom: '6px'
  },
  formSubtitle: { color: '#888', fontSize: '14px', marginBottom: '30px' },
  inputGroup: { marginBottom: '18px' },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#444', marginBottom: '7px'
  },
  input: {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '13px',
    backgroundColor: '#1a1a2e', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px'
  },
  errorBox: {
    backgroundColor: '#fef2f2', color: '#ef4444',
    padding: '12px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '18px',
    border: '1px solid #fecaca'
  },
  switchText: {
    textAlign: 'center', marginTop: '22px',
    fontSize: '14px', color: '#888'
  },
  link: { color: '#6366f1', fontWeight: '600', textDecoration: 'none' }
};

export default Register;