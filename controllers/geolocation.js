const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b';

router.get('/', (req, res) => {

});

router.get('/getCoordinates', async (req, res) => {
    const city = req.query.city;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        console.log("OK");
        let data = await response.json();

        const latitude = await data.coord.lat;
        const longitude = await data.coord.lon;

        res.json({
            latitude: latitude,
            longitude: longitude
        });
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
});

module.exports = router;