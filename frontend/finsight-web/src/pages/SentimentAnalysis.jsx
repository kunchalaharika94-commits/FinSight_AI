import Navbar from "../components/Navbar";

function SentimentAnalysis() {
    return (
        <div className="page">


            <main className="container section">

                <div className="analysis-header">
                    <h1>News Sentiment Analysis</h1>
                    <p>
                        Analyze financial news and understand market sentiment.
                    </p>
                </div>

                <div className="analysis-grid">

                    <div className="card metric-card">
                        <h3>Overall Sentiment</h3>
                        <div className="metric positive">Positive</div>
                    </div>

                    <div className="card metric-card">
                        <h3>Positive News</h3>
                        <div className="metric">68%</div>
                    </div>

                    <div className="card metric-card">
                        <h3>Negative News</h3>
                        <div className="metric">14%</div>
                    </div>

                </div>

                <div className="card" style={{ marginTop: "25px" }}>

                    <h3>Recent Financial News</h3>

                    <div style={{ marginTop: "20px" }}>

                        <div className="card" style={{ marginBottom: "12px" }}>
                            <h4>Market shows positive investor sentiment</h4>
                            <p style={{
                                color: "var(--muted)",
                                marginTop: "8px"
                            }}>
                                Positive
                            </p>
                        </div>

                        <div className="card">
                            <h4>Technology sector maintains growth outlook</h4>
                            <p style={{
                                color: "var(--muted)",
                                marginTop: "8px"
                            }}>
                                Positive
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SentimentAnalysis;