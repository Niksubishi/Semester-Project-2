import { API_PROFILES } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

async function getCurrentCredits() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  if (!username || !token) {
    console.warn("Missing username or token in localStorage.");
    return null;
  }

  try {
    const response = await fetch(API_PROFILES.SINGLE(username), {
      headers: headers(token),
    });

    if (!response.ok) {
      console.error("Failed to fetch credits. Status:", response.status);
      return null;
    }

    const { data } = await response.json();

    localStorage.setItem("credits", data.credits);
    refreshCreditsDisplay();
    return data.credits;
  } catch (error) {
    console.error("Error fetching credits:", error);
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

  await getCurrentCredits();

  const observer = new MutationObserver(refreshCreditsDisplay);
  const creditsElement = document.querySelector("[data-credits]");

  if (creditsElement) {
    observer.observe(creditsElement, { childList: true, subtree: true });
  }
}
