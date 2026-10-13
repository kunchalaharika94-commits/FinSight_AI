// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TickerProvider } from './context/TickerContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Home from './pages/Home'; // The page with the input
import Dashboard from './pages/Dashboard';
import RiskAnalysis from './pages/RiskAnalysis';
import FraudAnalysis from './pages/FraudAnalysis';
import Forecasting from './pages/Forecasting';
import SentimentAnalysis from './pages/SentimentAnalysis';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import AIInsights from './pages/AIInsights';

function App() {
  return (
    <TickerProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes (Requires Login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/risk" element={<RiskAnalysis />} />
              <Route path="/fraud" element={<FraudAnalysis />} />
              <Route path="/forecast" element={<Forecasting />} />
              <Route path="/sentiment" element={<SentimentAnalysis />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/insights" element={<AIInsights />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </TickerProvider>
  );
}

export default App;