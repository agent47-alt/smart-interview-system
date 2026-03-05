import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByCategory, submitAnswer } from '../services/api';
import useVoice from '../components/useVoice';
import MicButton from '../components/MicButton';

// Timer seconds per difficulty
const TIMER_SECONDS = {
  easy: 60,
  medium: 90,
  hard: 120,
  all: 90,
};

function Interview() {
  const { category, difficulty } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS[difficulty] || 90);
  const [timerActive, setTimerActive] = useState(true);

  const userId = localStorage.getItem('user_id');

  const { isListening, supported, startListening, stopListening } = useVoice(
    (transcript) => {
      setAnswer(prev => prev ? prev + ' ' + transcript : transcript);
    }
  );

  useEffect(() => {
    getQuestionsByCategory(category, difficulty)
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category, difficulty]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS[difficulty] || 90);
    setTimerActive(true);
  }, [currentIndex, difficulty]);

  // Countdown timer
  const handleTimeUp = useCallback(() => {
    if (!result) {
      handleSkip();
    }
  }, [result, currentIndex]);

  useEffect(() => {
    if (!timerActive || result) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, result, handleTimeUp]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0
    ? ((currentIndex) / questions.length) * 100 : 0;

  const totalSeconds = TIMER_SECONDS[difficulty] || 90;
  const timerPercent = (timeLeft / totalSeconds) * 100;
  const timerColor = timeLeft > 30 ? '#10b981'
    : timeLeft > 10 ? '#f59e0b' : '#ef4444';

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
      localStorage.setItem('sessionCategory', category);
      navigate('/results');
    }
  };

  const handleSkip = () => {
    setResult(null);
    setAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem('sessionResults', JSON.stringify(sessionResults));
      localStorage.setItem('sessionCategory', category);
      navigate('/results');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  const difficultyColors = {
    easy: '#10b981', medium: '#f59e0b', hard: '#ef4444', all: '#6366f1'
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={styles.centered}>
        <div style={styles.emptyCard}>
          <p style={{ fontSize: '40px' }}>😕</p>
          <h3>No questions found</h3>
          <p style={{ color: '#888' }}>
            No {difficulty} questions in {category} yet.
          </p>
          <button
            style={styles.backButton}
            onClick={() => navigate('/categories')}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/categories')}>
          ← Back
        </button>
        <div style={styles.headerCenter}>
          <h3 style={styles.headerTitle}>{category}</h3>
          <span style={{
            ...styles.diffBadge,
            backgroundColor: difficultyColors[difficulty] || '#6366f1'
          }}>
            {difficulty === 'all' ? 'All Levels' : difficulty}
          </span>
        </div>
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
          /* Result Card */
          <div style={styles.card}>
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
            <div style={styles.answerBox}>
              <h4 style={styles.answerTitle}>Your Answer</h4>
              <p style={styles.answerText}>{answer}</p>
            </div>
            <div style={styles.expectedBox}>
              <h4 style={styles.expectedTitle}>✅ Expected Answer</h4>
              <p style={styles.expectedText}>{result.expected_answer}</p>
            </div>
            <button style={styles.nextBtn} onClick={handleNext}>
              {currentIndex + 1 < questions.length
                ? 'Next Question →' : 'See Final Results 🎯'}
            </button>
          </div>
        ) : (
          /* Question Card */
          <div style={styles.card}>
            {/* Timer */}
            <div style={styles.timerSection}>
              <div style={styles.timerRow}>
                <span style={styles.timerLabel}>⏱️ Time Left</span>
                <span style={{
                  ...styles.timerNumber,
                  color: timerColor
                }}>
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
              <div style={styles.timerBar}>
                <div style={{
                  ...styles.timerFill,
                  width: `${timerPercent}%`,
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
              Difficulty:{' '}
              <span style={{
                ...styles.difficultyBadge,
                color: difficultyColors[currentQuestion?.difficulty]
              }}>
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
  emptyCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  backButton: {
    marginTop: '15px', padding: '10px 25px',
    backgroundColor: '#6366f1', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer'
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
  headerCenter: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerTitle: { margin: 0, color: '#1a1a2e' },
  diffBadge: {
    color: 'white', padding: '4px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '600'
  },
  counter: {
    backgroundColor: '#4f46e5', color: 'white',
    padding: '6px 14px', borderRadius: '20px', fontSize: '14px'
  },
  progressBar: { height: '4px', backgroundColor: '#e5e7eb' },
  progressFill: {
    height: '100%', backgroundColor: '#4f46e5', transition: 'width 0.3s'
  },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 20px' },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
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
  difficultyBadge: { fontWeight: 'bold' },
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
  answerBox: {
    backgroundColor: '#fafafa', borderRadius: '8px',
    padding: '15px', marginBottom: '15px'
  },
  answerTitle: { margin: '0 0 8px 0', color: '#888', fontSize: '13px' },
  answerText: { margin: 0, color: '#333' },
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

export default Interview;