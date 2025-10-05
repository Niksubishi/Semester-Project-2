/**
 * Loading state management for better UX
 */

/**
 * Loading state manager
 */
export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.loadingElements = new Map();
  }

  /**
   * Show loading state for a specific operation
   */
  show(operationId, element = null, message = "Loading...") {
    this.loadingStates.set(operationId, true);

    if (element) {
      this.showElementLoading(element, message);
      this.loadingElements.set(operationId, element);
    }

    // Dispatch global loading event
    window.dispatchEvent(new CustomEvent("loadingStart", {
      detail: { operationId, message },
    }));
  }

  /**
   * Hide loading state for a specific operation
   */
  hide(operationId) {
    this.loadingStates.delete(operationId);

    const element = this.loadingElements.get(operationId);
    if (element) {
      this.hideElementLoading(element);
      this.loadingElements.delete(operationId);
    }

    // Dispatch global loading event
    window.dispatchEvent(new CustomEvent("loadingEnd", {
      detail: { operationId },
    }));
  }

  /**
   * Check if any operation is loading
   */
  isLoading(operationId = null) {
    if (operationId) {
      return this.loadingStates.has(operationId);
    }
    return this.loadingStates.size > 0;
  }

  /**
   * Show loading state on element
   */
  showElementLoading(element, message = "Loading...") {
    if (!element) {
      return;
    }

    // Store original content
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }

    // Add loading class
    element.classList.add("loading-state");

    // Show loading spinner
    element.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-brand-text"></div>
        <span class="text-sm text-gray-600">${message}</span>
      </div>
    `;

    // Disable interactions
    element.style.pointerEvents = "none";
    element.style.opacity = "0.7";
  }

  /**
   * Hide loading state on element
   */
  hideElementLoading(element) {
    if (!element) {
      return;
    }

    // Remove loading class
    element.classList.remove("loading-state");

    // Restore original content
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }

    // Re-enable interactions
    element.style.pointerEvents = "";
    element.style.opacity = "";
  }

  /**
   * Show skeleton loading for lists
   */
  showSkeleton(container, count = 3) {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton-item p-4 border rounded-lg mb-4";
      skeleton.innerHTML = `
        <div class="animate-pulse">
          <div class="skeleton h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="skeleton h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="skeleton h-20 bg-gray-200 rounded w-full"></div>
        </div>
      `;
      container.appendChild(skeleton);
    }
  }

  /**
   * Show global loading indicator
   */
  showGlobalLoading(message = "Loading...") {
    let indicator = document.getElementById("global-loading");

    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "global-loading";
      indicator.className = "fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50";
      document.body.appendChild(indicator);
    }

    indicator.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-brand-text"></div>
        <span class="text-sm font-medium text-gray-700">${message}</span>
      </div>
    `;

    indicator.classList.remove("hidden");
  }

  /**
   * Hide global loading indicator
   */
  hideGlobalLoading() {
    const indicator = document.getElementById("global-loading");
    if (indicator) {
      indicator.classList.add("hidden");
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }

  /**
   * Wrap async function with loading state
   */
  async withLoading(operationId, asyncFn, element = null, message = "Loading...") {
    try {
      this.show(operationId, element, message);
      const result = await asyncFn();
      return result;
    } finally {
      this.hide(operationId);
    }
  }

  /**
   * Clear all loading states
   */
  clearAll() {
    // Hide all element loading states
    for (const [operationId, element] of this.loadingElements) {
      this.hideElementLoading(element);
    }

    this.loadingStates.clear();
    this.loadingElements.clear();
    this.hideGlobalLoading();
  }
}

// Create global loading manager
export const loadingManager = new LoadingManager();

// Helper functions
export const loading = {
  show: (id, element, message) => loadingManager.show(id, element, message),
  hide: (id) => loadingManager.hide(id),
  isLoading: (id) => loadingManager.isLoading(id),
  withLoading: (id, fn, element, message) => loadingManager.withLoading(id, fn, element, message),
  skeleton: (container, count) => loadingManager.showSkeleton(container, count),
  global: {
    show: (message) => loadingManager.showGlobalLoading(message),
    hide: () => loadingManager.hideGlobalLoading(),
  },
};

// Auto-manage global loading based on multiple operations
window.addEventListener("loadingStart", () => {
  if (loadingManager.loadingStates.size === 1) {
    loadingManager.showGlobalLoading();
  }
});

window.addEventListener("loadingEnd", () => {
  if (loadingManager.loadingStates.size === 0) {
    setTimeout(() => {
      if (loadingManager.loadingStates.size === 0) {
        loadingManager.hideGlobalLoading();
      }
    }, 100); // Small delay to prevent flicker
  }
});
