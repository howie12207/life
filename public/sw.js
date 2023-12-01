// self.addEventListener('install', function (event) {
//     console.log('[Service Worker] Installing Service Worker ...', event);
// });

// self.addEventListener('activate', () => {
//     // console.log('[Service Worker] Activating Service Worker ...', event);
//     return self.clients.claim();
// });

self.addEventListener('push', function (event) {
    const data = event.data.json();
    const promiseChain = self.registration
        .showNotification(data.title, data.option)
        .then(() => {
            // console.log('push success');
        })
        .catch(() => {
            // console.log('push fail');
        });
    event.waitUntil(promiseChain);
});
