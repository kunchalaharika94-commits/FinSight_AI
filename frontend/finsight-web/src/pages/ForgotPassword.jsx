import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.verifyEmail(email);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || 'Email not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.resetPassword({ email, new_password: newPassword });
            alert('Password updated. Please sign in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            <div className="auth-left">
                <div className="auth-brand">Fin<span className="logo-highlight">Sight</span> AI</div>
                <h1 className="auth-tagline">Reset your<br /><span className="gradient-text">password.</span></h1>
                <p className="auth-sub">
                    {step === 1
                        ? 'Enter your account email to continue.'
                        : 'Choose a new password for your account.'}
                </p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{step === 1 ? 'Forgot password?' : 'Set new password'}</h1>
                        <p>{step === 1 ? 'Verify your email.' : 'Enter a new password below.'}</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleVerifyEmail}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com" required />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                                {loading ? 'Checking...' : 'Continue'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input className="form-input" type="password" value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password" required minLength={6} />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        Remember your password? <Link to="/login" className="gradient-text">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}