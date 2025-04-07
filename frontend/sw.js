const CACHE_NAME = 'misumi-bus-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './data/sample_bus_timetable.json',
  './data/sample_holidays.json'
];

// インストール時にキャッシュを作成
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時にキャッシュから読み込み
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        
        // キャッシュになければネットワークからフェッチしてキャッシュに追加
        return fetch(event.request)
          .then(response => {
            // 無効なレスポンス（404など）は除外
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスはストリームなので複製する必要がある
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // 静的ファイルとデータファイルのみキャッシュする
                if (event.request.url.includes('.css') || 
                    event.request.url.includes('.js') || 
                    event.request.url.includes('.json') || 
                    event.request.url.includes('.html') ||
                    event.request.url.includes('.png')) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          });
      })
      .catch(error => {
        // オフライン時のフォールバック処理
        console.log('Fetch failed:', error);
        // ここでオフライン用のフォールバックページを返すことも可能
      })
  );
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
