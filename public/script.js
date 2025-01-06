const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b'; // Замените на ваш API-ключ OpenWeather
const CITY = 'Astana'; // Указываем название города
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
});

function fetchWeatherData() {
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Обновляем UI данными о погоде
            document.getElementById('temperature').textContent = data.main.temp;
            document.getElementById('feels-like').textContent = data.main.feels_like;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = data.main.humidity;
            document.getElementById('pressure').textContent = data.main.pressure;
            document.getElementById('wind-speed').textContent = data.wind.speed;

            // Обновляем иконку погоды
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('weather-icon').src = iconUrl;
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            alert('Не удалось загрузить данные. Проверьте API-ключ и название города.');
        });
}
