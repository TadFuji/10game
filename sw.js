// Service Worker for 10を作れ (Make Ten)
const CACHE_NAME = 'make10-v1';
const urlsToCache = [
    '/10game/',
    '/10game/index.html',
    '/10game/style.css',
    '/10game/script.js',
    '/10game/manifest.json',
    '/10game/icons/icon-192.png',
    '/10game/icons/icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// フェッチ時にキャッシュ優先で返す
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュがあれば返す、なければネットワークから取得
                return response || fetch(event.request);
            })
    );
});
