import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CategorySelect from './pages/CategorySelect';
import Interview from './pages/Interview';
import Results from './pages/Results';
import MockInterview from './pages/MockInterview';
import DailyChallenge from './pages/DailyChallenge';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategorySelect /></PrivateRoute>} />
        <Route path="/interview/:category/:difficulty" element={<PrivateRoute><Interview /></PrivateRoute>} />
        <Route path="/mock" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
        <Route path="/daily" element={<PrivateRoute><DailyChallenge /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;