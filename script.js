const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const trackArt = document.getElementById('track-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressBar = document.getElementById('progress-bar');
const progressArea = document.getElementById('progress-area');
const volumeSlider = document.getElementById('volume-slider');
const statusMsg = document.getElementById('status-msg');

const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;

// Встроенная стабильная база треков (разные жанры)
const mainLibrary = [
    {
        name: "Lost in the City Lights",
        artist: "Cosmo Sheldrake (Chill / Electronic)",
        audio: "https://soundhelix.com",
        image: "https://picsum.photos"
    },
    {
        name: "Cyberpunk Drive",
        artist: "Neon Vapor (Synthwave / Rock)",
        audio: "https://soundhelix.com",
        image: "https://picsum.photos"
    },
    {
        name: "Summer Breeze",
        artist: "Lo-Fi Beats (Chillhop / Pop)",
        audio: "https://soundhelix.com",
        image: "https://picsum.photos"
    },
    {
        name: "Dark Energy",
        artist: "Shadow Phase (Industrial / Rock)",
        audio: "https://soundhelix.com",
        image: "https://picsum.photos"
    },
    {
        name: "Atmospheric Horizon",
        artist: "Ambient Space (Electronic)",
        audio: "https://soundhelix.com",
        image: "https://picsum.photos"
    }
];

// При старте плейлист равен всей библиотеке
let playlist = [...mainLibrary];

function loadTrack(index) {
    if (playlist.length === 0) return;
    const track = playlist[index];
    trackTitle.textContent = track.name;
    trackArtist.textContent = track.artist;
    audio.src = track.audio;
    trackArt.style.backgroundImage = `url('${track.image}')`;
    trackArt.innerHTML = '';
    audio.volume = volumeSlider.value;
}

function playTrack() {
    isPlaying = true;
    audio.play().catch(e => {
        statusMsg.textContent = "Нажмите Play для воспроизведения";
    });
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    trackArt.classList.add('playing');
}

function togglePlay() {
    if (playlist.length === 0) return;
    if (isPlaying) {
        isPlaying = false;
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        trackArt.classList.remove('playing');
    } else { 
        playTrack(); 
    }
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function prevTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

// Функция мгновенного поиска по встроенной библиотеке
function searchMusic(query) {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
        playlist = [...mainLibrary];
        statusMsg.textContent = "Показаны все треки";
    } else {
        playlist = mainLibrary.filter(track => 
            track.name.toLowerCase().includes(cleanQuery) || 
            track.artist.toLowerCase().includes(cleanQuery)
        );
        
        if (playlist.length > 0) {
            statusMsg.textContent = `Найдено треков: ${playlist.length}`;
        } else {
            statusMsg.textContent = "Ничего не найдено. Сброс поиска...";
            playlist = [...mainLibrary];
        }
    }
    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
    playTrack();
}

// Инициализация плеера при загрузке страницы
loadTrack(currentTrackIndex);

// Обработчики событий
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
});

progressArea.addEventListener('click', (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.offsetX / progressArea.clientWidth) * audio.duration;
});

audio.addEventListener('ended', nextTrack);
volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

searchBtn.addEventListener('click', () => searchMusic(searchInput.value));
searchInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') searchMusic(searchInput.value); 
});
