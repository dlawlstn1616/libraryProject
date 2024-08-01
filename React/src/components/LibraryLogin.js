import React, { useState } from 'react';
import './LibraryLogin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function LibraryLogin() {
    const navigate = useNavigate();
    const signOnClick = () => navigate('/sign');

    const { setIsAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLoginSuccess = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData); // 폼 데이터 로그 출력
        try {
            const response = await axios.post(`http://localhost:8080/api/loginProc?username=${formData.username}&password=${formData.password}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response from server:", response); // 서버 응답 로그 출력
            if (response.data.status === 'success') {
                console.log("Login successful, setting authentication state."); // 성공 로그 출력
                alert('로그인이 성공적으로 완료되었습니다.');
                handleLoginSuccess(response.data.token, response.data.role);
                if(response.data.role === 'ROLE_ADMIN'){
                    localStorage.setItem('creatorId', response.data.username);
                }
            } else {
                console.log("Login failed, response data:", response.data); // 실패 로그 출력
                alert('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('There was an error during login:', error); // 에러 로그 출력
            alert('로그인에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="library-app">
                <div className="library-login-container">
                    <div className="library-login-form">
                        <div className="library-title">LIBRARY</div>
                        <input type="text" placeholder="Username" name="username" className="library-input-field" value={formData.username} onChange={handleChange} required/>
                        <input type="password" placeholder="Password" name="password" className="library-input-field" value={formData.password} onChange={handleChange} required/>
                        <div className="library-button-container">
                            <button type="button" className="library-btn" onClick={signOnClick}>회원가입</button>
                            <button type="submit" className="library-btn">로그인</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}