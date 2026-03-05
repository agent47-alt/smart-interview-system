import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    getLeaderboard()
      .then(res => {
        setLeaderboard(res.data.leaderboard);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return { backgroundColor: '#fffbeb', border: '2px solid #f59e0b' };
    if (rank === 2) return { backgroundColor: '#f8fafc', border: '2px solid #94a3b8' };
    if (rank === 3) return { backgroundColor: '#fff7ed', border: '2px solid #f97316' };
    return { backgroundColor: 'white', border: '1px solid #f3f4f6' };
  };

  // Find current user rank
  const myRank = leaderboard.find(u => u.user_id === userId);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h3 style={styles.headerTitle}>🏆 Leaderboard</h3>
        <span style={styles.totalTag}>
          {leaderboard.length} users
        </span>
      </div>

      <div style={styles.content}>

        {/* Your Rank Card */}
        {myRank && (
          <div style={styles.myRankCard}>
            <div style={styles.myRankLeft}>
              <span style={styles.myRankEmoji}>
                {getRankEmoji(myRank.rank)}
              </span>
              <div>
                <p style={styles.myRankTitle}>Your Rank</p>
                <p style={styles.myRankName}>{myRank.name}</p>
              </div>
            </div>
            <div style={styles.myRankStats}>
              <div style={styles.myStatBox}>
                <div style={{
                  ...styles.myStatNum,
                  color: getScoreColor(myRank.average_score)
                }}>
                  {myRank.average_score}
                </div>
                <div style={styles.myStatLabel}>Avg Score</div>
              </div>
              <div style={styles.myStatBox}>
                <div style={styles.myStatNum}>{myRank.total_answered}</div>
                <div style={styles.myStatLabel}>Answered</div>
              </div>
              <div style={styles.myStatBox}>
                <div style={{ ...styles.myStatNum, color: '#10b981' }}>
                  {myRank.best_score}
                </div>
                <div style={styles.myStatLabel}>Best</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div style={styles.tableCard}>
          <h4 style={styles.tableTitle}>🏆 Top Performers</h4>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>
              Loading leaderboard...
            </p>
          ) : leaderboard.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '30px' }}>
              No users yet. Be the first! 🚀
            </p>
          ) : (
            <div style={styles.list}>
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  style={{
                    ...styles.listItem,
                    ...getRankStyle(entry.rank),
                    ...(entry.user_id === userId ? styles.currentUser : {})
                  }}
                >
                  {/* Rank */}
                  <div style={styles.rankBox}>
                    <span style={styles.rankEmoji}>
                      {getRankEmoji(entry.rank)}
                    </span>
                  </div>

                  {/* Name */}
                  <div style={styles.nameBox}>
                    <span style={styles.userName}>
                      {entry.name}
                      {entry.user_id === userId && (
                        <span style={styles.youBadge}> (You)</span>
                      )}
                    </span>
                  </div>

                  {/* Stats */}
                  <div style={styles.statsBox}>
                    <div style={styles.statItem}>
                      <span style={{
                        ...styles.statValue,
                        color: getScoreColor(entry.average_score)
                      }}>
                        {entry.average_score}
                      </span>
                      <span style={styles.statLabel}>avg</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statValue}>
                        {entry.total_answered}
                      </span>
                      <span style={styles.statLabel}>questions</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={{
                        ...styles.statValue, color: '#10b981'
                      }}>
                        {entry.best_score}
                      </span>
                      <span style={styles.statLabel}>best</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practice Button */}
        <div style={styles.practiceCard}>
          <p style={styles.practiceText}>
            Want to climb the leaderboard? 💪
          </p>
          <button
            style={styles.practiceBtn}
            onClick={() => navigate('/categories')}
          >
            Practice Now 🚀
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
  backBtn: {
    padding: '8px 16px', backgroundColor: '#f3f4f6',
    border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  headerTitle: { margin: 0, color: '#1a1a2e' },
  totalTag: {
    backgroundColor: '#ede9fe', color: '#6366f1',
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600'
  },
  content: { maxWidth: '700px', margin: '40px auto', padding: '0 20px' },
  myRankCard: {
    backgroundColor: '#4f46e5', borderRadius: '12px',
    padding: '25px 30px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '25px', color: 'white', flexWrap: 'wrap', gap: '15px'
  },
  myRankLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  myRankEmoji: { fontSize: '40px' },
  myRankTitle: { margin: 0, opacity: 0.8, fontSize: '13px' },
  myRankName: { margin: 0, fontSize: '20px', fontWeight: '700' },
  myRankStats: { display: 'flex', gap: '20px' },
  myStatBox: { textAlign: 'center' },
  myStatNum: { fontSize: '24px', fontWeight: '700', color: 'white' },
  myStatLabel: { fontSize: '12px', opacity: 0.7 },
  tableCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '20px'
  },
  tableTitle: { margin: '0 0 20px 0', color: '#1a1a2e' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: {
    borderRadius: '10px', padding: '15px 20px',
    display: 'flex', alignItems: 'center',
    gap: '15px', transition: 'transform 0.1s'
  },
  currentUser: { boxShadow: '0 0 0 2px #4f46e5' },
  rankBox: { width: '40px', textAlign: 'center' },
  rankEmoji: { fontSize: '22px', fontWeight: '700' },
  nameBox: { flex: 1 },
  userName: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  youBadge: { color: '#6366f1', fontSize: '13px' },
  statsBox: { display: 'flex', gap: '20px' },
  statItem: { textAlign: 'center' },
  statValue: { display: 'block', fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: '11px', color: '#888' },
  practiceCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '25px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '30px'
  },
  practiceText: { color: '#555', marginBottom: '15px' },
  practiceBtn: {
    padding: '12px 35px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  }
};

export default Leaderboard;