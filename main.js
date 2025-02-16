document.body.insertAdjacentHTML('afterbegin', '<p style="color:red;">Page Loaded</p>');

const CACHE_NAME = 'litterbox-cache-v1';
const urlsToCache = [
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
