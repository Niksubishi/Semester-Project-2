import "../style.css";
import router from "./router.js";
import { updateAuthState } from "./utils/authguard.js";
import { initNav } from "./ui/components/nav.js";
import { initLazyLoading, optimizeExistingImages, observeNewImages } from "./utils/imageOptimization.js";
import { initPWAInstall } from "./utils/serviceWorker.js";
import { initFormValidation } from "./utils/formValidation.js";
import GlobalErrorHandler from "./utils/errorHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize core functionality
  updateAuthState();
  initNav();
  router();

  // Initialize image optimization
  optimizeExistingImages();
  initLazyLoading();
  observeNewImages();

  // Initialize form validation
  initFormValidation();

  // Register service worker for offline functionality (temporarily disabled for debugging)
  // await registerServiceWorker();

  // Initialize PWA install prompt
  initPWAInstall();
});
