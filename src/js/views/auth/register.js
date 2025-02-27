import { register } from "../../api/auth/register.js";

function validateForm(username, email, password, confirmPassword) {
  const errors = {};

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
  }

  if (!email.endsWith("@stud.noroff.no")) {
    errors.email = "Must be a valid stud.noroff.no email address";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function initRegister() {
  const form = document.getElementById("registerForm");
  const passwordToggles = document.querySelectorAll("[data-password-toggle]");

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const input = e.target.closest("div").querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelectorAll("[data-error]").forEach((el) => {
      el.textContent = "";
      el.classList.add("hidden");
    });

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const errors = validateForm(username, email, password, confirmPassword);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        const errorElement = document.querySelector(`[data-error="${field}"]`);
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.classList.remove("hidden");
        }
      });
      return;
    }

    try {
      await register({ name: username, email, password });
      alert("Registration successful! Redirecting to login page...");
      window.location.href = "/src/pages/login/";
    } catch (error) {
      alert(error.message);
    }
  });
}
