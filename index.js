require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const weather = require('./controllers/weather');
const geolocation = require('./controllers/geolocation');
const spotify = require('./controllers/spotify');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true
}));

// API routes
app.use('/api/weather', weather);
app.use('/api/geo', geolocation);
app.use('/spotify', spotify);

// Main page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Weather page (weather.html)
app.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'weather.html'));
});

// Spotify page (spotify.html)
app.get('/spotify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'spotify.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

