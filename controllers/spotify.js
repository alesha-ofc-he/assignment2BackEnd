const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: 'c80bd39bce774dedbc11dca5aaa6c466',
  clientSecret: '3fa76398e81a402eb3287fe5150490ed',
  redirectUri: 'http://localhost:3000/spotify/callback'
});

router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'streaming', 'user-modify-playback-state'];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    req.session.spotifyToken = access_token;
    res.redirect('/spotify.html');
  } catch (err) {
    console.error('Error in /callback:', err);
    res.redirect('/#/error/invalid token');
  }
});

router.get('/token', (req, res) => {
  if (req.session.spotifyToken) {
    res.json({ token: req.session.spotifyToken });
  } else {
    res.status(401).json({ error: 'No token available' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const data = await spotifyApi.searchTracks(query);
    res.json(data.body.tracks.items);
  } catch (err) {
    console.error('Error in /search:', err);
    res.status(500).json({ error: 'Error searching tracks' });
  }
});

module.exports = router;

