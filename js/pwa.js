
const CACHE_NAME = "wukongJS-pwa-v2";

const APP_PREFIX = "/wukongJS/";

const OFFLINE_PAGE = "/wukongJS/wukong-mobile.html";

const FILES_TO_CACHE = [
    "/wukongJS/",
    "/wukongJS/wukong-mobile.html",

    // CSS
    "/wukongJS/css/bootstrap.min.css",

    // JavaScript
    "/wukongJS/js/jquery.min.js",
    "/wukongJS/js/bootstrap.bundle.min.js",
    "/wukongJS/js/bots.js",
    "/wukongJS/js/play.js",

    // Logo
    "/wukongJS/logo/talkchess_logo.png",

    // Images
    "/wukongJS/Images/baihua.jpg",
    "/wukongJS/Images/5.gif",
    "/wukongJS/Images/4.gif",
    "/wukongJS/Images/3.gif",
    "/wukongJS/Images/2.gif",
    "/wukongJS/Images/hourglass.png",
    "/wukongJS/Images/10.gif",
    "/wukongJS/Images/8.gif",
    "/wukongJS/Images/9.gif",
    "/wukongJS/Images/11.gif",
    "/wukongJS/Images/12.gif",
    "/wukongJS/Images/7.gif",
    "/wukongJS/Images/0.gif",
    "/wukongJS/Images/1.gif",
    "/wukongJS/Images/6.gif",

    // Sounds
    "/wukongJS/Sounds/move.wav",
    "/wukongJS/Sounds/capture.wav"
];

// INSTALL
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            await cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(async keys => {
            await Promise.all(
                keys
                    .filter(key => key.startsWith("wukongJS-") && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener("fetch", event => {
    const request = event.request;

    // Only handle GET requests.
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Ignore requests to other origins.
    if (url.origin !== self.location.origin) return;

    // Ignore requests outside the application directory.
    if (!url.pathname.startsWith(APP_PREFIX)) return;

    // HTML navigation: NETWORK FIRST, CACHE FALLBACK.
    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const response = await fetch(request);

                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(request, response.clone());
                    }

                    return response;

                } catch (error) {
                    return await caches.match(request) ||
                           await caches.match(OFFLINE_PAGE) ||
                           new Response("You are offline.", {
                               status: 503,
                               headers: {
                                   "Content-Type": "text/plain"
                               }
                           });
                }
            })()
        );

        return;
    }

    // STATIC RESOURCES: CACHE FIRST, NETWORK FALLBACK.
    event.respondWith(
        (async () => {
            const cached = await caches.match(request);

            if (cached) {
                return cached;
            }

            try {
                const response = await fetch(request);

                if (response.ok && response.type === "basic") {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;

            } catch (error) {
                return new Response("Resource unavailable offline.", {
                    status: 503,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
            }
        })()
    );
});