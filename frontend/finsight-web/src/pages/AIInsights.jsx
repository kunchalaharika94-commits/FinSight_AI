import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTicker } from '../context/TickerContext';
import analysisService from '../services/analysisService';

const AIInsights = () => {
    const { ticker } = useTicker();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await analysisService.getInsights(ticker);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to load insights");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    const downloadReport = () => {
        const content = `FinSight AI — Report for ${ticker}\nGenerated: ${new Date().toLocaleString()}\n\n${data?.report ?? ""}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `FinSight_${ticker}_Report.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="analysis-page">
            <h2>Generating report for {ticker}...</h2>
        </div>
    );
    if (error) return (
        <div className="analysis-page">
            <p className="error-message">{error}</p>
        </div>
    );

    return (
        <div className="analysis-page">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>📊</span>
                <div style={{ flex: 1 }}>
                    <h1>{ticker} Financial Analysis</h1>
                    <p>AI-generated analysis. This is not financial advice.</p>
                </div>
                <button className="btn btn-primary" onClick={downloadReport}>
                    Download Report
                </button>
            </div>

            <div className="professional-card markdown-report">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data?.report ?? ""}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default AIInsights;