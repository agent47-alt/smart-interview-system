import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyChallenge, submitAnswer } from '../services/api';
import useVoice from '../components/useVoice';
import MicButton from '../components/MicButton';

function DailyChallenge() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const userId = localStorage.getItem('user_id');
  const todayKey = `daily_${new Date().toISOString().split('T')[0]}`;

  const { isListening, supported, startListening, stopListening } = useVoice(
    (transcript) => {
      setAnswer(prev => prev ? prev + ' ' + transcript : transcript);
    }
  );

  useEffect(() => {
    const done = localStorage.getItem(todayKey);
    if (done) {
      setAlreadyDone(true);
      setResult(JSON.parse(done));
      setLoading(false);
      return;
    }
    getDailyChallenge()
      .then(res => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [todayKey]);

  useEffect(() => {
    if (!timerActive || result) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, result]);

  const submitAndScore = async () => {
    setSubmitting(true);
    try {
      const response = await submitAnswer({
        question_id: question.id,
        user_answer: answer || "No answer provided",
        user_id: parseInt(userId)
      });
      const resultData = {
        score: response.data.score,
        feedback: response.data.feedback,
        expected_answer: response.data.expected_answer,
        date: new Date().toISOString().split('T')[0]
      };
      setResult(resultData);
      localStorage.setItem(todayKey, JSON.stringify(resultData));
    } catch (err) {
      console.error(err);
      alert('Error submitting. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please write or speak an answer!');
      return;
    }
    setTimerActive(false);
    await submitAndScore();
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  const timerColor = timeLeft > 60 ? '#10b981'
    : timeLeft > 30 ? '#f59e0b' : '#ef4444';

  const categoryColors = {
    Python: '#3b82f6', SQL: '#10b981', HR: '#f59e0b',
    'Data Structures': '#8b5cf6', 'System Design': '#ef4444',
    JavaScript: '#f97316',
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading today's challenge...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h3 style={styles.headerTitle}>🌟 Daily Challenge</h3>
        <span style={styles.dateTag}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div style={styles.content}>

        {/* Already completed today */}
        {alreadyDone && result ? (
          <div style={styles.card}>
            <div style={styles.doneHeader}>
              <span style={styles.doneIcon}>✅</span>
              <h2 style={styles.doneTitle}>You completed today's challenge!</h2>
              <p style={styles.doneSubtitle}>Come back tomorrow for a new one</p>
            </div>
            <div style={styles.scoreContainer}>
              <div style={{
                ...styles.scoreCircle,
                borderColor: getScoreColor(result.score)
              }}>
                <span style={{ ...styles.scoreNumber, color: getScoreColor(result.score) }}>
                  {result.score}
                </span>
                <span style={styles.scoreMax}>/10</span>
              </div>
            </div>
            <div style={styles.feedbackBox}>
              <h4 style={styles.feedbackTitle}>💬 Your Feedback</h4>
              <p style={styles.feedbackText}>{result.feedback}</p>
            </div>
            <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>

        ) : !result ? (
          /* Challenge Question */
          <div style={styles.card}>
            <div style={styles.dailyBanner}>
              <span style={styles.bannerIcon}>🌟</span>
              <div>
                <p style={styles.bannerTitle}>Daily Challenge</p>
                <p style={styles.bannerSubtitle}>One question per day — make it count!</p>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <span style={{
                backgroundColor: categoryColors[question?.category] || '#6366f1',
                color: 'white', padding: '4px 14px',
                borderRadius: '20px', fontSize: '12px', fontWeight: '600'
              }}>
                {question?.category}
              </span>
              <span style={styles.diffBadge}>{question?.difficulty}</span>
            </div>

            <h2 style={styles.questionText}>{question?.question_text}</h2>

            {timerActive && (
              <div style={styles.timerSection}>
                <div style={styles.timerRow}>
                  <span style={styles.timerLabel}>⏱️ Time Left</span>
                  <span style={{ ...styles.timerNumber, color: timerColor }}>
                    {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
                <div style={styles.timerBar}>
                  <div style={{
                    ...styles.timerFill,
                    width: `${(timeLeft / 120) * 100}%`,
                    backgroundColor: timerColor
                  }} />
                </div>
              </div>
            )}

            {!timerActive ? (
              <button style={styles.startBtn} onClick={() => setTimerActive(true)}>
                ▶ Start Challenge
              </button>
            ) : (
              <>
                <div style={styles.voiceSection}>
                  <p style={styles.voiceLabel}>🎙️ Speak or type your answer:</p>
                  <MicButton
                    isListening={isListening}
                    supported={supported}
                    onStart={startListening}
                    onStop={stopListening}
                  />
                </div>
                <textarea
                  style={styles.textarea}
                  placeholder="Your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                />
                <button
                  style={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? '⏳ Scoring...' : 'Submit Answer ✓'}
                </button>
              </>
            )}
          </div>

        ) : (
          /* Result */
          <div style={styles.card}>
            <h2 style={styles.questionText}>{question?.question_text}</h2>
            <div style={styles.scoreContainer}>
              <div style={{
                ...styles.scoreCircle,
                borderColor: getScoreColor(result.score)
              }}>
                <span style={{ ...styles.scoreNumber, color: getScoreColor(result.score) }}>
                  {result.score}
                </span>
                <span style={styles.scoreMax}>/10</span>
              </div>
            </div>
            <div style={styles.feedbackBox}>
              <h4 style={styles.feedbackTitle}>💬 Feedback</h4>
              <p style={styles.feedbackText}>{result.feedback}</p>
            </div>
            <div style={styles.expectedBox}>
              <h4 style={styles.expectedTitle}>✅ Expected Answer</h4>
              <p style={styles.expectedText}>{result.expected_answer}</p>
            </div>
            <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
              Back to Dashboard 🏠
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  centered: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  header: {
    backgroundColor: 'white', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  backBtn: {
    padding: '8px 16px', backgroundColor: '#f3f4f6',
    border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  headerTitle: { margin: 0, color: '#1a1a2e' },
  dateTag: {
    backgroundColor: '#fef3c7', color: '#f59e0b',
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600'
  },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 20px' },
  card: {
    backgroundColor: 'white', borderRadius: '16px',
    padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  dailyBanner: {
    backgroundColor: '#fffbeb', borderRadius: '10px',
    padding: '15px 20px', display: 'flex',
    alignItems: 'center', gap: '15px', marginBottom: '25px',
    border: '1px solid #fde68a'
  },
  bannerIcon: { fontSize: '30px' },
  bannerTitle: { margin: 0, fontWeight: '700', color: '#92400e', fontSize: '15px' },
  bannerSubtitle: { margin: 0, color: '#b45309', fontSize: '13px' },
  diffBadge: {
    marginLeft: '8px', backgroundColor: '#f3f4f6',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', color: '#555', fontWeight: '600'
  },
  questionText: { color: '#1a1a2e', fontSize: '22px', marginBottom: '20px', lineHeight: '1.5' },
  timerSection: { marginBottom: '20px' },
  timerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  timerLabel: { color: '#888', fontSize: '13px' },
  timerNumber: { fontSize: '20px', fontWeight: '700' },
  timerBar: { height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: '3px', transition: 'width 1s linear' },
  startBtn: {
    width: '100%', padding: '14px', backgroundColor: '#f59e0b',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '15px'
  },
  voiceSection: { backgroundColor: '#f8faff', borderRadius: '8px', padding: '15px', marginBottom: '15px' },
  voiceLabel: { color: '#555', fontSize: '14px', marginBottom: '10px', marginTop: 0 },
  textarea: {
    width: '100%', padding: '15px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '15px',
    resize: 'vertical', boxSizing: 'border-box',
    fontFamily: 'inherit', marginBottom: '20px'
  },
  submitBtn: {
    width: '100%', padding: '14px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  },
  scoreContainer: { display: 'flex', justifyContent: 'center', margin: '25px 0' },
  scoreCircle: {
    width: '110px', height: '110px', borderRadius: '50%',
    border: '5px solid', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center'
  },
  scoreNumber: { fontSize: '36px', fontWeight: 'bold' },
  scoreMax: { fontSize: '13px', color: '#888' },
  feedbackBox: { backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '15px', marginBottom: '15px' },
  feedbackTitle: { margin: '0 0 8px 0', color: '#1a1a2e' },
  feedbackText: { margin: 0, color: '#555', lineHeight: '1.6' },
  expectedBox: { backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '15px', marginBottom: '25px' },
  expectedTitle: { margin: '0 0 8px 0', color: '#10b981' },
  expectedText: { margin: 0, color: '#555', lineHeight: '1.6' },
  homeBtn: {
    width: '100%', padding: '14px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  },
  doneHeader: { textAlign: 'center', marginBottom: '25px' },
  doneIcon: { fontSize: '50px' },
  doneTitle: { fontSize: '22px', color: '#1a1a2e', margin: '10px 0 5px' },
  doneSubtitle: { color: '#888', fontSize: '14px' }
};

export default DailyChallenge;