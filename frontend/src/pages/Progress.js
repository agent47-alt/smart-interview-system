import React, { useEffect, useState } from 'react';
import { getUserResults } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

function Progress() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getUserResults(userId)
      .then(res => {
        setResults(res.data.results);
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  // Filter results by category
  const filtered = filter === 'all'
    ? results
    : results.filter(r => r.category === filter);

  const reversed = [...filtered].reverse();

  // Line chart - score over time
  const lineData = {
    labels: reversed.map((r, i) => `#${i + 1}`),
    datasets: [{
      label: 'Score',
      data: reversed.map(r => r.score),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: reversed.map(r =>
        r.score >= 8 ? '#10b981' :
        r.score >= 6 ? '#f59e0b' :
        r.score >= 4 ? '#f97316' : '#ef4444'
      ),
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }]
  };

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0, max: 10,
        ticks: { stepSize: 2 },
        grid: { color: '#f3f4f6' }
      },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Score: ${ctx.raw}/10`
        }
      }
    }
  };

  // Calculate streak
  const calculateStreak = () => {
    if (results.length === 0) return 0;
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(results.map(r => r.date.split(' ')[0]))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (dates[i] === expectedStr || (i === 0 && dates[0] === today)) {
        streak++;
      } else break;
    }
    return streak;
  };

  // Calculate improvement
  const calculateImprovement = () => {
    if (results.length < 2) return 0;
    const recent = results.slice(0, 5);
    const older = results.slice(-5);
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.score, 0) / older.length;
    return (recentAvg - olderAvg).toFixed(1);
  };

  const categories = ['all', ...new Set(results.map(r => r.category))];
  const streak = calculateStreak();
  const improvement = calculateImprovement();

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>📊 Progress Tracking</h2>
          <p style={styles.pageSubtitle}>Your improvement over time</p>
        </div>
        <div style={styles.emptyCard}>
          <p style={styles.emptyIcon}>📊</p>
          <h3>No data yet!</h3>
          <p style={{ color: '#888' }}>
            Complete some interviews to see your progress here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>📊 Progress Tracking</h2>
        <p style={styles.pageSubtitle}>Your improvement over time</p>
      </div>

      <div style={styles.content}>

        {/* Top Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statNumber}>{streak}</div>
            <div style={styles.statLabel}>Day Streak</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📈</div>
            <div style={{
              ...styles.statNumber,
              color: improvement >= 0 ? '#10b981' : '#ef4444'
            }}>
              {improvement > 0 ? '+' : ''}{improvement}
            </div>
            <div style={styles.statLabel}>Improvement</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statNumber}>{results.length}</div>
            <div style={styles.statLabel}>Total Answered</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={{
              ...styles.statNumber,
              color: getScoreColor(stats?.average_score || 0)
            }}>
              {stats?.average_score || 0}
            </div>
            <div style={styles.statLabel}>Average Score</div>
          </div>
        </div>

        {/* Line Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h4 style={styles.chartTitle}>Score Over Time</h4>
            {/* Category Filter */}
            <div style={styles.filterRow}>
              {categories.map(cat => (
                <button
                  key={cat}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filter === cat ? '#4f46e5' : '#f3f4f6',
                    color: filter === cat ? 'white' : '#555'
                  }}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
          {reversed.length > 0 ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
              No data for this category yet
            </p>
          )}
        </div>

        {/* Category Performance */}
        <div style={styles.categoryCard}>
          <h4 style={styles.chartTitle}>Category Performance</h4>
          <div style={styles.categoryGrid}>
            {stats && Object.entries(stats.category_averages).map(([cat, avg]) => (
              <div key={cat} style={styles.catItem}>
                <div style={styles.catHeader}>
                  <span style={styles.catName}>{cat}</span>
                  <span style={{
                    ...styles.catScore,
                    color: getScoreColor(avg)
                  }}>
                    {avg}/10
                  </span>
                </div>
                <div style={styles.catBar}>
                  <div style={{
                    ...styles.catFill,
                    width: `${(avg / 10) * 100}%`,
                    backgroundColor: getScoreColor(avg)
                  }} />
                </div>
                <span style={styles.catLevel}>
                  {avg >= 8 ? '🟢 Excellent' :
                   avg >= 6 ? '🟡 Good' :
                   avg >= 4 ? '🟠 Average' : '🔴 Needs Work'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best and Worst */}
        <div style={styles.extremesRow}>
          <div style={styles.extremeCard}>
            <h4 style={styles.extremeTitle}>🏆 Best Performance</h4>
            {results
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map((r, i) => (
                <div key={i} style={styles.extremeItem}>
                  <span style={styles.extremeQ}>
                    {r.question.length > 40
                      ? r.question.substring(0, 40) + '...'
                      : r.question}
                  </span>
                  <span style={{
                    ...styles.extremeScore,
                    color: '#10b981'
                  }}>
                    {r.score}/10
                  </span>
                </div>
              ))}
          </div>

          <div style={styles.extremeCard}>
            <h4 style={styles.extremeTitle}>📚 Needs Improvement</h4>
            {results
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((r, i) => (
                <div key={i} style={styles.extremeItem}>
                  <span style={styles.extremeQ}>
                    {r.question.length > 40
                      ? r.question.substring(0, 40) + '...'
                      : r.question}
                  </span>
                  <span style={{
                    ...styles.extremeScore,
                    color: '#ef4444'
                  }}>
                    {r.score}/10
                  </span>
                </div>
              ))}
          </div>
        </div>

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
  pageHeader: { padding: '30px 30px 0 30px', marginBottom: '10px' },
  pageTitle: {
    margin: '0 0 5px 0', fontSize: '26px',
    fontWeight: '700', color: '#1a1a2e'
  },
  pageSubtitle: { margin: 0, color: '#888', fontSize: '15px' },
  content: { maxWidth: '1000px', margin: '20px auto', padding: '0 20px' },
  emptyCard: {
    textAlign: 'center', backgroundColor: 'white',
    borderRadius: '12px', padding: '60px',
    margin: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  emptyIcon: { fontSize: '50px' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px', marginBottom: '25px'
  },
  statCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '20px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e' },
  statLabel: { color: '#888', fontSize: '13px', marginTop: '5px' },
  chartCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  chartHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'
  },
  chartTitle: { margin: 0, color: '#1a1a2e', fontSize: '16px', fontWeight: '600' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '6px 14px', borderRadius: '20px',
    border: 'none', cursor: 'pointer',
    fontSize: '12px', fontWeight: '500', fontFamily: 'inherit'
  },
  categoryCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  categoryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px', marginTop: '15px'
  },
  catItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  catHeader: { display: 'flex', justifyContent: 'space-between' },
  catName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  catScore: { fontSize: '14px', fontWeight: '700' },
  catBar: {
    height: '8px', backgroundColor: '#f3f4f6',
    borderRadius: '4px', overflow: 'hidden'
  },
  catFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  catLevel: { fontSize: '12px', color: '#888' },
  extremesRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '20px', marginBottom: '30px'
  },
  extremeCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  extremeTitle: { margin: '0 0 15px 0', color: '#1a1a2e', fontSize: '15px' },
  extremeItem: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '10px 0',
    borderBottom: '1px solid #f3f4f6', gap: '10px'
  },
  extremeQ: { fontSize: '13px', color: '#555', flex: 1 },
  extremeScore: { fontSize: '14px', fontWeight: '700', flexShrink: 0 }
};

export default Progress;