// src/layouts/AuthLayout.jsx
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AuthLayout = () => {
    const token = sessionStorage.getItem('token');
    const location = useLocation();

    // Only redirect logged-in users away from login/register
    const authPages = ['/login', '/register'];
    if (token && authPages.includes(location.pathname)) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="auth-layout">
            <div className="auth-container">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;