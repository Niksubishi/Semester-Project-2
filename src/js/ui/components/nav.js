import { API_PROFILES } from "../../constants/api.js";
import { api } from "../../utils/apiClient.js";
import Logger from "../../utils/logger.js";

async function getCurrentCredits() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  if (!username || !token) {
    Logger.warn("Missing username or token in localStorage.");
    return null;
  }

  try {
    const data = await api.authGet(API_PROFILES.SINGLE(username), {
      cache: true,
      cacheTime: 30 * 1000, // Cache credits for 30 seconds
      timeout: 8000, // 8 second timeout
    });

    const credits = data.data.credits;
    localStorage.setItem("credits", credits);
    refreshCreditsDisplay();
    return credits;
  } catch (error) {
    Logger.apiError("fetching credits", error);
    // Show user-friendly message based on error type
    if (error.status === 401) {
      // Token expired, redirect to login
      localStorage.clear();
      window.location.href = "/src/pages/login/";
    }
    return null;
  }
}

export function updateCredits(newCredits) {
  localStorage.setItem("credits", newCredits);
  refreshCreditsDisplay();
}

function refreshCreditsDisplay() {
  const creditsElement = document.querySelector("[data-credits]");
  if (creditsElement) {
    creditsElement.textContent = localStorage.getItem("credits") || 0;
  }
}

export async function initNav() {
  const logoutButton = document.querySelector("[data-logout]");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("credits");
      window.location.href = "/";
    });
  }

  // Only fetch credits if user is logged in and the credits element is visible
  const token = localStorage.getItem("token");
  const creditsElement = document.querySelector("[data-credits]");
  if (token && creditsElement && !creditsElement.closest('[data-auth="logged-in"]')?.classList.contains('hidden')) {
    await getCurrentCredits();
  }

  const observer = new MutationObserver(refreshCreditsDisplay);

  if (creditsElement) {
    observer.observe(creditsElement, { childList: true, subtree: true });
  }

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
    });
  }
}
