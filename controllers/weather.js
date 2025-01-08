const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const API_KEY = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        
        res.json({
            temperature: Math.round(data.main.temp * 10) / 10,
            feels_like: Math.round(data.main.feels_like * 10) / 10,
            temp_min: Math.round(data.main.temp_min * 10) / 10,
            temp_max: Math.round(data.main.temp_max * 10) / 10,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        });
    } catch (err) {
        console.error("Error fetching weather:", err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;

