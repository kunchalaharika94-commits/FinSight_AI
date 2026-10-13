// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

const handleLogout = () => {
    authService.logout();
    navigate('/', { replace: true });
};

    return (
        <nav className="navbar">
            <div className="nav-brand">FinSight AI</div>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/risk">Risk</Link>
                <Link to="/fraud">Fraud</Link>
                <Link to="/forecast">Forecast</Link>
                <Link to="/sentiment">Sentiment</Link>
                <Link to="/insights" className="nav-link">AI Insights</Link>
                <Link to="/companies" className="nav-link">Companies</Link>
                <Link to="/profile">Profile ({username})</Link>

            </div>
            <div className="nav-actions">
                <ThemeToggle />
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;