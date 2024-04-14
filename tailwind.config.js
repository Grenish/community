/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fbfefb",
        secondary: "#f4f4f9",
        heart: "#e63946",
      }
    },
  },
  plugins: [],
};
