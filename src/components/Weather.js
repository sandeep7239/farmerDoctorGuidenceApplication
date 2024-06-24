import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState("Bangalore");
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const apiUrl = `http://localhost:8080/api/weather?location=${city}`;

        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not get data");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setWeatherData(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [city]);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    return (
        <div>
            <Navbar />
            <div className="weather-container">
                <div className="weather-input">
                    <input
                        type="text"
                        placeholder="Enter Your City Name"
                        onChange={handleCityChange}
                        defaultValue=""
                    />
                </div>
                {weatherData && (
                    <div className="weather-content">
                        <div className="temperature">
                            <div className="temp-value">
                                {weatherData.current.temp_c}°C
                            </div>
                            <div className="condition">{weatherData.current.condition.text}</div>
                            <div className="location-time">
                                Today &#183; {weatherData.location.localtime} | {weatherData.location.name}
                            </div>
                        </div>
                        <div className="highlights">
                            <h1>Today's Highlights</h1>
                            <div className="highlight">
                                <h2>Wind Status</h2>
                                <div>{weatherData.current.wind_mph} mph {weatherData.current.wind_dir}</div>
                            </div>
                            <div className="highlight">
                                <h2>Humidity</h2>
                                <div>{weatherData.current.humidity} %</div>
                                <div className="humidity-bar">
                                    <div className="humidity-level" style={{ width: `${weatherData.current.humidity}%` }}></div>
                                </div>
                            </div>
                            <div className="highlight">
                                <h2>Visibility</h2>
                                <div>{weatherData.current.vis_miles} miles</div>
                            </div>
                            <div className="highlight">
                                <h2>Air Pressure</h2>
                                <div>{weatherData.current.pressure_mb} mb</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Weather;
