// Caché sencilla para usar la app sin conexión
const CACHE = "english-path-v9";
const IMGS = "english-path-img-v1"; // las imágenes se guardan aparte para no descargarlas otra vez en cada actualización
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== IMGS).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // las imágenes casi nunca cambian: primero la copia guardada
  if (url.origin === location.origin && url.pathname.includes("/img/")) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { const copy = r.clone(); caches.open(IMGS).then((c) => c.put(e.request, copy)); return r; })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
