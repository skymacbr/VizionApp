const CACHE = 'vizion-kiosk-cache-v1';

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                './',
                './index.html'
            ]);
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE).map(k => caches.delete(k))
            )
        )
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, resClone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});