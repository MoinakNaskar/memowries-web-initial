'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "5088d8eb7a6d661ca42c8f3b208c4d09",
"version.json": "fea05e6cb340e5787d7eeab82374fdd6",
"index.html": "c0450e4ab030df6dbf49b0f07dbe964d",
"/": "c0450e4ab030df6dbf49b0f07dbe964d",
"main.dart.js": "b01155aafcbaccf976bd6da3477e7403",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"favicon.png": "04e6958df9d34ccbe4d797fe856793c3",
"icons/Icon-192.png": "c745f2f69724524a08df2fa7f1a06960",
"icons/Icon-maskable-192.png": "c745f2f69724524a08df2fa7f1a06960",
"icons/Icon-maskable-512.png": "145d4fff2c6a6788a9f32a64351b627c",
"icons/Icon-512.png": "145d4fff2c6a6788a9f32a64351b627c",
"assets/AssetManifest.json": "406dcb46b832ddee722619ec41537e86",
"assets/NOTICES": "7ea8f21895d47a7eeca722f71c162c6f",
"assets/FontManifest.json": "5c98a2e2eafae4d7df3bad642b55370c",
"assets/AssetManifest.bin.json": "f941c2e005f161d5046e419c775a6992",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "e2977fdee563c5bb82da57c1a67d91f6",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/assets/instant.png": "8fe41d7f60850dc9c24cbd01661e94fc",
"assets/assets/logo10.png": "8f764ce53dad6191079f23bc759a075d",
"assets/assets/chatscreen.png": "b02317596f0443ddb22ce616f10285c3",
"assets/assets/wheel.png": "cbaba16ff6d53dc0944de63bfce0fa63",
"assets/assets/privacy_policies_memow.txt": "8e5a45ed47c40559ba59b2b39dfbd2ec",
"assets/assets/find.png": "590c25a3e85b09e6da840bd4e1402fd7",
"assets/assets/spectrum.png": "a00385fd1b5ffdfd7f1a470a1d1ef930",
"assets/assets/linkdin.png": "d2b6c44104204eb1644c41e0382b9656",
"assets/assets/logo.png": "0e585f99d47b389ab6b9b28009db6cb4",
"assets/assets/cover2.jpeg": "516ca7edaf11a1a2c2a4b77e1123b12b",
"assets/assets/cover.jpeg": "d824aaf67b2c7466efc656f8e3ac3d32",
"assets/assets/mlocation.png": "687f67b8f2cd30ecba8e05a78e323edc",
"assets/assets/fonts/SanFranciscoText-Bold.ttf": "0082a6de83654bef5da5264e26da53d2",
"assets/assets/fonts/SanFranciscoText-Regular.ttf": "1dcaeb4b73c8753508cd921cd78a4e23",
"assets/assets/fonts/SanFranciscoDisplay-Regular.ttf": "9e14b4e72dec1db9a60d2636bbfe64f2",
"assets/assets/fonts/SanFranciscoDisplay-Bold.ttf": "a9e4f259deea0220b6c83a6bf626c06f",
"assets/assets/homescreen.png": "cc4770cfca42c69f849dd745e33fe1ac",
"assets/assets/socialmediaprofile.png": "a46adeccb2b5ff26766b8d652a6b8ba5",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
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
