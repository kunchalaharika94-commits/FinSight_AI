// src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicker } from '../context/TickerContext';

const Home = () => {
    const [inputTicker, setInputTicker] = useState('');
    const { updateTicker, isSampleData, ticker } = useTicker();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputTicker.trim()) {
            updateTicker(inputTicker);
            navigate('/dashboard'); // Redirect to dashboard to see results
        }
    };

    return (
        <div className="home-page">
            <h1>Welcome to FinSight AI</h1>
            <p>Enter a company ticker symbol to begin your financial analysis.</p>
            
            {isSampleData && (
                <div className="sample-banner">
                    ⚠️ Currently showing sample data for <strong>{ticker}</strong>. Enter a ticker below to run real analysis.
                </div>
            )}

            <form onSubmit={handleSubmit} className="ticker-form">
                <input 
                    type="text" 
                    placeholder="e.g., MSFT, GOOGL, TSLA" 
                    value={inputTicker}
                    onChange={(e) => setInputTicker(e.target.value)}
                    required
                />
                <button type="submit">Analyze Ticker</button>
            </form>
        </div>
    );
};

export default Home;