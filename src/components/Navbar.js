import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('mobileNumber');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">Farmer's Guide</div>
            <ul className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/weather">Weather</Link></li>
                        <li><Link to="/news">News</Link></li>       
                        <li><Link to="/query">Query</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
