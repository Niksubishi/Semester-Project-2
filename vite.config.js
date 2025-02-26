import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  appType: "mpa",
  base: "",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/login/index.html"),
        register: resolve(__dirname, "src/pages/register/index.html"),
        create: resolve(__dirname, "src/pages/listing/index.html"),
        profile: resolve(__dirname, "src/pages/profile/index.html"),
        listing: resolve(__dirname, "src/pages/listing/index.html"),
        user: resolve(__dirname, "src/pages/user/index.html"),
      },
    },
  },
});
