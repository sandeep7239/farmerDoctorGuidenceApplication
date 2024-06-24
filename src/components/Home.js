import React from 'react';
import Navbar from './Navbar';
import DesignerImage from './Designer.jpeg';
import './Home.css';  

const Home = () => {
    return (
        <div className='home-container'>
            <Navbar />
            <div className='home-content'>
                <p>Welcome to the Farmer's Guide!</p>
                <img src={DesignerImage} alt="Farm Image" className="home-image" />
                {/* <div className="home-links">
                    <a href="/latest-news" className="home-link">Latest News</a>
                    <a href="/search-news" className="home-link">Search News</a>
                </div> */}
            </div>
        </div>
    );
};

export default Home;
