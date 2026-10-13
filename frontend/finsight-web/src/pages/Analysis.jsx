import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { analyzeStock } from "../services/analysisService";


function Analysis() {

    const [ticker, setTicker] = useState("");

    const [company, setCompany] = useState("");

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleAnalyze = async () => {

        const symbol =
            ticker.trim().toUpperCase();


        if (!symbol) {

            setError(
                "Please enter a company name or stock ticker."
            );

            return;
        }


        setLoading(true);
        setError("");
        setData(null);


        try {

            console.log(
                "Analyzing:",
                symbol
            );


            const result =
                await analyzeStock(symbol);


            console.log(
                "Analysis result:",
                result
            );


            setData(result);

            setCompany(symbol);


        } catch (error) {

            console.error(
                "Analysis failed:",
                error
            );


            setError(
                error.response?.data?.detail ||
                error.message ||
                "Unable to analyze this company."
            );


        } finally {

            setLoading(false);

        }
    };


    return (
        <MainLayout>

            <main className="analysis-page">

                {/* HEADER */}

                <section className="analysis-hero">

                    <div>

                        <span className="eyebrow">
                            FINANCIAL INTELLIGENCE
                        </span>

                        <h1>
                            Analyze Any Company
                        </h1>

                        <p>
                            Enter a stock ticker to analyze
                            financial performance, risk,
                            sentiment and future trends.
                        </p>

                    </div>

                </section>


                {/* SEARCH */}

                <section className="company-search-card">

                    <div className="search-content">

                        <div className="search-label">
                            Company / Stock Ticker
                        </div>

                        <div className="search-row">

                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) =>
                                    setTicker(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {

                                    if (
                                        e.key === "Enter"
                                    ) {
                                        handleAnalyze();
                                    }

                                }}
                                placeholder="Enter ticker e.g. AAPL, MSFT, TSLA"
                                className="company-input"
                            />

                            <button
                                className="analyze-btn"
                                onClick={handleAnalyze}
                                disabled={loading}
                            >

                                {loading
                                    ? "Analyzing..."
                                    : "Analyze"}

                            </button>

                        </div>

                        <div className="search-hint">
                            Press Enter or click Analyze
                        </div>

                    </div>

                </section>


                {/* ERROR */}

                {error && (

                    <div className="analysis-error">

                        <div className="error-icon">
                            !
                        </div>

                        <div>

                            <strong>
                                Analysis failed
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="analysis-loading">

                        <div className="loading-spinner"></div>

                        <h3>
                            Analyzing {ticker.toUpperCase()}
                        </h3>

                        <p>
                            Collecting financial data and
                            running FinSight AI analysis...
                        </p>

                    </div>

                )}


                {/* RESULTS */}

                {data && !loading && (

                    <AnalysisResults
                        data={data}
                        company={company}
                    />

                )}

            </main>

        </MainLayout>
    );
}


/* ==========================================
   RESULTS
========================================== */

