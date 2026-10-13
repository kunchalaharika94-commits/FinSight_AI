import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTicker } from "../context/TickerContext";
import { analyzeStock } from "../services/analysisService";

const StockAnalysis = () => {

    const navigate = useNavigate();
    const { ticker } = useTicker();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {

        if (!ticker) {
            navigate("/home");
            return;
        }

        const loadAnalysis = async () => {

            try {

                setLoading(true);
                setError("");

                const result = await analyzeStock(ticker);

                console.log("Analysis API response:", result);

                setData(result);

            } catch (err) {

                console.error("Analysis error:", err);

                setError(
                    err.message || "Unable to load analysis."
                );

            } finally {

                setLoading(false);

            }
        };

        loadAnalysis();

    }, [ticker, navigate]);


    if (!ticker) {
        return null;
    }


    if (loading) {
        return (
            <div className="analysis-page">
                <h2>Analyzing {ticker}...</h2>
                <p>Please wait while FinSight AI processes the data.</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="analysis-page">
                <h2>{ticker} Analysis</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }


    return (
        <div className="analysis-page">

            <div className="page-header">
                <h1>{ticker} Financial Analysis</h1>
                <p>
                    Financial ratios and intelligent analysis
                    for {ticker}.
                </p>
            </div>


            {data && (
                <div className="analysis-content">

                    {/* Keep your existing ratio cards/table here */}

                    <div className="analysis-section">

                        <h2>Ratio Analysis</h2>

                        <pre>
                            {JSON.stringify(
                                data.analysis?.ratios ||
                                data.ratios ||
                                {},
                                null,
                                2
                            )}
                        </pre>

                    </div>

                </div>
            )}

        </div>
    );
};

export default StockAnalysis;