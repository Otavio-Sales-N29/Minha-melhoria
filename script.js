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
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const back5Sec = document.getElementById('back-5-seconds');
const skip5Sec = document.getElementById('skip-5-seconds');

const playlist = [
  { songName: 'Fazer Gol é Bom Demais', artist: 'FutParódias', file: 'FazerGolBomDemais', liked: false },
  { songName: 'Desfile de moda é na passarela', artist: 'FutParódias', file: 'FeioeFera', liked: false },
  { songName: 'GIGANTES vs BAIXINHOS', artist: 'FutParódias', file: 'GIGANTESvsBAIXINHOS', liked: false },
  { songName: 'Palmeiras x Peñarol na Libertadores', artist: 'FutParódias', file: 'PalmeirasxPeñarol', liked: false },
  { songName: 'Gols acrobáticos', artist: 'FutParódias', file: 'SódeGolaçoAcrobático', liked: false },
  { songName: 'Bate de Trivela', artist: 'FutParódias', file: 'BATE_DE_TRIVELA', liked: false },
  { songName: 'CANHOTOS x DESTROS', artist: 'FutParódias', file: 'CANHOTOSxDESTROS', liked: false },
];

let index = 0;
let isPlaying = false;

function initializeSong() {
  cover.src = `images/${playlist[index].file}.jpg`;
  song.src = `mysongs/${playlist[index].file}.mp3`;
  songName.innerText = playlist[index].songName;
  bandName.innerText = playlist[index].artist;
  likeButtonRender();

  cover.onload = () => {
    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(cover, 2);
      const top = `rgb(${palette[0][0]},${palette[0][1]},${palette[0][2]})`;
      const bottom = `rgb(${palette[1][0]},${palette[1][1]},${palette[1][2]})`;
      document.body.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;
    } catch (err) {
      console.log('Erro ao extrair cores', err);
    }
  };
}

function playSong() {
  play.querySelector('.bi').classList.remove('bi-play-circle-fill');
  play.querySelector('.bi').classList.add('bi-pause-circle-fill');
  song.play();
  isPlaying = true;
}

function pauseSong() {
  play.querySelector('.bi').classList.add('bi-play-circle-fill');
  play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  index = (index + 1) % playlist.length;
  initializeSong();
  playSong();
}

function previousSong() {
  index = (index - 1 + playlist.length) % playlist.length;
  initializeSong();
  playSong();
}

function likeButtonRender() {
  const liked = playlist[index].liked;
  likeButton.querySelector('.bi').classList.toggle('bi-heart-fill', liked);
  likeButton.querySelector('.bi').classList.toggle('bi-heart', !liked);
  likeButton.classList.toggle('button-active', liked);
}

function likeButtonClicked() {
  playlist[index].liked = !playlist[index].liked;
  likeButtonRender();
}

function updateProgress() {
  const width = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty('--progress', `${width}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function toHHMMSS(time) {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

back5Sec.addEventListener('click', () => song.currentTime = Math.max(0, song.currentTime - 5));
skip5Sec.addEventListener('click', () => song.currentTime = Math.min(song.duration, song.currentTime + 5));

play.addEventListener('click', playPauseDecider);
next.addEventListener('click', nextSong);
previous.addEventListener('click', previousSong);
likeButton.addEventListener('click', likeButtonClicked);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
song.addEventListener('ended', nextSong);

initializeSong();





//if ('serviceWorker' in navigator) {
   // navigator.serviceWorker.register('./sw.js').then(() => {
   //   console.log('Service Worker registrado');
   // });}
     
