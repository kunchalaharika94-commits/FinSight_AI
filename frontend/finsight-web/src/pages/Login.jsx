import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.login({ email, password });
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            <div className="auth-left">
                <div className="auth-brand">Fin<span className="logo-highlight">Sight</span> AI</div>
                <h1 className="auth-tagline">Understand the<br /><span className="gradient-text">Market Smarter.</span></h1>
                <p className="auth-sub">One login. Full financial intelligence.</p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome back</h1>
                        <p>Sign in to continue.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" required />
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <label className="form-label">Password</label>
                                <Link to="/forgot-password" className="auth-link">
                                    Forgot password?
                                </Link>
                            </div>
                            <input className="form-input" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" required />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register" className="gradient-text">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}