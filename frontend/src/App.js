import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CategorySelect from './pages/CategorySelect';
import Interview from './pages/Interview';
import Results from './pages/Results';
import MockInterview from './pages/MockInterview';
import DailyChallenge from './pages/DailyChallenge';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AppContent() {
  const location = useLocation();
  const publicRoutes = ['/login', '/register'];
  const isPublic = publicRoutes.includes(location.pathname);
  const token = localStorage.getItem('token');

  return (
    <div style={{ display: 'flex' }}>
      {!isPublic && token && <Layout />}
      <div style={{
        flex: 1,
        marginLeft: (!isPublic && token) ? '220px' : '0',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategorySelect /></PrivateRoute>} />
          <Route path="/interview/:category/:difficulty" element={<PrivateRoute><Interview /></PrivateRoute>} />
          <Route path="/mock" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
          <Route path="/daily" element={<PrivateRoute><DailyChallenge /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;