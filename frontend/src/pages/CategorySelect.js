import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';

function CategorySelect() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('user_name');

  useEffect(() => {
    getCategories()
      .then(res => {
        setCategories(res.data.categories);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (category) => {
    navigate(`/interview/${category}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const categoryColors = {
  Python: '#3b82f6',
  SQL: '#10b981',
  HR: '#f59e0b',
  'Data Structures': '#8b5cf6',
  'System Design': '#ef4444',
};

const categoryIcons = {
  Python: '🐍',
  SQL: '🗄️',
  HR: '🤝',
  'Data Structures': '🌳',
  'System Design': '⚙️',
};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Smart Interview System</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>👋 {userName}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>Select Interview Category</h3>
        <p style={styles.subtitle}>Choose a topic to start your mock interview</p>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div style={styles.grid}>
            {categories.map((category) => (
              <div
                key={category}
                style={{
                  ...styles.card,
                  borderTop: `4px solid ${categoryColors[category] || '#6366f1'}`
                }}
                onClick={() => handleSelect(category)}
              >
                <div style={styles.icon}>
                  {categoryIcons[category] || '📝'}
                </div>
                <h3 style={styles.categoryName}>{category}</h3>
                <p style={styles.categoryDesc}>
                  Test your {category} knowledge
                </p>
                <button
                  style={{
                    ...styles.startBtn,
                    backgroundColor: categoryColors[category] || '#6366f1'
                  }}
                >
                  Start Interview →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  header: {
    backgroundColor: 'white', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  headerTitle: { margin: 0, color: '#1a1a2e', fontSize: '20px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  welcomeText: { color: '#555', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '13px'
  },
  content: { maxWidth: '800px', margin: '50px auto', padding: '0 20px' },
  title: { textAlign: 'center', color: '#1a1a2e', fontSize: '28px', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '40px' },
  grid: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '30px', width: '200px', textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    cursor: 'pointer', transition: 'transform 0.2s',
  },
  icon: { fontSize: '40px', marginBottom: '15px' },
  categoryName: { color: '#1a1a2e', marginBottom: '8px' },
  categoryDesc: { color: '#888', fontSize: '13px', marginBottom: '20px' },
  startBtn: {
    padding: '10px 20px', color: 'white',
    border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', width: '100%'
  }
};

export default CategorySelect;