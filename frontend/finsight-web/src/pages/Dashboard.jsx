// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useTicker } from '../context/TickerContext';
import analysisService from '../services/analysisService';

const Dashboard = () => {
    const { ticker, companyName } = useTicker();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await analysisService.analyzeStock(ticker);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    if (loading) return <div className="dashboard"><h2>Loading {ticker}...</h2></div>;
    if (error) return <div className="dashboard"><p className="error-message">{error}</p></div>;

    const stock = data?.stock || {};
    const overview = data?.overview || {};
    const history = stock.history || [];
    const last = history[history.length - 1];
    const prev = history[history.length - 2] || last;
    const change = last && prev ? ((last.close - prev.close) / prev.close * 100).toFixed(2) : 0;

    return (
        <div className="dashboard">
            <div className="page-header">
             
<h1>
    {ticker} — {
        overview.Name &&
        overview.Name.trim().toUpperCase() !== ticker
            ? overview.Name
            : companyName
    }
</h1>


                <p>Live market data and key financial indicators.</p>
            </div>

            <div className="kpi-grid">
                <div className="metric-box">
                    <span>Current Price</span>
                    <strong>${stock.close?.toFixed(2) ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>Change</span>
                    <strong className={change >= 0 ? "positive" : "negative"}>
                        {change >= 0 ? "▲" : "▼"} {change}%
                    </strong>
                </div>
                <div className="metric-box">
                    <span>Open</span>
                    <strong>${stock.open?.toFixed(2) ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>High</span>
                    <strong>${stock.high?.toFixed(2) ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>Low</span>
                    <strong>${stock.low?.toFixed(2) ?? "—"}</strong>
                </div>
                <div className="metric-box">
                    <span>Volume</span>
                    <strong>{stock.volume?.toLocaleString() ?? "—"}</strong>
                </div>
            </div>

            <div className="professional-card">
                <div className="card-header">
                    <div>
                        <h3>Price History</h3>
                        <p>Recent closing prices for {ticker}</p>
                    </div>
                </div>
                <div className="summary-box" style={{ maxHeight: 320, overflowY: "auto" }}>
                    {history.slice(-30).reverse().map((row, i) => (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "6px 0",
                            borderBottom: "1px solid var(--border-soft)"
                        }}>
                            <span className="muted">{row.date}</span>
                            <strong>${row.close.toFixed(2)}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;