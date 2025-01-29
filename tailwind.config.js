/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Make sure the root index.html is included
    "./src/**/*.{html,js}", // Scan all HTML and JS files in the src folder
  ],
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
