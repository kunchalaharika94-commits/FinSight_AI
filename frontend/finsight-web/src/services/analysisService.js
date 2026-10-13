// src/services/analysisService.js
import api from './api';

// ✅ Correctly named export that your pages expect
const analyzeStock = async (ticker) => {
    const response = await api.get(`/api/stock/${ticker}`);
    return response.data;
};

// Aliases so existing pages don't break
const getStockAnalysis = analyzeStock;

const getRiskAnalysis = async (ticker) => {
    const response = await api.get(`/api/risk/${ticker}`);
    return response.data;
};

const getFraudAnalysis = async (ticker) => {
    const response = await api.get(`/api/fraud/${ticker}`);
    return response.data;
};

const getForecast = async (ticker) => {
    const response = await api.get(`/api/forecast/${ticker}`);
    return response.data;
};

const getSentiment = async (ticker) => {
    const response = await api.get(`/api/sentiment/${ticker}`);
    return response.data;
};

const getInsights = async (ticker) => {
    const response = await api.get(`/api/insights/${ticker}`);
    return response.data;
};

export {
    analyzeStock,
    getStockAnalysis,
    getRiskAnalysis,
    getFraudAnalysis,
    getForecast,
    getSentiment,
    getInsights,
};

export default {
    analyzeStock,
    getStockAnalysis,
    getRiskAnalysis,
    getFraudAnalysis,
    getForecast,
    getSentiment,
    getInsights,
};
