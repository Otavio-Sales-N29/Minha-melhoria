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

const FazerGolBomDemais = {
    songName: 'Fazer Gol é Bom Demais',
    artist: 'FutParódias',
    file: 'FazerGolBomDemais',
    liked: false,
}

const FeioeFera = {
    songName: 'Desfile de moda é na passarela',
    artist: 'FutParódias',
    file: 'FeioeFera',
    liked: false,
}

const GIGANTESvsBAIXINHOS = {
    songName: 'GIGANTES vs BAIXINHOS ',
    artist: 'FutParódias',
    file: 'GIGANTES vs BAIXINHOS',
    liked: false,
}

const palmeirasxPenarol = {
    songName: 'Palmeiras x Peñarol na Libertadores',
    artist: 'FutParódias',
    file: 'PalmeirasxPeñarol',
    liked: false,
}

//divisão

const golAcrobatico = {
    songName: 'Gols acrobáticos',
    artist: 'FutParódias',
    file: 'SódeGolaçoAcrobático',
    liked: false,
}

const BatedeTrivela = {
    songName: 'Bate de Trivela',
    artist: 'FutParódias',
    file: 'BATE_DE_TRIVELA',
    liked: false,
}

const CANHOTOSxDESTROS = {
    songName: 'CANHOTOSxDESTROS',
    artist: 'FutParódias',
    file: 'CANHOTOSxDESTROS',
    liked: false,
}

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ??
    [CANHOTOSxDESTROS, golAcrobatico, BatedeTrivela, FazerGolBomDemais, FeioeFera, GIGANTESvsBAIXINHOS, palmeirasxPenarol];

let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill')
    play.querySelector('.bi').classList.add('bi-pause-circle-fill')
    song.play()
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill')
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill')
    song.pause()
    isPlaying = false
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active')
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active')
    }
}

function initializeSong() {
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();

    // Atualiza o background gradient baseado na capa
    cover.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(cover, 2); // pega 2 cores mais vibrantes

        const colorTop = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
        const colorBottom = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;

        // gradient vertical
        document.body.style.background = `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`;
    }
}



function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    initializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    }
    else {
        index += 1;
    }
    initializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active')
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active')
    }
}

function repeatButtonButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    } else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    // toggle no array visível
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;

    // sincroniza o originalPlaylist (fonte de verdade que será salva)
    const origIndex = originalPlaylist.findIndex(item => item.file === sortedPlaylist[index].file);
    if (origIndex !== -1) {
        originalPlaylist[origIndex].liked = sortedPlaylist[index].liked;
    }

    // persiste alteração
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));

    // reorganiza mantendo a música atual
    organizePlaylistByLikes();

    // atualiza o botão (ícone)
    likeButtonRender();
}

function organizePlaylistByLikes() {
    const currentSong = sortedPlaylist[index]; // salva qual música estava tocando
    sortedPlaylist.sort((a, b) => b.liked - a.liked); // coloca liked primeiro
    index = sortedPlaylist.findIndex(song => song.file === currentSong.file); // atualiza índice
}

function back5seconds() {
    song.currentTime = Math.max(0, song.currentTime - 5)
}

function skip5seconds() {
    song.currentTime = Math.min(song.duration, song.currentTime + 5);
}

// 🔹 chama a organização apenas após a função existir
organizePlaylistByLikes(); // organiza ao iniciar (se houver likes salvos)
initializeSong();

// event listeners
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
back5Sec.addEventListener('click', back5seconds);
skip5Sec.addEventListener('click', skip5seconds);







//if ('serviceWorker' in navigator) {
   // navigator.serviceWorker.register('./sw.js').then(() => {
   //   console.log('Service Worker registrado');
   // });}
  
