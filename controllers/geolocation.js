const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const API_KEY = process.env.WEATHER_API_KEY; // Using the same API key as weather

router.get('/', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        console.log(`Fetching coordinates for city: ${city}`);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
        console.log(`Request URL: ${url}`);

        const response = await fetch(url);
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Geolocation API error: ${response.status}`, errorBody);
            throw new Error(`Geolocation API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received geolocation data:', data);

        res.json({
            latitude: data.coord.lat,
            longitude: data.coord.lon
        });
    } catch (err) {
        console.error("Error fetching coordinates:", err);
        res.status(500).json({ error: 'Failed to fetch coordinates', details: err.message });
    }
});

module.exports = router;

