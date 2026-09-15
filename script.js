javascriptconst playBtn = document.getElementById('play-btn');
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
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;
const CLIENT_ID = 'b67c4df6'; 

async function searchMusic(query) {
    if (!query) return;
    statusMsg.textContent = 'Ищем треки...';
    try {
        const response = await fetch(`https://jamendo.com{CLIENT_ID}&format=jsonfmt&limit=10&search=${encodeURIComponent(query)}&include=musicinfo`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            playlist = data.results.filter(track => track.audio);
            currentTrackIndex = 0;
            if (playlist.length > 0) {
                loadTrack(currentTrackIndex);
                playTrack();
                statusMsg.textContent = `Найдено ${playlist.length} треков`;
            } else { statusMsg.textContent = 'Файлы недоступны.'; }
        } else { statusMsg.textContent = 'Ничего не найдено.'; }
    } catch (error) { statusMsg.textContent = 'Ошибка сети.'; }
}

function loadTrack(index) {
    const track = playlist[index];
    trackTitle.textContent = track.name;
    trackArtist.textContent = track.artist_name;
    audio.src = track.audio;
    if (track.image) {
        trackArt.style.backgroundImage = `url('${track.image}')`;
        trackArt.innerHTML = '';
    } else {
        trackArt.style.backgroundImage = 'none';
        trackArt.innerHTML = '<i class="fas fa-music"></i>';
    }
    audio.volume = volumeSlider.value;
}

function playTrack() {
    isPlaying = true;
    audio.play();
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
    } else { playTrack(); }
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

function prevTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
}

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
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMusic(searchInput.value); });
