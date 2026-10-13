// src/services/authService.js
import api from './api';

const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/login', userData);
    if (response.data.access_token) {
        sessionStorage.setItem('token', response.data.access_token);
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('email', userData.email);
    }
    return response.data;
};

const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
};

const forgotPassword = async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
};

const verifyEmail = async (email) => {
    const response = await api.post('/verify-email', { email });
    return response.data;
};

const resetPassword = async ({ email, new_password }) => {
    const response = await api.post('/reset-password', {
        email,
        new_password,
    });
    return response.data;
};

export default { register, login, logout, verifyEmail, resetPassword };