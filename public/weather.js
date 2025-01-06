const express = require('express');
const router = express.Router();
const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b'; // Замените на ваш API-ключ OpenWeather

async function fetchWeatherData() {    
    // fetch(URL)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Обновляем UI данными о погоде
    //         temperature = data.main.temp;
    //         feels_like = data.main.feels_like;
    //         description = data.weather[0].description;
    //         humidity = data.main.humidity;
    //         pressure = data.main.pressure;
    //         wind_speed.textContent = data.wind.speed;

    //         // Обновляем иконку погоды
    //         const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    //         document.getElementById('weather-icon').src = iconUrl;
    //     })
    //     .catch(error => {
    //         console.error('Ошибка запроса:', error);
    //         alert('Не удалось загрузить данные. Проверьте API-ключ и название города.');
    //     });
}

router.get('/', async (req, res) => {
    const city = req.query.city;
    console.log(city);
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(URL);
        // if (!response.ok) {
        //     throw new Error("Something went wrong");
        // }
        const data = await response.json();

        temperature = data.main.temp;
        feels_like = data.main.feels_like;
        description = data.weather[0].description;
        humidity = data.main.humidity;
        pressure = data.main.pressure;
        wind_speed = data.wind.speed;

        res.json({
            temperature: temperature,
            feels_like: feels_like,
            description: description,
            humidity: humidity,            
            pressure: pressure,
            wind_speed: wind_speed
        });
    }
    catch(err) {
        console.error("something went wrong, " + err);
        res.status(400).json({message: "Something went wrong!"});
    }
});

module.exports = router;