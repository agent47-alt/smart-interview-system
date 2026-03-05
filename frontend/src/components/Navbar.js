import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapse) onCollapse(next);
  };

  const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/categories', icon: '📚', label: 'Practice' },
  { path: '/mock', icon: '🎯', label: 'Mock Interview' },
  { path: '/daily', icon: '🌟', label: 'Daily Challenge' },
  { path: '/progress', icon: '📊', label: 'Progress' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];
  return (
    <div style={{
      ...styles.sidebar,
      width: collapsed ? '70px' : '220px'
    }}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🎯</span>
        {!collapsed && <span style={styles.logoText}>InterviewAI</span>}
      </div>

      <button style={styles.collapseBtn} onClick={handleCollapse}>
        {collapsed ? '→' : '←'}
      </button>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.path}
            style={{
              ...styles.navItem,
              backgroundColor: location.pathname === item.path
                ? '#4f46e5' : 'transparent',
              color: location.pathname === item.path
                ? 'white' : '#94a3b8',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div style={styles.userSection}>
        <div style={styles.userAvatar}>
          {userName ? userName[0].toUpperCase() : '?'}
        </div>
        {!collapsed && (
          <div style={styles.userInfo}>
            <p style={styles.userName}>{userName}</p>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.3s ease',
    zIndex: 100,
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
  },
  logo: {
    display: 'flex', alignItems: 'center',
    gap: '10px', padding: '0 20px', marginBottom: '10px'
  },
  logoIcon: { fontSize: '24px' },
  logoText: {
    color: 'white', fontWeight: '700',
    fontSize: '18px', whiteSpace: 'nowrap'
  },
  collapseBtn: {
    backgroundColor: 'transparent', border: 'none',
    color: '#94a3b8', cursor: 'pointer',
    padding: '8px 20px', textAlign: 'right',
    fontSize: '14px', marginBottom: '20px'
  },
  nav: {
    flex: 1, display: 'flex',
    flexDirection: 'column', gap: '4px', padding: '0 10px'
  },
  navItem: {
    display: 'flex', alignItems: 'center',
    gap: '12px', padding: '12px 14px',
    borderRadius: '10px', border: 'none',
    cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', transition: 'all 0.2s',
    width: '100%', fontFamily: 'inherit'
  },
  navIcon: { fontSize: '18px' },
  navLabel: { whiteSpace: 'nowrap' },
  userSection: {
    display: 'flex', alignItems: 'center',
    gap: '10px', padding: '15px',
    borderTop: '1px solid #1e293b', marginTop: 'auto'
  },
  userAvatar: {
    width: '36px', height: '36px',
    borderRadius: '50%', backgroundColor: '#4f46e5',
    color: 'white', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px', flexShrink: 0
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: {
    margin: '0 0 4px 0', color: 'white',
    fontSize: '13px', fontWeight: '600',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  },
  logoutBtn: {
    backgroundColor: 'transparent', border: 'none',
    color: '#ef4444', cursor: 'pointer',
    fontSize: '12px', padding: 0, fontFamily: 'inherit'
  }
};

export default Navbar;