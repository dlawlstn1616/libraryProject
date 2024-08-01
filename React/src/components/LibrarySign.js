import React, { useState, useRef } from 'react';
import './LibrarySign.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LibrarySign() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        email: ''
    });

    const passwordRef = useRef(null);
    const emailRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            setFormData({
                ...formData,
                password: '',
                passwordConfirm: ''
            });
            passwordRef.current.focus();
            return;
        }

        if (formData.password.length < 8) {
            alert('비밀번호는 최소 8자 이상이어야 합니다.');
            setFormData({
                ...formData,
                password: '',
                passwordConfirm: ''
            });
            passwordRef.current.focus();
            return;
        }

        if (!validateEmail(formData.email)) {
            alert('유효한 이메일 주소를 입력하세요.');
            setFormData({
                ...formData,
                email: ''
            });
            emailRef.current.focus();
            return;
        }

        try {
            console.log('Form data being submitted:', formData); // 디버깅: 제출되는 폼 데이터 로그 출력
            const response = await axios.post('http://localhost:8080/api/joinProc', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response); // 디버깅: 서버로부터의 응답 로그 출력
            if (response.status === 201) {
                alert('가입이 성공적으로 완료되었습니다.');
                navigate('/login');
            } else {
                alert('가입에 실패했습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('이미 존재하는 아이디입니다.');
            } else {
                console.error('There was an error!', error); // 디버깅: 에러 로그 출력
                alert('가입 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="library-app">
                <div className="library-sign-container">
                    <div className="library-sign-form">
                        <div className="library-title">LIBRARY</div>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            className="library-input-field" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            className="library-input-field" 
                            value={formData.password} 
                            onChange={handleChange} 
                            ref={passwordRef} 
                            required
                        />
                        <input 
                            type="password" 
                            name="passwordConfirm" 
                            placeholder="Password Confirm" 
                            className="library-input-field" 
                            value={formData.passwordConfirm} 
                            onChange={handleChange} 
                            required
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className="library-input-field" 
                            value={formData.email} 
                            onChange={handleChange} 
                            ref={emailRef}
                            required
                        />
                        <button className="library-btn" type="submit">확인</button>
                    </div>
                </div>
            </div>
        </form>
    );
}
