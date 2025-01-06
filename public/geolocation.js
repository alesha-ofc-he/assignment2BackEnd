const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b';

router.get('/', (req, res) => {

});

router.get('/getCoordinates', async (req, res) => {
    const city = req.query.city;

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        // if (!response) {
        //     throw new Error("Something went wrong!");
        // }

        // console.log(response);

        const data = await response.json();

        console.log(data);
        
        const latitude = await data.results[0].geometry.location.lat;
        const longitude = await data.results[0].geometry.location.lng;

        res.json({
            latitude: latitude,
            longitude: longitude
        });
    }
    catch (err) {
        return res.status(400).json({ error: "Somethin went wrong!" });
    }
});

module.exports = router;