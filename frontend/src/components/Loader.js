import React from 'react';

function Loader({ message }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.text}>{message || 'Loading...'}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#f0f2f5'
  },
  spinner: {
    width: '45px', height: '45px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  text: { color: '#888', marginTop: '15px' }
};

export default Loader;