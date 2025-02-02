import { login } from "../../api/auth/login.js";

export function initLogin() {
  const form = document.getElementById("loginForm");
  const passwordToggle = document.querySelector("[data-password-toggle]");
  const passwordInput = document.getElementById("password");

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
    } catch (error) {
      alert(error.message);
    }
  });
}
