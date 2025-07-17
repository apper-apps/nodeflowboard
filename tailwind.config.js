/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B47E0",
        secondary: "#8B7FFF",
        accent: "#FF6B6B",
        surface: "#FFFFFF",
        background: "#F7F9FC",
        success: "#4ECDC4",
        warning: "#FFD93D",
        error: "#FF6B6B",
        info: "#4D96FF",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
    },
  },
  plugins: [],
};