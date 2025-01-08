document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");

    if (!city) {
        alert("No city specified. Redirecting to search page.");
        window.location.href = "/search.html";
        return;
    }

    document.getElementById("cityTitle").textContent = `Weather in ${city}`;

    async function fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        return data;
    }

    async function updateWeatherDetails() {
        try {
            const weatherData = await fetchData(`/api/weather?city=${encodeURIComponent(city)}`);
            console.log('Received weather data:', weatherData);

            const elements = ['temperature', 'feels_like', 'temp_min', 'temp_max', 'humidity', 'pressure', 'description'];
            elements.forEach(el => {
                const element = document.getElementById(el);
                if (element) {
                    let value = weatherData[el];
                    if (typeof value === 'number' && el !== 'humidity' && el !== 'pressure') {
                        value = value.toFixed(1);
                    }
                    element.textContent = value;
                    element.classList.add('animate-fadeIn');
                }
            });

            const iconElement = document.getElementById('weather-icon');
            if (iconElement && weatherData.icon) {
                iconElement.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
                iconElement.classList.add('animate-fadeIn');
            }

            // Capitalize the first letter of the description
            const descriptionElement = document.getElementById('description');
            if (descriptionElement) {
                descriptionElement.textContent = weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1);
            }
        } catch (err) {
            console.error("Error fetching weather data:", err);
            alert(`Failed to load weather data: ${err.message}`);
        }
    }

    async function initializeMap() {
        try {
            const coordinates = await fetchData(`/api/geo?city=${encodeURIComponent(city)}`);
            console.log('Received coordinates:', coordinates);

            if (!coordinates.latitude || !coordinates.longitude) {
                throw new Error('Invalid coordinates received');
            }

            const map = L.map("map").setView([coordinates.latitude, coordinates.longitude], 10);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([coordinates.latitude, coordinates.longitude]).addTo(map)
                .bindPopup(`<b>${city}</b>`)
                .openPopup();
        } catch (err) {
            console.error("Error loading map:", err);
            alert(`Failed to load map: ${err.message}`);
            document.getElementById('map').innerHTML = '<p class="text-white text-center">Failed to load map</p>';
        }
    }

    try {
        await updateWeatherDetails();
        await initializeMap();
    } catch (err) {
        console.error("General error:", err);
    }
});

