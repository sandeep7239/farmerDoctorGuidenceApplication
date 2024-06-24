import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [role, setRole] = useState('farmer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateMobileNumber = (number) => {
        if (!/^[6-9]/.test(number)) {
            return 'Mobile number is not valid.';
        }
        if (!/^\d{10}$/.test(number)) {
            return 'Mobile number must be exactly 10 digits.';
        }
        return '';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const errorMessage = validateMobileNumber(mobileNumber);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        setError('');
        try {
            await axios.post(`http://localhost:8080/api/${role}/login`, { mobileNumber });
            localStorage.setItem('mobileNumber', mobileNumber);
            localStorage.setItem('role', role);
            navigate('/verify-otp');
        } catch (error) {
            const errorMessage = error.response?.data || 'An error occurred during login';
            alert(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="login-label">Mobile Number</label>
                    <input
                        className="login-input"
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                    <label className="login-label">Role</label>
                    <select className="login-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="farmer">Farmer</option>
                        <option value="doctor">Doctor</option>
                    </select>
                    {error && <p className="login-error">{error}</p>}
                    <button className="login-button" type="submit">Send OTP</button>
                </form>
                <p className="login-register">Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    );
};

export default Login;
