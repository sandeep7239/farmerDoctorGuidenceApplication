// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import OtpVerification from './components/OtpVerification';
import Home from './components/Home';
import News from './components/News';
import Weather from './components/Weather';
import Query from './components/Query';
import PrivateRoute from './components/PrivateRoute';
import DoctorHome from './components/DoctorHome';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-otp" element={<OtpVerification />} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
                <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} />
                <Route path="/query" element={<PrivateRoute><Query /></PrivateRoute>} />
                <Route path="/doctor-home" element={<PrivateRoute><DoctorHome /></PrivateRoute>} />
                <Route path="/" element={<Registration />} />
            </Routes>
        </Router>
    );
};

export default App;
