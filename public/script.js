const API_KEY = 'f99b11d736cbef851acdf29b4c4b2c4b';
const CITY = 'Astana';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

let currentTrack;
let audio = new Audio();
let isPlaying = false;
let playlist = [];
let currentTrackIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    initializePlayer();
});

function fetchWeatherData() {
    fetch(WEATHER_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            gsap.to("#temperature", { textContent: Math.round(data.main.temp), duration: 1, ease: "power2.out" });
            gsap.to("#feels-like", { textContent: Math.round(data.main.feels_like), duration: 1, ease: "power2.out" });
            document.getElementById('description').textContent = data.weather[0].description;
            gsap.to("#humidity", { textContent: data.main.humidity, duration: 1, ease: "power2.out" });
            gsap.to("#pressure", { textContent: data.main.pressure, duration: 1, ease: "power2.out" });
            gsap.to("#wind-speed", { textContent: data.wind.speed, duration: 1, ease: "power2.out" });

            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('weather-icon').src = iconUrl;
            
            gsap.from(".weather-container", { opacity: 0, y: 20, duration: 1, ease: "power3.out" });
        })
        .catch(error => {
            console.error('Weather data fetch error:', error);
            alert('Failed to load weather data. Please check your API key and city name.');
        });
}

function initializePlayer() {
    document.getElementById('search-button').addEventListener('click', searchTracks);
    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('prev-button').addEventListener('click', playPreviousTrack);
    document.getElementById('next-button').addEventListener('click', playNextTrack);
    document.getElementById('progress-bar').addEventListener('input', seekToPosition);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextTrack);
    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchTracks();
        }
    });
}

function searchTracks() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    showLoading();

    fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';
            
            if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
                playlist = data.tracks.items.filter(track => track.preview_url);
                playlist.forEach((track, index) => {
                    const trackElement = document.createElement('div');
                    trackElement.classList.add('track-item', 'p-4', 'bg-white', 'bg-opacity-10', 'rounded-lg', 'mb-2', 'cursor-pointer', 'hover:bg-opacity-20', 'transition-all', 'duration-300');
                    trackElement.innerHTML = `
                        <div class="flex items-center">
                            <img src="${track.album.images[track.album.images.length-1].url}" 
                                 alt="${track.name}" class="w-12 h-12 rounded-md mr-4">
                            <div>
                                <h3 class="text-white font-semibold">${track.name}</h3>
                                <p class="text-gray-300 text-sm">${track.artists[0].name}</p>
                            </div>
                        </div>
                    `;
                    trackElement.addEventListener('click', () => playTrack(index));
                    resultsContainer.appendChild(trackElement);
                });

                gsap.from(".track-item", { 
                    opacity: 0, 
                    y: 20, 
                    stagger: 0.1, 
                    duration: 0.5, 
                    ease: "power2.out" 
                });
            } else {
                resultsContainer.innerHTML = '<div class="text-white p-4">No results found</div>';
            }
        })
        .catch(error => {
            console.error('Error searching tracks:', error);
            document.getElementById('search-results').innerHTML = `<div class="text-white p-4">Error searching tracks: ${error.error || error.message}</div>`;
        })
        .finally(() => {
            hideLoading();
        });
}

function playTrack(index) {
    currentTrackIndex = index;
    currentTrack = playlist[index];
    
    if (!currentTrack.preview_url) {
        alert('Sorry, this track does not have a preview available. Please try another one.');
        return;
    }
    
    audio.src = currentTrack.preview_url;
    audio.play()
        .then(() => {
            updatePlayerUI();
            animateTrackChange();
            updateBackgroundGradient();
            isPlaying = true;
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            alert('Unable to play this track. Please try another one.');
        });
}

function updatePlayerUI() {
    const player = document.getElementById('player');
    player.classList.remove('hidden');
    player.classList.add('visible');
    document.getElementById('song-title').textContent = currentTrack.name;
    document.getElementById('artist-name').textContent = currentTrack.artists[0].name;
    document.getElementById('album-cover').src = currentTrack.album.images[0].url;
    document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';

    gsap.to(player, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function seekToPosition() {
    const seekTime = audio.duration * (document.getElementById('progress-bar').value / 100);
    audio.currentTime = seekTime;
}

function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-bar').value = progress;
    document.getElementById('current-time').textContent = formatTime(audio.currentTime);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function animateTrackChange() {
    const albumCover = document.getElementById('album-cover');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');

    gsap.timeline()
        .to([albumCover, songTitle, artistName], { opacity: 0, y: -10, duration: 0.3 })
        .call(() => {
            albumCover.src = currentTrack.album.images[0].url;
            songTitle.textContent = currentTrack.name;
            artistName.textContent = currentTrack.artists[0].name;
        })
        .to([albumCover, songTitle, artistName], { opacity: 1, y: 0, duration: 0.3 });
}

function showLoading() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.classList.add('text-white', 'text-center', 'py-4');
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results').appendChild(loadingIndicator);
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

function updateBackgroundGradient() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = currentTrack.album.images[0].url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }
        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));
        document.body.style.background = `linear-gradient(45deg, rgb(${r},${g},${b}), rgb(${b},${r},${g}))`;
    };
}

// Prevent space key from triggering button clicks globally
document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT' && e.key === ' ') {
        e.preventDefault();
    }
});

