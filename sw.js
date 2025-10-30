const cacheName = 'player-cache-v1';
const assetsToCache = [
  './index.html',
  './style.css',
  './script.js',
  './songs/FazerGolBomDemais.mp3',
  './songs/FeioeFera.mp3',
  './images/FazerGolBomDemais.jpg',
  './images/FeioeFera.jpg'
  // adicione todas as músicas e capas
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

