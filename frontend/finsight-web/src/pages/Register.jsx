// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // ✅ Actually calls FastAPI → MySQL
            await authService.register({
                username: form.username,
                email: form.email,
                password: form.password
            });

            alert("Account created successfully. Please log in.");
            navigate("/login");

        } catch (err) {
            console.error("Registration error:", err);

            const message =
                err.response?.data?.detail ||
                err.message ||
                "Registration failed. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <nav className="navbar">
                <div className="container navbar-inner">
                    <Link to="/" className="logo">
                        Fin<span className="logo-highlight">Sight</span> AI
                    </Link>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </nav>

            <main className="auth-page">
                <div className="card auth-card">
                    <div className="auth-header">
                        <h1>Create your account</h1>
                        <p>Start exploring intelligent financial analysis.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                className="form-input"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                required
                            />
                        </div>

                        {error && (
                            <p className="error-message" style={{ marginBottom: "12px" }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="gradient-text">Sign in</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Register;