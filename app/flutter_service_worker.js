'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "5c94651d38fe2d9bf8f03b3473d9e0f4",
"assets/AssetManifest.bin.json": "15828248b16c6500e58ec96faf023991",
"assets/AssetManifest.json": "4a746e68840e850ec276f576db453bec",
"assets/assets/buttons-draft.json": "eff9a2ab17702a8e1fb892d47985cbd0",
"assets/assets/buttons-test.json": "11b6932a81494747fcb2456a308b9c5e",
"assets/assets/buttons.json": "5a9095ac8e01932b6fafcca73f94352a",
"assets/assets/buttons_test.json": "7cb2afec51ea9f096a9148b889d8416e",
"assets/assets/color_buttons_test.json": "08dee31feed4338ad2d834b7ae1b1ed6",
"assets/assets/color_demo.json": "054533dd4e048482551def341c5db172",
"assets/assets/coloured_limbstim.png": "572e90bfa67a89efdef1390b87bbee01",
"assets/assets/coloured_limbstimold.png": "13d75bedc13a4f817f008e18c7e72898",
"assets/assets/coloured_limbstimoldish.png": "e97b21e4304b399dc7a7cebed8501b22",
"assets/assets/cube.mtl": "905f189b76776e87b764f0539d88f66b",
"assets/assets/cube.obj": "e34c4a7e373c46c301c395be6ae13e35",
"assets/assets/dynamic_orientation_test.json": "0ec5cf290a3e5e39c8d36b1b5f32cc35",
"assets/assets/level_0_six_face_test.json": "63c8517c9d44a8391d450bcba582f7fe",
"assets/assets/limbstim_texture.png": "e8b2f6c2dbe12dbe679e31c69da9523c",
"assets/assets/orientation_test.json": "8c1f23a6167f056cd0372c37bfad1201",
"assets/assets/simple_condition_test.json": "6243d68c4a4f61e1e5b70a43ed00180c",
"assets/assets/super_simple_test.json": "819cd7ef2be276b9df942f6c1121b15b",
"assets/assets/test_1.1_self_testing.json": "1973bae8145ba7afe831cf999370b65c",
"assets/assets/test_5.1_world_gravity.json": "c79243f2bd61de6468eaf971e206aa40",
"assets/assets/test_5.1_world_gravity_revised.json": "381025fe51d7a67e1f806b4c1da2933a",
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
"assets/NOTICES": "6f786b07b0a6e6ada0ea46f88090f4d1",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"flutter_bootstrap.js": "06e95069eefca79bbc9929fb40e9c031",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "e0f59a850e48c3ffd2661574cc351e27",
"/": "e0f59a850e48c3ffd2661574cc351e27",
"main.dart.js": "221d0d7939b4aae064950f5fad8af2e9",
"manifest.json": "ac2590718b17cc9f3c7a57f94b21d9e9",
"offline.html": "77200c4a405f3e6a2e5234bde3d1ad25",
"sw.js": "324f2e466f0c69c9758b00e3cfc68a3c",
"version.json": "0d0986f2d8f0447d91e3b1bff5101787"};
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
