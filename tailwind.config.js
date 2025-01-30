/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          nav: "#F4F3EE",
          text: "#463F3A",
          body: "#D2D1CA",
        },
      },
      fontFamily: {
        jost: ["Jost", "sans-serif"],
      },
    },
  },
  plugins: [],
};
