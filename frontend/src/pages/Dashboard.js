import Loader from '../components/Loader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement,
  PointElement, Title,
  Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getUserResults } from '../services/api';

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement,
  PointElement, Title,
  Tooltip, Legend, ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem('user_name');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getUserResults(userId)
      .then(res => {
        setStats(res.data.stats);
        setResults(res.data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  // Bar chart data - last 10 scores
  const last10 = results.slice(0, 10).reverse();
  const barData = {
    labels: last10.map((r, i) => `Q${i + 1}`),
    datasets: [{
      label: 'Score',
      data: last10.map(r => r.score),
      backgroundColor: last10.map(r =>
        r.score >= 8 ? '#10b981' :
        r.score >= 6 ? '#f59e0b' :
        r.score >= 4 ? '#f97316' : '#ef4444'
      ),
      borderRadius: 6,
    }]
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: { min: 0, max: 10, ticks: { stepSize: 2 } }
    },
    plugins: { legend: { display: false } }
  };

  // Doughnut chart - category breakdown
  const categoryLabels = stats ? Object.keys(stats.category_averages) : [];
  const categoryValues = stats ? Object.values(stats.category_averages) : [];

  const doughnutData = {
    labels: categoryLabels,
    datasets: [{
      data: categoryValues,
      backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Smart Interview System</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>👋 {userName}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Start Interview Button */}
        <div style={styles.startCard}>
          <div>
            <h3 style={styles.startTitle}>Ready to practice? 🎯</h3>
            <p style={styles.startSubtitle}>
              Take a mock interview and get AI feedback
            </p>
          </div>
          <button
            style={styles.startBtn}
            onClick={() => navigate('/categories')}
          >
            Start Interview 🚀
          </button>
        </div>

        {loading ? (
  <Loader message="Loading your stats..." />
) : !stats || stats.total_answered === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>
              📝 No interviews yet. Start your first one above!
            </p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>
                  {stats.total_answered}
                </div>
                <div style={styles.statLabel}>Questions Answered</div>
              </div>
              <div style={styles.statCard}>
                <div style={{
                  ...styles.statNumber,
                  color: getScoreColor(stats.average_score)
                }}>
                  {stats.average_score}
                </div>
                <div style={styles.statLabel}>Average Score</div>
              </div>
              <div style={styles.statCard}>
                <div style={{
                  ...styles.statNumber, color: '#10b981'
                }}>
                  {stats.highest_score}
                </div>
                <div style={styles.statLabel}>Best Score</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>
                  {stats.weak_area || 'N/A'}
                </div>
                <div style={styles.statLabel}>Needs Work</div>
              </div>
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
              {/* Bar Chart */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Recent Scores</h4>
                <Bar data={barData} options={barOptions} />
              </div>

              {/* Doughnut Chart */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Category Breakdown</h4>
                {categoryLabels.length > 0 ? (
                  <>
                    <Doughnut data={doughnutData} />
                    <div style={styles.categoryList}>
                      {categoryLabels.map((cat, i) => (
                        <div key={cat} style={styles.categoryItem}>
                          <span>{cat}</span>
                          <span style={{
                            color: getScoreColor(categoryValues[i]),
                            fontWeight: 'bold'
                          }}>
                            {categoryValues[i]}/10
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#888', textAlign: 'center' }}>
                    No data yet
                  </p>
                )}
              </div>
            </div>

            {/* Recent Results Table */}
            <div style={styles.tableCard}>
              <h4 style={styles.chartTitle}>Recent Activity</h4>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Question</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 8).map((r) => (
                    <tr key={r.id} style={styles.tableRow}>
                      <td style={styles.td}>
                        {r.question.length > 50
                          ? r.question.substring(0, 50) + '...'
                          : r.question}
                      </td>
                      <td style={styles.td}>{r.category}</td>
                      <td style={{
                        ...styles.td,
                        color: getScoreColor(r.score),
                        fontWeight: 'bold'
                      }}>
                        {r.score}/10
                      </td>
                      <td style={{ ...styles.td, color: '#888', fontSize: '13px' }}>
                        {r.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
  content: { maxWidth: '1000px', margin: '30px auto', padding: '0 20px' },
  startCard: {
    backgroundColor: '#4f46e5', borderRadius: '12px',
    padding: '25px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '25px', color: 'white'
  },
  startTitle: { margin: '0 0 5px 0', fontSize: '20px' },
  startSubtitle: { margin: 0, opacity: 0.8, fontSize: '14px' },
  startBtn: {
    padding: '12px 25px', backgroundColor: 'white',
    color: '#4f46e5', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px', fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  emptyCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  emptyText: { color: '#888', fontSize: '16px' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px', marginBottom: '25px'
  },
  statCard: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '20px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e' },
  statLabel: { color: '#888', fontSize: '13px', marginTop: '5px' },
  chartsRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '20px', marginBottom: '25px'
  },
  chartCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  chartTitle: { margin: '0 0 20px 0', color: '#1a1a2e' },
  categoryList: { marginTop: '15px' },
  categoryItem: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #f3f4f6',
    fontSize: '14px'
  },
  tableCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '30px'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f9fafb' },
  th: {
    padding: '12px 15px', textAlign: 'left',
    color: '#555', fontSize: '13px',
    fontWeight: '600', borderBottom: '1px solid #e5e7eb'
  },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 15px', fontSize: '14px', color: '#333' }
};

export default Dashboard;