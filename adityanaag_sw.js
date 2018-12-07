let cacheName = 'v3';

let mailData;
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
  console.log('active');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          //console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

var messagePort;

self.addEventListener('message', e => {
  mailData = e.data;
  messagePort = e.ports[0];
});


self.addEventListener('sync', (event) => {
  console.log('syncing', event.tag);
  if (event.tag == 'sendMail') {
    console.log(mailData);

    fetch(mailData.url, {
      method: 'POST',
      body: mailData.data
    }).then(res => {
      let status = 'success';
      res.json().then(response => {
        if (!response.ok) {
          status = 'fail';
        }
        const options = {
          body: status
        };
        self.registration.showNotification('your mail', options);
        messagePort.postMessage({
          "message": status
        });
      });
    });
  }
});

// getDataFromIndexedDb = () => {
//   var db;
//   var request = self.indexedDB.open("mailSyncDb", 1);

//   request.onerror = (e) => {
//     console.log("error: ");
//   };

//   var requestLocal = request
//   request.onsuccess = (e) => {
//     db = requestLocal.result;
//     var transaction = db.transaction(["mailData"]);
//     var objectStore = transaction.objectStore("mailData");
//     var request = objectStore.get(1);
//     request.onerror = (e) => {
//       console.log("Unable to retrieve daa from database!");
//     };

//     request.onsuccess = (e) => {
//       // Do something with the request.result!
//       if (request.result) {
//         console.log(request.result);
//       } else {
//         console.log("Kenny couldn't be found in your database!");
//       }
//     };
//   };
// }