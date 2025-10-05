/**
 * Image optimization utilities for lazy loading and responsive images
 */

/**
 * Lazy loading observer for images
 */
let imageObserver = null;

/**
 * Initialize lazy loading for images
 */
export function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: "50px 0px",
      threshold: 0.01,
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach(loadImage);
  }
}

/**
 * Load image and handle loading states
 * @param {HTMLImageElement} img - Image element to load
 */
function loadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {
    return;
  }

  // Add loading class
  img.classList.add("loading");

  // Create new image to preload
  const imageLoader = new Image();

  imageLoader.onload = () => {
    // Image loaded successfully
    img.src = src;
    img.classList.remove("loading");
    img.classList.add("loaded", "fade-in");
    img.removeAttribute("data-src");
  };

  imageLoader.onerror = () => {
    // Image failed to load
    img.classList.remove("loading");
    img.classList.add("error");
    img.src = "/src/assets/images/noimage.png"; // fallback image
    img.alt = "Image unavailable";
  };

  imageLoader.src = src;
}

/**
 * Create optimized image element
 * @param {Object} options - Image options
 * @returns {HTMLImageElement} - Optimized image element
 */
export function createOptimizedImage(options) {
  const {
    src,
    alt = "",
    className = "",
    width,
    height,
    lazy = true,
    fallback = "/src/assets/images/noimage.png",
  } = options;

  const img = document.createElement("img");

  if (lazy) {
    img.setAttribute("data-src", src);
    img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=";
  } else {
    img.src = src;
  }

  img.alt = alt;
  img.className = className;

  if (width) {
    img.width = width;
  }
  if (height) {
    img.height = height;
  }

  // Add error handling
  img.onerror = () => {
    img.src = fallback;
    img.alt = "Image unavailable";
    img.classList.add("fallback-image");
  };

  return img;
}

/**
 * Optimize existing images on the page
 */
export function optimizeExistingImages() {
  const images = document.querySelectorAll("img:not([data-optimized])");

  images.forEach(img => {
    // Skip if already has lazy loading attributes
    if (img.hasAttribute("data-src")) {
      return;
    }

    // Add loading attribute for native lazy loading support
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }

    // Add error handling if not present
    if (!img.onerror) {
      img.onerror = () => {
        img.src = "/src/assets/images/noimage.png";
        img.alt = "Image unavailable";
        img.classList.add("fallback-image");
      };
    }

    // Mark as optimized
    img.setAttribute("data-optimized", "true");
  });
}

/**
 * Create responsive image with srcset
 * @param {Object} options - Image options with responsive sources
 * @returns {HTMLImageElement} - Responsive image element
 */
export function createResponsiveImage(options) {
  const {
    src,
    srcSet = [],
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    alt = "",
    className = "",
  } = options;

  const img = createOptimizedImage({
    src,
    alt,
    className,
    lazy: true,
  });

  if (srcSet.length > 0) {
    const srcSetString = srcSet.map(item => `${item.src} ${item.size}`).join(", ");
    img.setAttribute("srcset", srcSetString);
    img.setAttribute("sizes", sizes);
  }

  return img;
}

/**
 * Observe new images added to the DOM
 * @param {Element} container - Container to observe for new images
 */
export function observeNewImages(container = document.body) {
  if (!imageObserver) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if the node itself is an image
          if (node.tagName === "IMG" && node.hasAttribute("data-src")) {
            imageObserver.observe(node);
          }

          // Check for images within the node
          const images = node.querySelectorAll ? node.querySelectorAll("img[data-src]") : [];
          images.forEach(img => {
            imageObserver.observe(img);
          });
        }
      });
    });
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });

  return observer;
}
