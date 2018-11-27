let cacheName = 'v1';


// self.addEventListener('install', e => {
//   self.skipWaiting();
// })


self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {
      if (!res) {
        throw new Error('not found');
      }
      return res;
    }).catch(err => {
      return fetch(e.request).then(response => {
        const responseClone = response.clone();
        if (responseClone.ok) {
          caches.open(cacheName).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
    })
  );
});


// self.addEventListener('fetch', (e) => {
//   e.respondWith(
//     fetch(e.request).then(res => {
//       console.log(res)
//       if (!res.ok) {
//         throw new Error('not found');
//       }
//       const responseClone = res.clone();
//       caches.open(cacheName).then(cache => {
//         cache.put(e.request, responseClone);
//       });
//       return res;
//     }).catch(err => {
//       caches.match(e.request).then(res=>res);
//     })
//   );
// });


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (thisCacheName) {
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          //console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});