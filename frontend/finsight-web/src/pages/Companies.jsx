// src/pages/Companies.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicker } from '../context/TickerContext';
import { COMPANIES } from '../data/companies';

export default function Companies() {
    const [query, setQuery] = useState('');
    const { updateTicker } = useTicker();
    const navigate = useNavigate();

    const filtered = COMPANIES.filter(
        (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.ticker.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (ticker, name) => {
        updateTicker(ticker,name);
        navigate('/Dashboard');
    };

    return (
        <div className="analysis-page">
            <div className="page-header">
                <h1>Companies</h1>
                <p>Choose a company to analyze, or search by name or ticker.</p>
            </div>

            <div className="company-search-card">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by company name or ticker..."
                    className="company-input"
                    style={{ width: '100%' }}
                />
            </div>

            
<div className="company-list">
    {filtered.length === 0 ? (
        <div className="company-not-found">
            <h3>Company not found</h3>
            <p>
                We couldn't find "{query}" in our company list.
                Search Google for its stock ticker symbol and try again.
            </p>

            {query.trim() !== '' && (
                <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                        query + ' stock ticker symbol'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-search-link"
                >
                    Search Google for ticker symbol ↗
                </a>
            )}
        </div>
    ) : (
        filtered.map((c) => (
            <button
                key={c.ticker}
                className="company-row"
                onClick={() => handleSelect(c.ticker, c.name)}
            >
                <span className="company-row-name">{c.name}</span>
                <span className="company-row-ticker">{c.ticker}</span>
            </button>
        ))
    )}
</div>

            
        </div>
    );
}