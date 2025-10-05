/**
 * Service Worker registration and management
 */

import Logger from "./logger.js";

/**
 * Register service worker
 */
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./src/js/sw.js", {
        scope: "/",
      });

      Logger.info("Service Worker registered successfully:", registration);

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New content available
              showUpdateNotification();
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });

      return registration;
    } catch (error) {
      Logger.error("Service Worker registration failed:", error);
      return null;
    }
  } else {
    Logger.warn("Service Worker not supported");
    return null;
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  const notification = document.createElement("div");
  notification.className = "fixed bottom-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto";
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="font-medium">New version available!</p>
        <p class="text-sm opacity-90">Click to update the app</p>
      </div>
      <button id="update-btn" class="ml-4 bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100">
        Update
      </button>
      <button id="dismiss-btn" class="ml-2 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle update button
  document.getElementById("update-btn").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    notification.remove();
  });

  // Handle dismiss button
  document.getElementById("dismiss-btn").addEventListener("click", () => {
    notification.remove();
  });

  // Auto dismiss after 30 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 30000);
}

/**
 * Check if app is running in standalone mode (PWA)
 */
export function isPWA() {
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone ||
         document.referrer.includes("android-app://");
}

/**
 * Show install prompt for PWA
 */
export function initPWAInstall() {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    deferredPrompt = e;

    // Show install button if not already installed
    if (!isPWA()) {
      showInstallPrompt(deferredPrompt);
    }
  });

  window.addEventListener("appinstalled", () => {
    Logger.info("PWA was installed");
    deferredPrompt = null;
  });
}

/**
 * Show PWA install prompt
 */
function showInstallPrompt(deferredPrompt) {
  const installBanner = document.createElement("div");
  installBanner.className = "fixed top-4 left-4 right-4 bg-brand-nav text-brand-text p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto";
  installBanner.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="font-medium">Install YoBid</p>
        <p class="text-sm opacity-75">Get the full app experience</p>
      </div>
      <button id="install-btn" class="ml-4 bg-brand-text text-brand-nav px-4 py-2 rounded hover:opacity-90">
        Install
      </button>
      <button id="dismiss-install" class="ml-2 hover:opacity-75">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(installBanner);

  // Handle install button
  document.getElementById("install-btn").addEventListener("click", async() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      Logger.info("PWA install prompt outcome:", outcome);
      deferredPrompt = null;
    }
    installBanner.remove();
  });

  // Handle dismiss button
  document.getElementById("dismiss-install").addEventListener("click", () => {
    installBanner.remove();
  });

  // Auto dismiss after 10 seconds
  setTimeout(() => {
    if (installBanner.parentNode) {
      installBanner.remove();
    }
  }, 10000);
}

/**
 * Cache important resources
 */
export function cacheResources(urls) {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_URLS",
      urls: urls,
    });
  }
}

/**
 * Get cache usage information
 */
export async function getCacheInfo() {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota - estimate.usage,
        percentage: Math.round((estimate.usage / estimate.quota) * 100),
      };
    } catch (error) {
      Logger.error("Failed to get cache info:", error);
      return null;
    }
  }
  return null;
}
