/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/pages/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orion: {
          "dark-blue": "#1A2238",
          nebula: "#5C4DFF",
          "light-blue": "#00CFFF",
          star: "#FFC83D",
          purple: "#7C3AED",
          "dark-bg": "#09090B",
          "light-bg": "#F8FAFC",
        },
      },
      fontFamily: {
        spaceg: ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
