import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome, {userName}! 👋</h2>
        <p>Your dashboard is being built. Check back soon!</p>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white', padding: '40px',
    borderRadius: '12px', textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  button: {
    marginTop: '20px', padding: '10px 30px',
    backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '14px', cursor: 'pointer'
  }
};

export default Dashboard;