// src/pages/RiskAnalysis.jsx
import { useEffect, useState } from 'react';
import { useTicker } from '../context/TickerContext';
import analysisService from '../services/analysisService';

const RiskAnalysis = () => {
    const { ticker } = useTicker();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await analysisService.getRiskAnalysis(ticker);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to load risk data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    if (loading) return <div className="analysis-page"><h2>Loading risk for {ticker}...</h2></div>;
    if (error) return <div className="analysis-page"><p className="error-message">{error}</p></div>;

    const risk = data?.risk || {};

    return (
        <div className="analysis-page">
            <div className="page-header">
                <h1>{ticker} — Risk Assessment</h1>
                <p>Volatility-based risk evaluation of the stock.</p>
            </div>

            <div className="kpi-grid">
                <div className="metric-box">
                    <span>Risk Score</span>
                    <strong>{risk.score ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>Risk Level</span>
                    <strong className={
                        risk.level === "Low" ? "positive" :
                        risk.level === "High" ? "negative" : ""
                    }>
                        {risk.level ?? "—"}
                    </strong>
                </div>
                <div className="metric-box">
                    <span>Volatility</span>
                    <strong>{risk.volatility ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>Anomaly Rate</span>
                    <strong>{risk.anomaly_rate ?? "—"}</strong>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalysis;