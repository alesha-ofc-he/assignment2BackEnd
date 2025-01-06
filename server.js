require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiryTime = null;

app.use(express.static('public'));

async function getAccessToken() {
    const currentTime = new Date();
    if (!accessToken || !tokenExpiryTime || currentTime >= tokenExpiryTime) {
        console.log('Fetching new access token');
        try {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'client_credentials'
                },
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            accessToken = response.data.access_token;
            // Set expiry time to 55 minutes (5 minutes before the actual expiry)
            tokenExpiryTime = new Date(currentTime.getTime() + 55 * 60 * 1000);
            console.log('New access token fetched, expires at:', tokenExpiryTime.toISOString());
        } catch (error) {
            console.error('Error getting access token:', error.response ? error.response.data : error.message);
            throw error;
        }
    } else {
        console.log('Using existing access token, expires at:', tokenExpiryTime.toISOString());
    }
    return accessToken;
}

app.get('/search', async (req, res) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': 'Bearer ' + token },
            params: {
                q: req.query.q,
                type: 'track',
                limit: 10
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching tracks:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            console.log('Received 401 error, forcing token refresh');
            accessToken = null;
            tokenExpiryTime = null;
            return res.status(307).json({ message: 'Token expired, please retry your request' });
        }
        res.status(error.response ? error.response.status : 500).json({ 
            error: 'Error searching tracks', 
            details: error.response ? error.response.data : error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});

