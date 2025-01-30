/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jetBrains: ["JetbrainsBold", "monospace"],
        jetBrainsExtraBold: ["JetbrainsExtraBold", "monospace"],
      },
      colors: {
        "bg-light": "#f3f3f3",
        "bg-lightSoft": "#dedede",
        "main-light-blue-dark": "#1F99FC",
        "main-dark-purple-dark": "#4C2DA8",
      },
    },
  },
  plugins: [],
};
