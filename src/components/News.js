import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './News.css';

const languages = {
  Arabic: 'ar',
  Chinese: 'zh',
  Dutch: 'nl',
  English: 'en',
  Finnish: 'fi',
  French: 'fr',
  German: 'de',
  Hindi: 'hi',
  Italian: 'it',
  Japanese: 'ja',
  Korean: 'ko',
  Malay: 'msa',
  Portuguese: 'pt',
  Russian: 'ru',
  Spanish: 'es'
};

const categories = [
  "regional",
  "technology",
  "lifestyle",
  "business",
  "general",
  "programming",
  "science",
  "entertainment",
  "world",
  "sports",
  "finance",
  "academia",
  "politics",
  "health",
  "opinion",
  "food",
  "game"
];

const News = () => {
  const [news, setNews] = useState([]);
  const [language, setLanguage] = useState('en');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/news/${endpoint}`, {
        params
      });
      setNews(response.data.news);
    } catch (error) {
      setError('Failed to fetch news. Please try again later.');
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  const handleSearchNews = () => {
    fetchNews('search', { language, category });
  };

  const handleLatestNews = () => {
    fetchNews('latest');
  };

  useEffect(() => {
    handleSearchNews();
  }, [language, category]);

  return (
    <div>
      <Navbar />
      <div className="news-container">
        <h2>News</h2>
        <div className="filter-container">
          <div>
            <label>Language: </label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {Object.keys(languages).map((key) => (
                <option key={key} value={languages[key]}>{key}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Category: </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSearchNews}>Search News</button>
          <button onClick={handleLatestNews}>Latest News</button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="news-list">
            {news.map((article, index) => (
              <div key={index} className="news-item">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                {article.image && <img src={article.image} alt={article.title} />}
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
