export function updateAuthState() {
  const token = localStorage.getItem("token");
  const loggedOutElements = document.querySelectorAll(
    '[data-auth="logged-out"]'
  );
  const loggedInElements = document.querySelectorAll('[data-auth="logged-in"]');

  if (token) {
    loggedOutElements.forEach((element) => element.classList.add("hidden"));
    loggedInElements.forEach((element) => element.classList.remove("hidden"));

    const creditsElement = document.querySelector("[data-credits]");
    if (creditsElement) {
      const credits = localStorage.getItem("credits");
      creditsElement.textContent = credits || 0;
    }
  } else {
    loggedOutElements.forEach((element) => element.classList.remove("hidden"));
    loggedInElements.forEach((element) => element.classList.add("hidden"));
  }
}

export function initLogout() {
  const logoutButton = document.querySelector("[data-logout]");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("credits"); // Add this line to clear credits
      window.location.href = "/";
    });
  }
}
