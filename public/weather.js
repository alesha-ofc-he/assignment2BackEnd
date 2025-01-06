const express = require('express');
const router = express.Router();
const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b';

router.post('/getWeather', async (req, res) => {
    const city = req.query.city;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try  {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();

        console.log(data);

        const temperature = await data.main.temperature;
        const feels_like = await data.main.feels_like;
        const temp_min = await data.main.temp_min;
        const temp_max = await data.main.temp_max;
        const humidity = await data.main.humidity;
        const pressure = await data.main.pressure;

        res.json({
            temperature: temperature,
            feels_like: feels_like,
            temp_min: temp_min,
            temp_max: temp_max,
            humidity: humidity,
            pressure: pressure
        });
    }
    catch(err) {
        return res.status(400).json({ message: "Something went wrong"});
    }
});

module.exports = router;