import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login.html"),
        register: resolve(__dirname, "src/pages/auth/register.html"),
        create: resolve(__dirname, "src/pages/listing/create.html"),
        profile: resolve(__dirname, "src/pages/profile/index.html"),
        listing: resolve(__dirname, "src/pages/listing/index.html"),
      },
    },
  },
});
