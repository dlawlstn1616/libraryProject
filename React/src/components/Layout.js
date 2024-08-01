import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import './Layout.css';
import { useAuth } from './AuthContext';

export default function Layout() {
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const homeOnclick = () => navigate('/');
    const loginOnclick = () => setShowLoginMenu(!showLoginMenu);

    const handleLogoutClick = () => {
        setShowLoginMenu(false);
        setIsAuthenticated(false);
        alert('로그아웃이 성공적으로 완료되었습니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('creatorId');
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/login');
        setShowLoginMenu(false);
    };

    return (
        <>
            <header className="library-header">
                <div className="library-home" onClick={homeOnclick}></div>
                <div className="library-login" onClick={loginOnclick}></div>
                <h1 className="library-title">LIBRARY</h1>
            </header>
            {showLoginMenu && (
                <div className="library-login-menu">
                    {isAuthenticated ? (
                        <button onClick={handleLogoutClick}>Logout</button>
                    ) : (
                        <button onClick={handleLoginClick}>Login</button>
                    )}
                </div>
            )}
            <main>
                <Outlet />
            </main>
        </>
    );
}