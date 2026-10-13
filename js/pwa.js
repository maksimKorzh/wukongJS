const CACHE_NAME = "wukongJS-pwa-v1";

const FILES_TO_CACHE = [
    "/wukongJS/",
    "/wukongJS/wukong-mobile.html",
    "/wukongJS/css/bootstrap.min.css",
    "/wukongJS/js/jquery.min.js",
    "/wukongJS/js/bootstrap.bundle.min.js",
    "/wukongJS/logo/talkchess_logo.png",
    "/wukongJS/Images/baihua.jpg",
    "/wukongJS/Images/5.gif",
    "/wukongJS/Images/4.gif",
    "/wukongJS/Images/3.gif",
    "/wukongJS/Images/2.gif",
    "/wukongJS/Images/hourglass.png",
    "/wukongJS/js/bots.js",
    "/wukongJS/js/play.js",
    "/wukongJS/Images/10.gif",
    "/wukongJS/Images/8.gif",
    "/wukongJS/Images/9.gif",
    "/wukongJS/Images/11.gif",
    "/wukongJS/Images/12.gif",
    "/wukongJS/Images/7.gif",
    "/wukongJS/Images/0.gif",
    "/wukongJS/Images/1.gif",
    "/wukongJS/Images/6.gif",
    "/wukongJS/Sounds/move.wav",
    "/wukongJS/Sounds/capture.wav"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    ); self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
          return Promise.all(
            keys
              .filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))
          );
        })
    ); self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});