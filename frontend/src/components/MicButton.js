import React from 'react';

function MicButton({ isListening, supported, onStart, onStop }) {
  if (!supported) {
    return (
      <p style={styles.notSupported}>
        🚫 Voice not supported. Use Chrome browser.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.micBtn,
          backgroundColor: isListening ? '#ef4444' : '#10b981',
          transform: isListening ? 'scale(1.1)' : 'scale(1)',
        }}
        onClick={isListening ? onStop : onStart}
      >
        {isListening ? '⏹ Stop' : '🎙️ Speak'}
      </button>
      {isListening && (
        <div style={styles.listeningBox}>
          <span style={styles.dot} />
          <span style={styles.dot} />
          <span style={styles.dot} />
          <p style={styles.listeningText}>Listening... Speak now</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginBottom: '15px' },
  micBtn: {
    padding: '12px 30px', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer',
    transition: 'all 0.2s', width: '100%'
  },
  listeningBox: {
    marginTop: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '6px'
  },
  dot: {
    width: '8px', height: '8px',
    backgroundColor: '#ef4444', borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1s infinite'
  },
  listeningText: { color: '#ef4444', margin: 0, fontSize: '14px' },
  notSupported: { color: '#888', fontSize: '13px', textAlign: 'center' }
};

export default MicButton;