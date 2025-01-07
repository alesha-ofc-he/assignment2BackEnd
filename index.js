require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;
const weather = require('./controllers/weather');
const geolocation = require('./controllers/geolocation');
const spotify = require('./controllers/spotify');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/weather', weather);
app.use('/geo', geolocation);
app.use('/spotify', spotify);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

