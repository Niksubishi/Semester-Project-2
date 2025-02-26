import { login } from "../../api/auth/login.js";

export function initLogin() {
  const form = document.getElementById("loginForm");
  const passwordToggle = document.querySelector("[data-password-toggle]");
  const passwordInput = document.getElementById("password");
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("returnTo");

  passwordToggle.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login(email, password);
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        window.location.href = returnUrl || "/";
      }
    } catch (error) {
      alert(error.message);
    }
  });
}
