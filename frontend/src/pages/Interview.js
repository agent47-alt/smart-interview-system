import Loader from '../components/Loader';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByCategory, submitAnswer } from '../services/api';
import useVoice from '../components/useVoice';
import MicButton from '../components/MicButton';

function Interview() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);

  const userId = localStorage.getItem('user_id');

  // Voice hook - appends spoken text to answer box
  const { isListening, supported, startListening, stopListening } = useVoice(
    (transcript) => {
      setAnswer(prev => prev ? prev + ' ' + transcript : transcript);
    }
  );

  useEffect(() => {
    getQuestionsByCategory(category)
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0
    ? ((currentIndex) / questions.length) * 100
    : 0;

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please write or speak an answer before submitting!');
      return;
    }
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
      alert('Error submitting answer. Please try again.');
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

  if (loading) {
  return <Loader message="Loading questions..." />;
}

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/categories')}>
          ← Back
        </button>
        <h3 style={styles.headerTitle}>{category} Interview</h3>
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
                ? 'Next Question →'
                : 'See Final Results 🎯'}
            </button>
          </div>

        ) : (
          /* Question Card */
          <div style={styles.card}>
            <div style={styles.questionNumber}>
              Question {currentIndex + 1}
            </div>
            <h2 style={styles.questionText}>
              {currentQuestion?.question_text}
            </h2>
            <div style={styles.difficulty}>
              Difficulty:{' '}
              <span style={styles.difficultyBadge}>
                {currentQuestion?.difficulty}
              </span>
            </div>

            {/* Voice Input Section */}
            <div style={styles.voiceSection}>
              <p style={styles.voiceLabel}>
                🎙️ Speak your answer or type below:
              </p>
              <MicButton
                isListening={isListening}
                supported={supported}
                onStart={startListening}
                onStop={stopListening}
              />
            </div>

            <textarea
              style={styles.textarea}
              placeholder="Your answer will appear here after speaking, or type directly..."
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
                {submitting ? '⏳ Scoring...' : 'Submit Answer ✓'}
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
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
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
  difficultyBadge: {
    backgroundColor: '#f3f4f6', padding: '2px 10px',
    borderRadius: '10px', color: '#555', fontWeight: 'bold'
  },
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