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

const playlist = [
  { songName: 'Fazer Gol é Bom Demais', artist: 'FutParódias', file: 'FazerGolBomDemais', liked: false },
  { songName: 'Desfile de moda é na passarela', artist: 'FutParódias', file: 'FeioeFera', liked: false },
  { songName: 'GIGANTES vs BAIXINHOS', artist: 'FutParódias', file: 'GIGANTESvsBAIXINHOS', liked: false },
  { songName: 'Palmeiras x Peñarol na Libertadores', artist: 'FutParódias', file: 'PalmeirasxPeñarol', liked: false },
  { songName: 'Gols acrobáticos', artist: 'FutParódias', file: 'SódeGolaçoAcrobático', liked: false },
  { songName: 'Bate de Trivela', artist: 'FutParódias', file: 'BATE_DE_TRIVELA', liked: false },
  { songName: 'CANHOTOSxDESTROS', artist: 'FutParódias', file: 'CANHOTOSxDESTROS', liked: false }
];

let sortedPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [...playlist];
let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

function playSong() {
  play.querySelector('.bi').classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
  song.play();
  isPlaying = true;
}

function pauseSong() {
  play.querySelector('.bi').classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  isPlaying ? pauseSong() : playSong();
}

function likeButtonRender() {
  const icon = likeButton.querySelector('.bi');
  if (sortedPlaylist[index].liked) {
    icon.classList.replace('bi-heart', 'bi-heart-fill');
    likeButton.classList.add('button-active');
  } else {
    icon.classList.replace('bi-heart-fill', 'bi-heart');
    likeButton.classList.remove('button-active');
  }
}

function initializeSong() {
  const current = sortedPlaylist[index];
  cover.src = `images/${current.file}.jpg`;
  song.src = `songs/${current.file}.mp3`;
  songName.innerText = current.songName;
  bandName.innerText = current.artist;
  likeButtonRender();

  cover.onload = () => {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(cover, 2);
    const colorTop = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
    const colorBottom = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;
    document.body.style.background = `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`;
  };
}

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

function updateProgress() {
  const progress = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty('--progress', `${progress}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  song.currentTime = (clickX / width) * song.duration;
}

function toHHMMSS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

function back5seconds() {
  song.currentTime = Math.max(0, song.currentTime - 5);
}

function skip5seconds() {
  song.currentTime = Math.min(song.duration, song.currentTime + 5);
}

function likeButtonClicked() {
  sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
  const original = playlist.find(p => p.file === sortedPlaylist[index].file);
  if (original) original.liked = sortedPlaylist[index].liked;
  localStorage.setItem('playlist', JSON.stringify(sortedPlaylist));
  organizePlaylistByLikes();
  likeButtonRender();
}

function organizePlaylistByLikes() {
  const current = sortedPlaylist[index];
  sortedPlaylist.sort((a, b) => b.liked - a.liked);
  index = sortedPlaylist.findIndex(s => s.file === current.file);
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('loadedmetadata', updateTotalTime);
song.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', jumpTo);
likeButton.addEventListener('click', likeButtonClicked);
back5Sec.addEventListener('click', back5seconds);
skip5Sec.addEventListener('click', skip5seconds);

      
