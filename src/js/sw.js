/**
 * Service Worker for YoBid Auction Website
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'yobid-v1';
const STATIC_CACHE = 'yobid-static-v1';
const DYNAMIC_CACHE = 'yobid-dynamic-v1';
const API_CACHE = 'yobid-api-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/js/main.js',
  '/src/assets/images/logo.png',
  '/src/assets/images/noimage.png',
  '/src/assets/fonts/Jost-Regular.ttf',
  '/src/assets/fonts/Jost-Medium.ttf',
  '/src/assets/fonts/Jost-SemiBold.ttf',
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://v2.api.noroff.dev/auction/listings',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle network requests
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.url.includes('/src/assets/') ||
         request.url.includes('.css') ||
         request.url.includes('.js') ||
         request.url.includes('.png') ||
         request.url.includes('.jpg') ||
         request.url.includes('.svg') ||
         request.url.includes('.ttf');
}

/**
 * Check if request is for API
 */
function isAPIRequest(request) {
  return request.url.includes('v2.api.noroff.dev');
}

/**
 * Check if request is navigation request
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

/**
 * Handle static asset requests - Cache First strategy
 */
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return fallback for critical assets
    if (request.url.includes('.png') || request.url.includes('.jpg')) {
      return caches.match('/src/assets/images/noimage.png');
    }
    throw error;
  }
}

/**
 * Handle API requests - Network First with cache fallback
 */
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful GET requests only
      if (request.method === 'GET') {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }

    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are currently offline. Some features may not be available.',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Handle navigation requests - Network First with HTML fallback
 */
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return caches.match('/index.html');
  } catch (error) {
    // Network failed, try cache or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return caches.match('/index.html');
  }
}

/**
 * Handle dynamic requests - Stale While Revalidate
 */
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await caches.match(request);

  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {
        // Ignore network errors for background updates
      });

    return cachedResponse;
  }

  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return generic offline response
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Background sync for form submissions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Handle background sync
 */
async function doBackgroundSync() {
  // Implement background sync logic here
  // For example, retry failed form submissions
  try {
    // Get pending requests from IndexedDB
    // Retry failed API calls
    // Clean up successful requests
  } catch (error) {
    // Handle sync errors
  }
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/src/assets/images/logo.png',
      badge: '/src/assets/images/logo.png',
      data: data.data,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

/**
 * Message handler for communication with main thread
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});