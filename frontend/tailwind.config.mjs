/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        jetBrains: ["JetbrainsBold", "monospace"],
        jetBrainsExtraBold: ["JetbrainsExtraBold", "monospace"],
      },
      colors: {
        "main-light-blue-dark": "#1F99FC",

        "main-dark-purple-dark": "#4C2DA8",
      },
    },
  },
  plugins: [],
};
