// src/pages/FraudAnalysis.jsx
import { useEffect, useState } from 'react';
import { useTicker } from '../context/TickerContext';
import analysisService from '../services/analysisService';

const FraudAnalysis = () => {
    const { ticker } = useTicker();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await analysisService.getFraudAnalysis(ticker);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to load fraud data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    if (loading) return <div className="analysis-page"><h2>Detecting anomalies for {ticker}...</h2></div>;
    if (error) return <div className="analysis-page"><p className="error-message">{error}</p></div>;

    const anomalies = data?.anomalies || [];
    const fraudScore = data?.fraud_score ?? 0;

    return (
        <div className="analysis-page">
            <div className="page-header">
                <h1>{ticker} — Fraud & Anomaly Detection</h1>
                <p>Statistical detection of unusual price movements.</p>
            </div>

            <div className="kpi-grid">
                <div className="metric-box">
                    <span>Fraud Score</span>
                    <strong>{fraudScore}</strong>
                </div>
                <div className="metric-box">
                    <span>Anomalies Found</span>
                    <strong>{anomalies.length}</strong>
                </div>
                <div className="metric-box">
                    <span>Status</span>
                    <strong className={anomalies.length === 0 ? "positive" : "negative"}>
                        {anomalies.length === 0 ? "Clean" : "Anomalies Detected"}
                    </strong>
                </div>
            </div>

            <div className="professional-card">
                <div className="card-header">
                    <div>
                        <h3>Detected Anomalies</h3>
                        <p>Days with prices more than 2 standard deviations from the mean</p>
                    </div>
                </div>
                {anomalies.length === 0 ? (
                    <p className="muted">No anomalies detected in the historical data.</p>
                ) : (
                    <div className="summary-box">
                        {anomalies.map((a, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0",
                                borderBottom: "1px solid var(--border-soft)"
                            }}>
                                <span className="muted">Day #{a.day}</span>
                                <span>${a.price?.toFixed(2)}</span>
                                <strong className="negative">Z: {a.z_score}</strong>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FraudAnalysis;