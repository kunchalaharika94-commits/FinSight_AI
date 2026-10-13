// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import {
    SAMPLE_TICKER,
    SAMPLE_COMPANY,
    SAMPLE_SECTOR,
    SAMPLE_PRICE,
    SAMPLE_CHANGE,
    SAMPLE_KPIS,
    SAMPLE_RISK,
    SAMPLE_SENTIMENT,
    SAMPLE_FORECAST,
    SAMPLE_FINANCIALS,
    SAMPLE_NEWS,
    SAMPLE_AI_INSIGHT,
} from "../data/sampleData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SAMPLE_CHART_DATA } from "../data/sampleData";

function Landing() {
    return (
        <div className="page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="container navbar-inner">
                    <div className="logo">
                        Fin<span className="logo-highlight">Sight</span> AI
                    </div>
                    <div className="nav-links">
                        <a href="#about" className="nav-link">About</a>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#sample" className="nav-link">Sample Analysis</a>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <ThemeToggle />
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="container hero-grid">
                    <div>
                        <div className="hero-badge">
                            ✦ AI-POWERED FINANCIAL INTELLIGENCE
                        </div>
                        <h1 className="hero-title">
                            Understand the<br />
                            <span className="gradient-text">Market Smarter.</span>
                        </h1>
                        <p className="hero-description">
                            FinSight AI brings stock analysis, financial ratios,
                            risk detection, anomaly detection, sentiment analysis,
                            forecasting and AI-powered insights together in one
                            intelligent platform.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Get Started →
                            </Link>
                            <a href="#sample" className="btn btn-secondary">
                                View Sample Analysis
                            </a>
                        </div>
                    </div>

                    {/* HERO PREVIEW — dummy data */}
                    <div className="hero-preview">
                        <div className="preview-top">
                            <div className="preview-title">Market Overview</div>
                            <div className="live-status">● Live Analysis</div>
                        </div>
                        <div className="muted">
                            {SAMPLE_TICKER} · {SAMPLE_COMPANY}
                        </div>
                        <div className="preview-price">${SAMPLE_PRICE}</div>
                        <div className="preview-change">▲ {SAMPLE_CHANGE}% Today</div>
                        <div className="chart-box" style={{ height: 120, padding: "10px 0" }}>
            <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SAMPLE_CHART_DATA}>
                        <XAxis dataKey="day" stroke="#7a879e" fontSize={11} />
                        <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                        <Tooltip
                            contentStyle={{
                            background: "#141b29",
                            border: "1px solid #1f2a3d",
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                    />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#4da3ff"
                    strokeWidth={2}
                    dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: "10px",
                            marginTop: "15px"
                        }}>
                            <div className="card">
                                <div className="kpi-label">Risk</div>
                                <div className="positive">{SAMPLE_RISK.level}</div>
                            </div>
                            <div className="card">
                                <div className="kpi-label">Sentiment</div>
                                <div className="positive">{SAMPLE_SENTIMENT.overall}</div>
                            </div>
                            <div className="card">
                                <div className="kpi-label">Forecast</div>
                                <div className="positive">{SAMPLE_FORECAST.trend}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="section">
                <div className="container">
                    <div className="section-heading">
                        <h2>
                            One platform for
                            <span className="gradient-text"> financial intelligence</span>
                        </h2>
                        <p>
                            FinSight AI transforms complex financial information
                            into understandable insights that help users evaluate
                            companies and market trends.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES (static, no data) */}
            <section id="features" className="section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Powerful analysis.<br />Simple understanding.</h2>
                        <p>Everything you need to evaluate a company from multiple financial perspectives.</p>
                    </div>
                    <div className="feature-grid">
                        <div className="card feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Financial Analysis</h3>
                            <p>Analyze stock performance, financial statements and important financial ratios.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Risk & Anomaly Detection</h3>
                            <p>Identify volatility, unusual market behavior and financial risk factors.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon">📰</div>
                            <h3>Market Sentiment</h3>
                            <p>Understand whether recent financial news is positive, negative or neutral.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon">🔮</div>
                            <h3>Forecasting</h3>
                            <p>Generate future price predictions using machine learning.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>Explainable AI</h3>
                            <p>Understand which factors influence machine-learning predictions.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>AI Insights</h3>
                            <p>Convert complex analytical results into simple financial explanations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAMPLE ANALYSIS — full dummy dashboard */}
            <section id="sample" className="section">
                <div className="container">
                    <div className="section-heading">
                        <h2>See FinSight AI in action</h2>
                        <p>This is a static demo. Sign up to analyze any ticker with live data.</p>
                    </div>

                    {/* Sample company header */}
                    <div className="company-result">
                        <div>
                            <div className="company-ticker">{SAMPLE_TICKER}</div>
                            <h2>{SAMPLE_COMPANY}</h2>
                            <p className="muted">{SAMPLE_SECTOR}</p>
                        </div>
                        <div className="analysis-complete">
                            <span>●</span> Sample Data
                        </div>
                    </div>

                    {/* KPI cards */}
                    <div className="kpi-grid">
                        {SAMPLE_KPIS.map(kpi => (
                            <div className="metric-box" key={kpi.label}>
                                <span>{kpi.label}</span>
                                <strong>{kpi.value}</strong>
                            </div>
                        ))}
                    </div>

                    {/* Financial summary */}
                    <div className="professional-card">
                        <div className="card-header">
                            <div>
                                <h3>Financial Summary</h3>
                                <p>Key indicators for {SAMPLE_TICKER}</p>
                            </div>
                        </div>
                        <div className="financial-grid">
                            {SAMPLE_FINANCIALS.map(item => (
                                <div className="summary-box" key={item.label}>
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk + Sentiment */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="professional-card">
                            <div className="card-header">
                                <div>
                                    <h3>Risk Analysis</h3>
                                    <p>Overall financial risk</p>
                                </div>
                            </div>
                            <div className="risk-grid">
                                <div className="metric-box">
                                    <span>Score</span><strong>{SAMPLE_RISK.score}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Level</span><strong>{SAMPLE_RISK.level}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Volatility</span><strong>{SAMPLE_RISK.volatility}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Anomaly Rate</span><strong>{SAMPLE_RISK.anomaly_rate}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="professional-card">
                            <div className="card-header">
                                <div>
                                    <h3>Market Sentiment</h3>
                                    <p>News sentiment analysis</p>
                                </div>
                            </div>
                            <div className="risk-grid">
                                <div className="metric-box">
                                    <span>Positive</span><strong>{SAMPLE_SENTIMENT.positive}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Negative</span><strong>{SAMPLE_SENTIMENT.negative}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Neutral</span><strong>{SAMPLE_SENTIMENT.neutral}</strong>
                                </div>
                                <div className="metric-box">
                                    <span>Overall</span><strong>{SAMPLE_SENTIMENT.overall}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forecast + AI Insights */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginTop: "20px" }}>
                        <div className="professional-card">
                            <div className="card-header">
                                <div>
                                    <h3>Forecast</h3>
                                    <p>Next 30 days</p>
                                </div>
                            </div>
                            <div className="metric-box">
                                <span>Trend</span><strong>{SAMPLE_FORECAST.trend}</strong>
                            </div>
                            <div className="metric-box" style={{ marginTop: "12px" }}>
                                <span>Expected</span><strong>{SAMPLE_FORECAST.next_30_days}</strong>
                            </div>
                            <div className="metric-box" style={{ marginTop: "12px" }}>
                                <span>Confidence</span><strong>{SAMPLE_FORECAST.confidence}</strong>
                            </div>
                        </div>

                        <div className="professional-card">
                            <div className="card-header">
                                <div>
                                    <h3>AI Insights</h3>
                                    <p>AI-generated interpretation</p>
                                </div>
                            </div>
                            <p style={{ lineHeight: 1.7, color: "var(--text)" }}>
                                {SAMPLE_AI_INSIGHT}
                            </p>
                        </div>
                    </div>

                    {/* News */}
                    <div className="professional-card" style={{ marginTop: "20px" }}>
                        <div className="card-header">
                            <div>
                                <h3>Recent News</h3>
                                <p>Sample headlines</p>
                            </div>
                        </div>
                        {SAMPLE_NEWS.map((item, i) => (
                            <div key={i} className="summary-box" style={{ marginBottom: "10px" }}>
                                <strong>{item.headline}</strong>
                                <span className="positive" style={{ marginLeft: "10px" }}>
                                    {item.sentiment}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                        <Link to="/register" className="btn btn-primary">
                            Sign up to analyze any ticker →
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="footer">
                FinSight AI · Intelligent Financial Analytics
            </footer>
        </div>
    );
}

export default Landing;