const express = require('express');
const app = express();
const PORT = 3000;
const weather = require('./controllers/weather');
const geolocation = require('./controllers/geolocation');

app.get('/', (req, res) => {
    res.sendFile('/public/index.html');
});

app.use('/weather', weather);

app.use('/geo', geolocation);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});

