import { useEffect, useState } from 'react';
import { useTicker } from '../context/TickerContext';
import analysisService from '../services/analysisService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const Forecasting = () => {
    const { ticker } = useTicker();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await analysisService.getForecast(ticker);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to load forecast");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    if (loading) return <div className="analysis-page"><h2>Forecasting {ticker}...</h2></div>;
    if (error) return <div className="analysis-page"><p className="error-message">{error}</p></div>;

    const f = data?.forecast || {};
    const chartData = (f.dates || []).map((date, i) => ({
        date,
        Actual: f.actual?.[i],
        Predicted: f.predicted?.[i],
    }));

    const lastActual = f.actual?.[f.actual.length - 1];
    const lastPredicted = f.predicted?.[f.predicted.length - 1];
    const day30 = f.future?.[f.future.length - 1]?.price;

    return (
        <div className="analysis-page">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>🔮</span>
                <div>
                    <h1>Price Forecast</h1>
                    <p>Actual vs Predicted for {ticker}</p>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="metric-box">
                    <span>Trend</span>
                    <strong className={f.trend === 'bullish' ? 'positive' : 'negative'}>
                        {f.trend ?? '—'}
                    </strong>
                </div>
                <div className="metric-box">
                    <span>Confidence</span>
                    <strong>{f.confidence ? `${Math.round(f.confidence * 100)}%` : '—'}</strong>
                </div>
                <div className="metric-box">
                    <span>Latest Actual</span>
                    <strong>${lastActual?.toFixed(2) ?? '—'}</strong>
                </div>
                <div className="metric-box">
                    <span>Day 30 Forecast</span>
                    <strong>${day30?.toFixed(2) ?? '—'}</strong>
                </div>
            </div>

            <div className="professional-card">
                <div className="card-header">
                    <div>
                        <h3>Actual vs Predicted</h3>
                        <p>Historical close prices compared to model prediction</p>
                    </div>
                </div>

                <div style={{ height: 420 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="var(--muted)"
                                fontSize={12}
                                tickLine={false}
                                interval={Math.max(1, Math.floor(chartData.length / 6))}
                            />
                            <YAxis
                                stroke="var(--muted)"
                                fontSize={12}
                                tickLine={false}
                                domain={['auto', 'auto']}
                                label={{ value: 'value', angle: -90, position: 'insideLeft', fill: 'var(--muted)', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="plainline"
                                wrapperStyle={{ fontSize: 13, paddingBottom: 12 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Actual"
                                stroke="#1f77b4"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Predicted"
                                stroke="#aec7e8"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Forecasting;