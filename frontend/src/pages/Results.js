import React from 'react';
import { useNavigate } from 'react-router-dom';

function Results() {
  const navigate = useNavigate();
  const sessionResults = JSON.parse(localStorage.getItem('sessionResults') || '[]');
  const category = localStorage.getItem('sessionCategory');

  const totalScore = sessionResults.reduce((sum, r) => sum + r.score, 0);
  const averageScore = sessionResults.length > 0
    ? (totalScore / sessionResults.length).toFixed(1)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  const getOverallMessage = (avg) => {
    if (avg >= 8) return "Outstanding performance! 🏆";
    if (avg >= 6) return "Good job! Keep practicing! 👍";
    if (avg >= 4) return "Decent effort. Review weak areas! 📚";
    return "Needs improvement. Study more! 💪";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Interview Results</h2>
        <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
          🏠 Home
        </button>
      </div>

      <div style={styles.content}>
        {/* Overall Score Card */}
        <div style={styles.overallCard}>
          <h3 style={styles.categoryLabel}>{category} Interview</h3>
          <div style={{
            ...styles.overallScore,
            color: getScoreColor(parseFloat(averageScore))
          }}>
            {averageScore}
          </div>
          <p style={styles.overallMax}>Average Score out of 10</p>
          <p style={styles.overallMessage}>
            {getOverallMessage(parseFloat(averageScore))}
          </p>
          <p style={styles.questionsCount}>
            {sessionResults.length} questions answered
          </p>
        </div>

        {/* Individual Results */}
        <h3 style={styles.breakdownTitle}>Question Breakdown</h3>
        {sessionResults.map((result, index) => (
          <div key={index} style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <span style={styles.qNumber}>Q{index + 1}</span>
              <span style={{
                ...styles.resultScore,
                color: getScoreColor(result.score)
              }}>
                {result.score}/10
              </span>
            </div>
            <p style={styles.resultQuestion}>{result.question}</p>
            <p style={styles.resultFeedback}>💬 {result.feedback}</p>
          </div>
        ))}

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button
            style={styles.retryBtn}
            onClick={() => navigate(`/interview/${category}`)}
          >
            🔄 Try Again
          </button>
          <button
            style={styles.newBtn}
            onClick={() => navigate('/categories')}
          >
            📝 New Category
          </button>
        </div>
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
  headerTitle: { margin: 0, color: '#1a1a2e' },
  homeBtn: {
    padding: '8px 16px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 20px' },
  overallCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '30px'
  },
  categoryLabel: { color: '#888', marginBottom: '10px' },
  overallScore: { fontSize: '72px', fontWeight: 'bold', lineHeight: 1 },
  overallMax: { color: '#888', marginBottom: '10px' },
  overallMessage: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' },
  questionsCount: { color: '#888', fontSize: '14px' },
  breakdownTitle: { color: '#1a1a2e', marginBottom: '15px' },
  resultCard: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '20px', marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  resultHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '10px'
  },
  qNumber: {
    backgroundColor: '#f3f4f6', padding: '4px 12px',
    borderRadius: '10px', fontWeight: 'bold', color: '#555'
  },
  resultScore: { fontSize: '20px', fontWeight: 'bold' },
  resultQuestion: { color: '#1a1a2e', marginBottom: '8px', fontWeight: '500' },
  resultFeedback: { color: '#666', fontSize: '14px', margin: 0 },
  actions: { display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '40px' },
  retryBtn: {
    flex: 1, padding: '14px', backgroundColor: '#f3f4f6',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '15px', color: '#333'
  },
  newBtn: {
    flex: 1, padding: '14px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px'
  }
};

export default Results;