import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OtpVerification.css'; // Import the CSS file for styling

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateMobileNumber = (number) => {
        const regex = /^\d{10}$/;
        return regex.test(number);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const mobileNumber = localStorage.getItem('mobileNumber');
        const role = localStorage.getItem('role');
        if (!validateMobileNumber(mobileNumber)) {
            setError('Invalid mobile number. Please login again.');
            return;
        }
        setError('');
        try {
            await axios.post(`http://localhost:8080/api/${role}/validate-otp`, { mobileNumber, otp });
            localStorage.setItem('isAuthenticated', 'true');
            navigate(role === 'farmer' ? '/home' : '/doctor-home');
        } catch (error) {
            const errorMessage = error.response?.data || 'An error occurred during OTP verification';
            alert(errorMessage);
        }
    };

    return (
        <div className="otp-verification-container">
            <div className="otp-verification-card">
                <h2 className="otp-verification-title">OTP Verification</h2>
                <form onSubmit={handleVerifyOtp}>
                    <label className="otp-verification-label">OTP</label>
                    <input
                        className="otp-verification-input"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    {error && <p className="otp-verification-error">{error}</p>}
                    <button className="otp-verification-button" type="submit">Verify OTP</button>
                </form>
                <p className="otp-verification-resend">Didn't receive an OTP? <a href="/register">Register again</a></p>
            </div>
        </div>
    );
};

export default OtpVerification;
