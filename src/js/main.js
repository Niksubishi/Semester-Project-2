import "../style.css";
import router from "./router.js";
import { updateAuthState } from "./utils/authguard.js";
import { initNav } from "./ui/components/nav.js";

document.addEventListener("DOMContentLoaded", () => {
  updateAuthState();
  initNav();
  router();
});