function AnalysisResults({
    data,
    company
}) {

    const overview =
        data?.overview ||
        {};

    const ratios =
        data?.ratios ||
        data?.ratio_analysis ||
        {};

    const risk =
        data?.risk ||
        data?.risk_analysis ||
        {};

    const sentiment =
        data?.sentiment ||
        data?.sentiment_analysis ||
        {};

    const stock =
        data?.stock ||
        data?.stock_data ||
        {};


    const value = (...keys) => {

        for (const key of keys) {

            if (
                ratios[key] !== undefined &&
                ratios[key] !== null
            ) {
                return ratios[key];
            }

            if (
                overview[key] !== undefined &&
                overview[key] !== null
            ) {
                return overview[key];
            }

            if (
                risk[key] !== undefined &&
                risk[key] !== null
            ) {
                return risk[key];
            }

            if (
                sentiment[key] !== undefined &&
                sentiment[key] !== null
            ) {
                return sentiment[key];
            }

        }

        return "N/A";
    };


    return (

        <section className="results-section">

            {/* COMPANY HEADER */}

            <div className="company-result">

                <div>

                    <div className="company-ticker">
                        {company}
                    </div>

                    <h2>
                        {overview.Name ||
                         overview.name ||
                         company}
                    </h2>

                    <p>
                        {overview.Sector ||
                         "Financial Analysis"}
                    </p>

                </div>

                <div className="analysis-complete">
                    <span>●</span>
                    Analysis Complete
                </div>

            </div>


            {/* KPI CARDS */}

            <div className="kpi-grid">

                <Metric
                    title="Current Price"
                    value={
                        stock.Close ||
                        stock.close ||
                        stock.price ||
                        "N/A"
                    }
                />

                <Metric
                    title="Market Cap"
                    value={
                        overview.MarketCapitalization ||
                        overview.market_capitalization ||
                        "N/A"
                    }
                />

                <Metric
                    title="P/E Ratio"
                    value={value(
                        "P/E Ratio",
                        "PERatio",
                        "pe_ratio"
                    )}
                />

                <Metric
                    title="EPS"
                    value={value(
                        "EPS",
                        "eps"
                    )}
                />

                <Metric
                    title="Profit Margin"
                    value={value(
                        "Profit Margin",
                        "ProfitMargin",
                        "profit_margin"
                    )}
                />

                <Metric
                    title="Beta"
                    value={value(
                        "Beta",
                        "beta"
                    )}
                />

            </div>


            {/* FINANCIAL SUMMARY */}

            <div className="professional-card">

                <div className="card-header">

                    <div>

                        <h3>
                            Financial Summary
                        </h3>

                        <p>
                            Key financial indicators for{" "}
                            {company}
                        </p>

                    </div>

                </div>


                <div className="financial-grid">

                    <Summary
                        label="Revenue"
                        value={value(
                            "Revenue",
                            "revenue"
                        )}
                    />

                    <Summary
                        label="Net Income"
                        value={value(
                            "Net Income",
                            "NetIncome",
                            "net_income"
                        )}
                    />

                    <Summary
                        label="Operating Margin"
                        value={value(
                            "Operating Margin",
                            "OperatingMarginTTM"
                        )}
                    />

                    <Summary
                        label="Dividend Yield"
                        value={value(
                            "Dividend Yield",
                            "DividendYield"
                        )}
                    />

                    <Summary
                        label="Total Assets"
                        value={value(
                            "Total Assets",
                            "TotalAssets"
                        )}
                    />

                    <Summary
                        label="Total Liabilities"
                        value={value(
                            "Total Liabilities",
                            "TotalLiabilities"
                        )}
                    />

                    <Summary
                        label="Debt / Asset"
                        value={value(
                            "Debt-to-Asset",
                            "DebtToAsset"
                        )}
                    />

                    <Summary
                        label="Current Ratio"
                        value={value(
                            "Current Ratio",
                            "CurrentRatio"
                        )}
                    />

                </div>

            </div>


            {/* RISK */}

            <div className="professional-card">

                <div className="card-header">

                    <div>

                        <h3>
                            Risk Analysis
                        </h3>

                        <p>
                            Overall financial risk assessment
                        </p>

                    </div>

                </div>


                <div className="risk-grid">

                    <Metric
                        title="Risk Score"
                        value={
                            risk.score ??
                            risk.risk_score ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Risk Level"
                        value={
                            risk.level ??
                            risk.risk_level ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Volatility"
                        value={
                            risk.volatility ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Anomaly Rate"
                        value={
                            risk.anomaly_rate ??
                            "N/A"
                        }
                    />

                </div>

            </div>


            {/* SENTIMENT */}

            <div className="professional-card">

                <div className="card-header">

                    <div>

                        <h3>
                            Market Sentiment
                        </h3>

                        <p>
                            News sentiment analysis
                        </p>

                    </div>

                </div>


                <div className="risk-grid">

                    <Metric
                        title="Positive"
                        value={
                            sentiment.positive ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Negative"
                        value={
                            sentiment.negative ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Neutral"
                        value={
                            sentiment.neutral ??
                            "N/A"
                        }
                    />

                    <Metric
                        title="Average Sentiment"
                        value={
                            sentiment.average ??
                            "N/A"
                        }
                    />

                </div>

            </div>

        </section>
    );
}


/* ==========================================
   COMPONENTS
========================================== */

function Metric({
    title,
    value
}) {

    return (

        <div className="metric-box">

            <span>
                {title}
            </span>

            <strong>
                {typeof value === "number"
                    ? value.toLocaleString(
                        undefined,
                        {
                            maximumFractionDigits: 2
                        }
                    )
                    : value}
            </strong>

        </div>
    );
}


function Summary({
    label,
    value
}) {

    return (

        <div className="summary-box">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}


export default Analysis;