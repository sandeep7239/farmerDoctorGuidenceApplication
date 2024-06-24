import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; 

const Registration = () => {
    const [name, setName] = useState('');
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

    const handleRegister = async (e) => {
        e.preventDefault();
        const errorMessage = validateMobileNumber(mobileNumber);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        setError('');
        try {
            await axios.post(`http://localhost:8080/api/${role}/register`, { name, mobileNumber });
            localStorage.setItem('mobileNumber', mobileNumber);
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data || 'An error occurred during registration';
            alert(errorMessage);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2 className="registration-title">Registration</h2>
                <form onSubmit={handleRegister}>
                    <label className="registration-label">Name</label>
                    <input
                        className="registration-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label className="registration-label">Mobile Number</label>
                    <input
                        className="registration-input"
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                    <label className="registration-label">Role</label>
                    <select className="registration-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="farmer">Farmer</option>
                        <option value="doctor">Doctor</option>
                    </select>
                    {error && <p className="registration-error">{error}</p>}
                    <button className="registration-button" type="submit">Register</button>
                </form>
                <p className="registration-login">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
};

export default Registration;
