// Service Worker for offline functionality
const CACHE_NAME = 'limbstim-app-0.598-fce2e37-20260903-094303';
const BASE_HREF = '/app/';
const OFFLINE_URL = BASE_HREF + 'offline.html';

// Core app files that are always needed
const CORE_ASSETS = [
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
  OFFLINE_URL
];

// Asset files - we'll try both paths
const ASSET_FILES = [
  'buttons.json',
  'buttons-draft.json',
  'coloured_limbstim.png',
  'coloured_limbstimold.png',
  'coloured_limbstimoldish.png',
  'limbstim_texture.png',
  'cube.mtl',
  'cube.obj',
  'tetrahedron_c1.mtl',
  'tetrahedron_c1.obj',
  'tetrahedron_c2.mtl',
  'tetrahedron_c2.obj',
  'tetrahedron_c4.mtl',
  'tetrahedron_c4.obj',
  'tetrahedron_c5.mtl',
  'tetrahedron_c5.obj'
];

// Generate asset URLs with both possible paths
const ASSETS_TO_CACHE = [
  ...CORE_ASSETS,
  // Try flat asset paths first (preferred)
  ...ASSET_FILES.map(file => BASE_HREF + 'assets/' + file),
  // Also include nested paths as fallback
  ...ASSET_FILES.map(file => BASE_HREF + 'assets/assets/' + file)
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Service Worker: Caching Core Assets');
        
        // Cache core assets first (these should always exist)
        await cache.addAll(CORE_ASSETS);
        
        // Cache asset files with fallback logic
        for (const assetFile of ASSET_FILES) {
          const flatPath = BASE_HREF + 'assets/' + assetFile;
          const nestedPath = BASE_HREF + 'assets/assets/' + assetFile;
          
          try {
            // Try flat path first
            const flatResponse = await fetch(flatPath);
            if (flatResponse.ok) {
              await cache.put(flatPath, flatResponse);
              console.log('Cached flat path:', flatPath);
            } else {
              throw new Error('Flat path not found');
            }
          } catch (error) {
            try {
              // Fall back to nested path
              const nestedResponse = await fetch(nestedPath);
              if (nestedResponse.ok) {
                await cache.put(nestedPath, nestedResponse);
                // Also cache it under the flat path for consistency
                await cache.put(flatPath, nestedResponse.clone());
                console.log('Cached nested path as both:', nestedPath, flatPath);
              }
            } catch (nestedError) {
              console.warn('Asset not found at either path:', assetFile);
            }
          }
        }
        
        console.log('Service Worker: All available assets cached');
      })
      .then(() => {
        console.log('Service Worker: Activating updated worker immediately');
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

  const requestUrl = new URL(event.request.url);
  const isAppShellRequest =
    requestUrl.pathname === BASE_HREF ||
    requestUrl.pathname === BASE_HREF + 'index.html' ||
    requestUrl.pathname === BASE_HREF + 'main.dart.js' ||
    requestUrl.pathname === BASE_HREF + 'flutter.js' ||
    requestUrl.pathname === BASE_HREF + 'flutter_bootstrap.js';

  // For navigation requests that don't start with BASE_HREF, redirect to BASE_HREF
  if (event.request.mode === 'navigate' && !event.request.url.includes(BASE_HREF)) {
    if (requestUrl.pathname === '/' || requestUrl.pathname === '') {
      event.respondWith(Response.redirect(BASE_HREF, 302));
      return;
    }
  }

  if (isAppShellRequest) {
    event.respondWith(
      fetch(event.request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }

          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(async (response) => {
        // Return cached version if found
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        // For asset requests, try alternative paths
        const url = new URL(event.request.url);
        if (url.pathname.includes('/assets/') && !url.pathname.includes('/assets/assets/')) {
          // If requesting flat path, also try nested path in cache
          const nestedPath = url.pathname.replace('/assets/', '/assets/assets/');
          const nestedUrl = url.origin + nestedPath;
          const nestedResponse = await caches.match(nestedUrl);
          if (nestedResponse) {
            console.log('Service Worker: Serving nested asset from cache:', nestedUrl);
            return nestedResponse;
          }
        }

        // Try to fetch from network
        try {
          const networkResponse = await fetch(event.request);
          
          // Don't cache if not a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = networkResponse.clone();

          // Cache the fetched resource for future offline use
          const cache = await caches.open(CACHE_NAME);
          if (event.request.url.includes(BASE_HREF)) {
            cache.put(event.request, responseToCache);
          }

          return networkResponse;
        } catch (networkError) {
          // Network failed, try alternative asset paths
          if (event.request.url.includes('/assets/') && !event.request.url.includes('/assets/assets/')) {
            // Try nested path
            const url = new URL(event.request.url);
            const nestedPath = url.pathname.replace('/assets/', '/assets/assets/');
            const nestedUrl = url.origin + nestedPath;
            
            try {
              const nestedResponse = await fetch(nestedUrl);
              if (nestedResponse.ok) {
                console.log('Service Worker: Found asset at nested path:', nestedUrl);
                return nestedResponse;
              }
            } catch (nestedError) {
              console.warn('Asset not found at nested path either:', nestedUrl);
            }
          }

          // Network failed completely
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
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

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Received message:', event.data);
  
  if (event.data && event.data.action === 'skipWaiting') {
    console.log('Service Worker: Skipping waiting as requested');
    self.skipWaiting();
  }
});
