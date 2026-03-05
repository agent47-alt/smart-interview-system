import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockQuestions, submitAnswer } from '../services/api';
import useVoice from '../components/useVoice';
import MicButton from '../components/MicButton';

function MockInterview() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [timerActive, setTimerActive] = useState(true);
  const [started, setStarted] = useState(false);

  const userId = localStorage.getItem('user_id');

  const { isListening, supported, startListening, stopListening } = useVoice(
    (transcript) => {
      setAnswer(prev => prev ? prev + ' ' + transcript : transcript);
    }
  );

  useEffect(() => {
    getMockQuestions(10)
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!started) return;
    setTimeLeft(90);
    setTimerActive(true);
  }, [currentIndex, started]);

  const handleSkip = useCallback(() => {
    setResult(null);
    setAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem('sessionResults', JSON.stringify(sessionResults));
      localStorage.setItem('sessionCategory', 'Mock Interview');
      navigate('/results');
    }
  }, [currentIndex, questions.length, sessionResults, navigate]);

  useEffect(() => {
    if (!timerActive || result || !started) return;
    if (timeLeft <= 0) {
      handleSkip();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, result, started, handleSkip]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0
    ? ((currentIndex) / questions.length) * 100 : 0;
  const timerColor = timeLeft > 30 ? '#10b981'
    : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  const categoryColors = {
    Python: '#3b82f6', SQL: '#10b981', HR: '#f59e0b',
    'Data Structures': '#8b5cf6', 'System Design': '#ef4444',
    JavaScript: '#f97316',
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please write or speak an answer!');
      return;
    }
    setTimerActive(false);
    setSubmitting(true);
    try {
      const response = await submitAnswer({
        question_id: currentQuestion.id,
        user_answer: answer,
        user_id: parseInt(userId)
      });
      setResult(response.data);
      setSessionResults(prev => [...prev, {
        question: currentQuestion.question_text,
        category: currentQuestion.category,
        answer: answer,
        score: response.data.score,
        feedback: response.data.feedback
      }]);
    } catch (err) {
      console.error(err);
      alert('Error submitting. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    setAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem('sessionResults', JSON.stringify(sessionResults));
      localStorage.setItem('sessionCategory', 'Mock Interview');
      navigate('/results');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Preparing your mock interview...</p>
      </div>
    );
  }

  // Start Screen
  if (!started) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h3 style={styles.headerTitle}>Mock Full Interview</h3>
          <span />
        </div>

        <div style={styles.content}>
          <div style={styles.startCard}>
            <div style={styles.startIcon}>🎯</div>
            <h2 style={styles.startTitle}>Mock Full Interview</h2>
            <p style={styles.startSubtitle}>
              10 random questions from all categories
            </p>

            <div style={styles.rulesGrid}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>❓</span>
                <span style={styles.ruleText}>10 Questions</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>⏱️</span>
                <span style={styles.ruleText}>90 sec per question</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🎙️</span>
                <span style={styles.ruleText}>Voice or text</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🤖</span>
                <span style={styles.ruleText}>AI scoring</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>📊</span>
                <span style={styles.ruleText}>Detailed report</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleIcon}>🏆</span>
                <span style={styles.ruleText}>Final score</span>
              </div>
            </div>

            {/* Question preview */}
            <div style={styles.previewSection}>
              <p style={styles.previewTitle}>Your questions will cover:</p>
              <div style={styles.categoryTags}>
                {[...new Set(questions.map(q => q.category))].map(cat => (
                  <span
                    key={cat}
                    style={{
                      ...styles.categoryTag,
                      backgroundColor: categoryColors[cat] || '#6366f1'
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <button
              style={styles.startBtn}
              onClick={() => setStarted(true)}
            >
              Start Mock Interview 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Exit
        </button>
        <h3 style={styles.headerTitle}>Mock Interview</h3>
        <span style={styles.counter}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.content}>
        {result ? (
          <div style={styles.card}>
            <div style={styles.categoryBadge}>
              <span style={{
                backgroundColor: categoryColors[currentQuestion?.category] || '#6366f1',
                ...styles.catBadge
              }}>
                {currentQuestion?.category}
              </span>
            </div>
            <div style={styles.questionNumber}>
              Question {currentIndex + 1} — Result
            </div>
            <h2 style={styles.questionText}>
              {currentQuestion?.question_text}
            </h2>
            <div style={styles.scoreContainer}>
              <div style={{
                ...styles.scoreCircle,
                borderColor: getScoreColor(result.score)
              }}>
                <span style={{
                  ...styles.scoreNumber,
                  color: getScoreColor(result.score)
                }}>
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
            <button style={styles.nextBtn} onClick={handleNext}>
              {currentIndex + 1 < questions.length
                ? 'Next Question →' : 'See Final Report 🎯'}
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            {/* Category Badge */}
            <div style={styles.categoryBadge}>
              <span style={{
                backgroundColor: categoryColors[currentQuestion?.category] || '#6366f1',
                ...styles.catBadge
              }}>
                {currentQuestion?.category}
              </span>
            </div>

            {/* Timer */}
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
                  width: `${(timeLeft / 90) * 100}%`,
                  backgroundColor: timerColor
                }} />
              </div>
            </div>

            <div style={styles.questionNumber}>
              Question {currentIndex + 1}
            </div>
            <h2 style={styles.questionText}>
              {currentQuestion?.question_text}
            </h2>
            <div style={styles.difficulty}>
              Difficulty: <span style={styles.difficultyBadge}>
                {currentQuestion?.difficulty}
              </span>
            </div>

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

            <div style={styles.buttons}>
              <button style={styles.skipBtn} onClick={handleSkip}>
                Skip →
              </button>
              <button
                style={styles.submitBtn}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '⏳ Scoring...' : 'Submit ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  centered: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh'
  },
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
  counter: {
    backgroundColor: '#4f46e5', color: 'white',
    padding: '6px 14px', borderRadius: '20px', fontSize: '14px'
  },
  progressBar: { height: '4px', backgroundColor: '#e5e7eb' },
  progressFill: {
    height: '100%', backgroundColor: '#4f46e5', transition: 'width 0.3s'
  },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 20px' },
  startCard: {
    backgroundColor: 'white', borderRadius: '16px',
    padding: '50px 40px', textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  startIcon: { fontSize: '60px', marginBottom: '20px' },
  startTitle: { fontSize: '28px', color: '#1a1a2e', marginBottom: '8px' },
  startSubtitle: { color: '#888', marginBottom: '30px' },
  rulesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px', marginBottom: '30px'
  },
  ruleItem: {
    backgroundColor: '#f8faff', borderRadius: '10px',
    padding: '15px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '8px'
  },
  ruleIcon: { fontSize: '24px' },
  ruleText: { fontSize: '13px', color: '#555', fontWeight: '500' },
  previewSection: { marginBottom: '30px' },
  previewTitle: { color: '#888', fontSize: '14px', marginBottom: '10px' },
  categoryTags: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  categoryTag: {
    color: 'white', padding: '5px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '500'
  },
  startBtn: {
    padding: '15px 50px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  categoryBadge: { marginBottom: '15px' },
  catBadge: {
    color: 'white', padding: '4px 14px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '600'
  },
  timerSection: { marginBottom: '20px' },
  timerRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px'
  },
  timerLabel: { color: '#888', fontSize: '13px' },
  timerNumber: { fontSize: '20px', fontWeight: '700' },
  timerBar: {
    height: '6px', backgroundColor: '#e5e7eb',
    borderRadius: '3px', overflow: 'hidden'
  },
  timerFill: {
    height: '100%', borderRadius: '3px', transition: 'width 1s linear'
  },
  questionNumber: {
    color: '#4f46e5', fontWeight: 'bold',
    fontSize: '14px', marginBottom: '10px'
  },
  questionText: {
    color: '#1a1a2e', fontSize: '22px',
    marginBottom: '15px', lineHeight: '1.5'
  },
  difficulty: { color: '#888', fontSize: '13px', marginBottom: '20px' },
  difficultyBadge: { fontWeight: 'bold', color: '#555' },
  voiceSection: {
    backgroundColor: '#f8faff', borderRadius: '8px',
    padding: '15px', marginBottom: '15px'
  },
  voiceLabel: {
    color: '#555', fontSize: '14px',
    marginBottom: '10px', marginTop: 0
  },
  textarea: {
    width: '100%', padding: '15px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '15px',
    resize: 'vertical', boxSizing: 'border-box',
    fontFamily: 'inherit', marginBottom: '20px'
  },
  buttons: { display: 'flex', gap: '10px' },
  skipBtn: {
    padding: '12px 25px', backgroundColor: '#f3f4f6',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '15px', color: '#555'
  },
  submitBtn: {
    padding: '12px 30px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px', flex: 1
  },
  scoreContainer: {
    display: 'flex', justifyContent: 'center', margin: '25px 0'
  },
  scoreCircle: {
    width: '100px', height: '100px', borderRadius: '50%',
    border: '5px solid', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center'
  },
  scoreNumber: { fontSize: '32px', fontWeight: 'bold' },
  scoreMax: { fontSize: '13px', color: '#888' },
  feedbackBox: {
    backgroundColor: '#f0f9ff', borderRadius: '8px',
    padding: '15px', marginBottom: '15px'
  },
  feedbackTitle: { margin: '0 0 8px 0', color: '#1a1a2e' },
  feedbackText: { margin: 0, color: '#555', lineHeight: '1.6' },
  expectedBox: {
    backgroundColor: '#f0fdf4', borderRadius: '8px',
    padding: '15px', marginBottom: '25px'
  },
  expectedTitle: { margin: '0 0 8px 0', color: '#10b981' },
  expectedText: { margin: 0, color: '#555', lineHeight: '1.6' },
  nextBtn: {
    width: '100%', padding: '14px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  }
};

export default MockInterview;