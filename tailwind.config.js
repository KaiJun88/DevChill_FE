/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "sans-serif"],
      },
    },
    keyframes: {
      floating: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-12px)" },
      },
    },
    animation: {
      floating: "floating 3s ease-in-out infinite",
    },
  },
  plugins: [],
};
