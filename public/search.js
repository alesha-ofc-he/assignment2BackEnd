document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const cityInput = document.getElementById("cityInput");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            window.location.href = `/weather?city=${encodeURIComponent(city)}`;
        } else {
            alert("Please enter a city name");
        }
    });
});

