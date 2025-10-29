// DOM elements
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const back5Sec = document.getElementById('back-5-seconds');
const skip5Sec = document.getElementById('skip-5-seconds');

// playlist (editar nomes de arquivos conforme sua pasta)
const playlist = [
  { songName: 'Fazer Gol é Bom Demais', artist: 'FutParódias', file: 'FazerGolBomDemais', liked: false },
  { songName: 'Desfile de moda é na passarela', artist: 'FutParódias', file: 'FeioeFera', liked: false },
  { songName: 'GIGANTES vs BAIXINHOS', artist: 'FutParódias', file: 'GIGANTESvsBAIXINHOS', liked: false },
  { songName: 'Palmeiras x Peñarol na Libertadores', artist: 'FutParódias', file: 'PalmeirasxPeñarol', liked: false },
  { songName: 'Gols acrobáticos', artist: 'FutParódias', file: 'SódeGolaçoAcrobático', liked: false },
  { songName: 'Bate de Trivela', artist: 'FutParódias', file: 'BATE_DE_TRIVELA', liked: false },
  { songName: 'CANHOTOSxDESTROS', artist: 'FutParódias', file: 'CANHOTOSxDESTROS', liked: false }
];

// carregar do localStorage ou usar padrão
let sortedPlaylist;
try {
  const saved = JSON.parse(localStorage.getItem('playlist'));
  sortedPlaylist = Array.isArray(saved) ? saved : [...playlist];
} catch {
  sortedPlaylist = [...playlist];
}

let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

// PLAY / PAUSE
function playSong() {
  const icon = play.querySelector('.bi');
  if (icon) {
    icon.classList.remove('bi-play-circle-fill');
    icon.classList.add('bi-pause-circle-fill');
  }
  song.play();
  isPlaying = true;
}
function pauseSong() {
  const icon = play.querySelector('.bi');
  if (icon) {
    icon.classList.remove('bi-pause-circle-fill');
    icon.classList.add('bi-play-circle-fill');
  }
  song.pause();
  isPlaying = false;
}
function playPauseDecider() { isPlaying ? pauseSong() : playSong(); }

// like button render
function likeButtonRender() {
  const icon = likeButton.querySelector('.bi');
  if (!icon) return;
  if (sortedPlaylist[index]?.liked) {
    icon.classList.remove('bi-heart');
    icon.classList.add('bi-heart-fill');
    likeButton.classList.add('button-active');
  } else {
    icon.classList.remove('bi-heart-fill');
    icon.classList.add('bi-heart');
    likeButton.classList.remove('button-active');
  }
}

// initialize song and update UI + gradient
function initializeSong() {
  if (!sortedPlaylist.length) return;
  const current = sortedPlaylist[index];
  cover.src = `images/${current.file}.jpg`;
  song.src = `songs/${current.file}.mp3`;
  songName.innerText = current.songName;
  bandName.innerText = current.artist;
  songTime.innerText = '00:00:00';
  totalTime.innerText = '00:00:00';
  likeButtonRender();

  // update gradient when cover loaded
  cover.onload = () => {
    try {
      if (typeof ColorThief !== 'undefined') {
        const ct = new ColorThief();
        const palette = ct.getPalette(cover, 2) || [[150,150,150],[20,20,20]];
        const top = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
        const bottom = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;
        document.body.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;
      }
    } catch (err) {
      // ColorThief pode falhar por CORS, mas não quebra o player
      console.warn('ColorThief error', err);
    }
  };
}

// prev / next
function previousSong() {
  index = index === 0 ? sortedPlaylist.length - 1 : index - 1;
  initializeSong();
  playSong();
}
function nextSong() {
  index = index === sortedPlaylist.length - 1 ? 0 : index + 1;
  initializeSong();
  playSong();
}

// progress updates
function updateProgress() {
  if (!song.duration || isNaN(song.duration)) return;
  const pct = (song.currentTime / song.duration) * 100;
  currentProgress.style.width = `${pct}%`;
  currentProgress.style.setProperty('--progress', `${pct}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}
function jumpTo(event) {
  const rect = progressContainer.getBoundingClientRect();
  const clientX = event.clientX || (event.touches && event.touches[0] && event.touches[0].clientX) || 0;
  const clickX = clientX - rect.left;
  const width = rect.width || 1;
  const time = (clickX / width) * song.duration;
  if (!isNaN(time)) song.currentTime = Math.max(0, Math.min(song.duration, time));
}

// format time
function toHHMMSS(sec) {
  if (!sec || isNaN(sec) || !isFinite(sec)) return '00:00:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

// 5s back / forward
function back5seconds() { song.currentTime = Math.max(0, song.currentTime - 5); }
function skip5seconds() { song.currentTime = Math.min(song.duration || Infinity, song.currentTime + 5); }

// like toggle + save + reorder
function likeButtonClicked() {
  if (!sortedPlaylist[index]) return;
  const current = sortedPlaylist[index];
  current.liked = !current.liked;
  // save sortedPlaylist directly
  localStorage.setItem('playlist', JSON.stringify(sortedPlaylist));
  // reorganize but keep playing song
  const playingFile = current.file;
  sortedPlaylist.sort((a,b) => (b.liked === a.liked) ? 0 : (b.liked ? 1 : -1));
  index = sortedPlaylist.findIndex(s => s.file === playingFile);
  likeButtonRender();
}

// shuffle (simple)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function shuffleButtonClicked() {
  if (!isShuffled) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add('button-active');
  } else {
    isShuffled = false;
    // reload from storage or original to reset order
    try {
      const saved = JSON.parse(localStorage.getItem('playlist'));
      sortedPlaylist = Array.isArray(saved) ? saved : [...playlist];
    } catch { sortedPlaylist = [...playlist]; }
    shuffleButton.classList.remove('button-active');
  }
  // keep index pointing to same file after shuffle would be better; skipping for simplicity
}

// repeat toggle
function repeatButtonClicked() {
  repeatOn = !repeatOn;
  repeatButton.classList.toggle('button-active', repeatOn);
}

// ended handler
function onEnded() {
  if (repeatOn) {
    song.currentTime = 0;
    playSong();
  } else nextSong();
}

// --- init
initializeSong();

// listeners
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('loadedmetadata', updateTotalTime);
song.addEventListener('ended', onEnded);
progressContainer.addEventListener('click', jumpTo);
progressContainer.addEventListener('touchstart', jumpTo); // mobile touch
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
back5Sec.addEventListener('click', back5seconds);
skip5Sec.addEventListener('click', skip5seconds);

      
