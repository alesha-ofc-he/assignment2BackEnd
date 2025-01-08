### README for Assignment 2: Back End Project

## Project Overview

This project is a back-end application developed as part of the IT 2307 group assignment. It integrates with various APIs to provide functionalities such as weather information, geolocation data, and Spotify management.

### Features

- **Weather Information**: Fetches real-time weather data for a specified city using the OpenWeatherMap API.
- **Geolocation Data**: Retrieves geolocation data for a given city using the PositionStack API.
- **Spotify Integration**: Provides Spotify account login, song search, and playback management using the Spotify Web API.

## Authors

- **Mertay Merekeev**
- **Alikhan Kasymbekov**
- **Arman Isaev**

## Group

- **IT 2307**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/assignment2-backend.git
cd assignment2-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

After installing the dependencies, you can start the server by running:

```bash
node index.js
```

The server will be available at `http://localhost:3000`.

## Usage

### Weather Information

1. Navigate to `http://localhost:3000/weather`.
2. Enter the name of a city and click "Search".
3. The weather information for the specified city will be displayed.

### Geolocation Data

1. Navigate to `http://localhost:3000/geo`.
2. Enter the name of a city and click "Search".
3. The geolocation data for the specified city will be displayed.

### Spotify Integration

1. Navigate to `http://localhost:3000/spotify`.
2. Click on "Login to Spotify".
3. Log in with the following Spotify account credentials:
   - Email: kassali2005@gmail.com
   - Password: Alikhan2311
4. After logging in, you can search for songs and manage playback.

## Project Structure

```bash
/Users/PC/IT-projects/aleshaAitu/backEnd/assigment2/
├── controllers/
│   ├── weather.js
│   ├── geolocation.js
│   ├── spotify.js
├── public/
│   ├── index.html
│   ├── search.html
│   ├── weather.html
│   ├── spotify.html
│   ├── script.js
│   ├── styles.css
├── .env
├── index.js
├── package.json
└── server.js
```

## API Endpoints

### Weather API

- `GET /weather/search?city={city_name}`: Fetches weather data for the specified city.

### Geolocation API

- `GET /geo/location?city={city_name}`: Retrieves geolocation data for the specified city.

### Spotify API

- `GET /spotify/login`: Redirects to Spotify login page.
- `GET /spotify/callback`: Handles Spotify authentication callback.
- `GET /spotify/token`: Retrieves the Spotify access token.
- `GET /spotify/search?query={search_query}`: Searches for tracks on Spotify.

---

This document provides an overview of the Assignment 2 back-end project and instructions for getting started with the project.
