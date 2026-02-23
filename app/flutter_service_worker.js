'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b64e14720608e29b7da14c9234d2b912",
"assets/AssetManifest.bin.json": "6283fa45ec5ab17bebeaadd6dc031a93",
"assets/AssetManifest.json": "e5ea33527fc957c8a4563c1925b5418a",
"assets/assets/buttons-draft.json": "2eba41d1df65484f4abf388dd6815ed7",
"assets/assets/buttons-test.json": "11b6932a81494747fcb2456a308b9c5e",
"assets/assets/buttons.json": "2a2b52ae13c0112caebb24aabb67bd77",
"assets/assets/buttons_test.json": "7cb2afec51ea9f096a9148b889d8416e",
"assets/assets/color_buttons_test.json": "08dee31feed4338ad2d834b7ae1b1ed6",
"assets/assets/color_demo.json": "054533dd4e048482551def341c5db172",
"assets/assets/coloured_limbstim.png": "572e90bfa67a89efdef1390b87bbee01",
"assets/assets/coloured_limbstimold.png": "13d75bedc13a4f817f008e18c7e72898",
"assets/assets/coloured_limbstimoldish.png": "e97b21e4304b399dc7a7cebed8501b22",
"assets/assets/cube.mtl": "905f189b76776e87b764f0539d88f66b",
"assets/assets/cube.obj": "e34c4a7e373c46c301c395be6ae13e35",
"assets/assets/dynamic_orientation_test.json": "0ec5cf290a3e5e39c8d36b1b5f32cc35",
"assets/assets/gabor/hex_demo.json": "c28b39e23f1c86ee6905eb8533938d74",
"assets/assets/level_0_six_face_test.json": "63c8517c9d44a8391d450bcba582f7fe",
"assets/assets/limbstim_texture.png": "e8b2f6c2dbe12dbe679e31c69da9523c",
"assets/assets/orientation_test.json": "8c1f23a6167f056cd0372c37bfad1201",
"assets/assets/simple_condition_test.json": "6243d68c4a4f61e1e5b70a43ed00180c",
"assets/assets/super_simple_test.json": "819cd7ef2be276b9df942f6c1121b15b",
"assets/assets/test_1.1_self_testing.json": "1973bae8145ba7afe831cf999370b65c",
"assets/assets/test_5.1_world_gravity_revised.json": "6fbd5168baaaad49bb808f9f46285c86",
"assets/assets/test_7.0_orange.json": "0fb9bc2d13771626f8fddb25d51fcaf8",
"assets/assets/test_7.1.json": "b12dc835157ab918fe96a2f9e4417083",
"assets/assets/test_7.1_orange_up.json": "0448817d224d46af7e9994c5a226fe85",
"assets/assets/test_condition_button.json": "cac2df973a1e3d331ec53534861e0b95",
"assets/assets/test_config.json": "fc4a04a8b73df056737d3433d3e4e579",
"assets/assets/tetrahedron_c1.mtl": "f89aeeda6cbf09bb1feacb8c3593d508",
"assets/assets/tetrahedron_c1.obj": "5284f3e78d249f1ee22dc7685f61cda2",
"assets/assets/tetrahedron_c2.mtl": "0a2e17436d0f6d0582d52a9e67c73e72",
"assets/assets/tetrahedron_c2.obj": "46b80677b6bfcb595bf3585ae003f396",
"assets/assets/tetrahedron_c4.mtl": "3c15183bd40d6beaaddd7fc1d8e99e67",
"assets/assets/tetrahedron_c4.obj": "fd9580c20789d2ce38036cb0c9ac6383",
"assets/assets/tetrahedron_c5.mtl": "4135dad9d92da6d1e4804c783cf6d228",
"assets/assets/tetrahedron_c5.obj": "2a7587cc3b154f5cf1279f1ab9cd85b9",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "67461fe396afd9a954ed24bd48c2862b",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "abc0231dfdb0ef3a3f40f4aa5da9b286",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "1438403b89c502266359a304e047d3b2",
"/": "1438403b89c502266359a304e047d3b2",
"main.dart.js": "c5e81a17dac06128aed82cc1288ea0f5",
"manifest.json": "ac2590718b17cc9f3c7a57f94b21d9e9",
"offline.html": "77200c4a405f3e6a2e5234bde3d1ad25",
"sw.js": "89e3bf531cedfac28d0e2b2bd77ec4fd",
"version.json": "66abeaf5950d5a0fa6b7442a514f44bd"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
