// Service Worker for offline functionality
const CACHE_NAME = 'limbstim-app-v1';
const BASE_HREF = '/app/';
const OFFLINE_URL = BASE_HREF + 'offline.html';

// Assets to cache for offline use
const ASSETS_TO_CACHE = [
  BASE_HREF,
  BASE_HREF + 'index.html',
  BASE_HREF + 'main.dart.js',
  BASE_HREF + 'flutter.js',
  BASE_HREF + 'flutter_bootstrap.js',
  BASE_HREF + 'manifest.json',
  BASE_HREF + 'favicon.png',
  BASE_HREF + 'icons/Icon-192.png',
  BASE_HREF + 'icons/Icon-512.png',
  BASE_HREF + 'icons/Icon-maskable-192.png',
  BASE_HREF + 'icons/Icon-maskable-512.png',
  BASE_HREF + 'assets/AssetManifest.json',
  BASE_HREF + 'assets/AssetManifest.bin',
  BASE_HREF + 'assets/AssetManifest.bin.json',
  BASE_HREF + 'assets/FontManifest.json',
  BASE_HREF + 'assets/NOTICES',
  BASE_HREF + 'assets/shaders/ink_sparkle.frag',
  BASE_HREF + 'assets/assets/buttons.json',
  BASE_HREF + 'assets/assets/buttons-draft.json',
  BASE_HREF + 'assets/assets/coloured_limbstim.png',
  BASE_HREF + 'assets/assets/coloured_limbstimold.png',
  BASE_HREF + 'assets/assets/coloured_limbstimoldish.png',
  BASE_HREF + 'assets/assets/limbstim_texture.png',
  BASE_HREF + 'assets/assets/cube.mtl',
  BASE_HREF + 'assets/assets/cube.obj',
  BASE_HREF + 'assets/assets/tetrahedron_c1.mtl',
  BASE_HREF + 'assets/assets/tetrahedron_c1.obj',
  BASE_HREF + 'assets/assets/tetrahedron_c2.mtl',
  BASE_HREF + 'assets/assets/tetrahedron_c2.obj',
  BASE_HREF + 'assets/assets/tetrahedron_c4.mtl',
  BASE_HREF + 'assets/assets/tetrahedron_c4.obj',
  BASE_HREF + 'assets/assets/tetrahedron_c5.mtl',
  BASE_HREF + 'assets/assets/tetrahedron_c5.obj',
  OFFLINE_URL
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting on install');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests that don't start with BASE_HREF, redirect to BASE_HREF
  if (event.request.mode === 'navigate' && !event.request.url.includes(BASE_HREF)) {
    const url = new URL(event.request.url);
    if (url.pathname === '/' || url.pathname === '') {
      event.respondWith(Response.redirect(BASE_HREF, 302));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            // Cache the fetched resource for future offline use
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache requests within our base href
                if (event.request.url.includes(BASE_HREF)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Network failed, try to serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            // For other requests, we might want to return a default asset
            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for when the app comes back online
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Add any background sync logic here
      Promise.resolve()
    );
  }
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  // Handle push notifications here if needed
});
