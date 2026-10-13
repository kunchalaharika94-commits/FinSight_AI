
import { createContext, useState, useContext } from 'react';

const TickerContext = createContext();

export const TickerProvider = ({ children }) => {
    const [ticker, setTicker] = useState('AAPL');
    const [companyName, setCompanyName] = useState('Apple Inc.');
    const [isSampleData, setIsSampleData] = useState(true);

    const updateTicker = (newTicker, newCompanyName = '') => {
        const cleanTicker = newTicker.trim().toUpperCase();

        setTicker(cleanTicker);
        setCompanyName(
            newCompanyName.trim() || cleanTicker
        );
        setIsSampleData(false);
    };

    return (
        <TickerContext.Provider
            value={{
                ticker,
                companyName,
                updateTicker,
                isSampleData
            }}
        >
            {children}
        </TickerContext.Provider>
    );
};

export const useTicker = () => useContext(TickerContext);
