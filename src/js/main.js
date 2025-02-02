import "../style.css";
import router from "./router.js";
import { updateAuthState, initLogout } from "./utils/authguard.js";

document.addEventListener("DOMContentLoaded", () => {
  updateAuthState();
  initLogout();
  router();
});
