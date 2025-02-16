const CACHE_NAME = 'litterbox-cache-v1';
const urlsToCache = [
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json'
];

console.log("[SW DEBUG] Service Worker script loaded.");

// Installation: cache all required assets.
self.addEventListener('install', function(event) {
  console.log("[SW DEBUG] Install event triggered.");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log("[SW DEBUG] Cache opened:", CACHE_NAME);
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log("[SW DEBUG] All assets cached:", urlsToCache);
          });
      })
      .catch(error => {
        console.error("[SW ERROR] Caching failed during install:", error);
      })
  );
});

// Fetch: serve from cache if available.
self.addEventListener('fetch', function(event) {
  console.log("[SW DEBUG] Fetch event for:", event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log("[SW DEBUG] Serving from cache:", event.request.url);
          return response;
        }
        console.log("[SW DEBUG] Fetching from network:", event.request.url);
        return fetch(event.request)
          .catch(error => {
            console.error("[SW ERROR] Network fetch failed:", error);
          });
      })
  );
});
