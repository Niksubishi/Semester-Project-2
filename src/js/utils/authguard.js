export function updateAuthState() {
  const token = localStorage.getItem("token");
  const loggedOutElements = document.querySelectorAll(
    '[data-auth="logged-out"]'
  );
  const loggedInElements = document.querySelectorAll('[data-auth="logged-in"]');

  if (token) {
    loggedOutElements.forEach((element) => element.classList.add("hidden"));
    loggedInElements.forEach((element) => element.classList.remove("hidden"));
  } else {
    loggedOutElements.forEach((element) => element.classList.remove("hidden"));
    loggedInElements.forEach((element) => element.classList.add("hidden"));
  }
}
