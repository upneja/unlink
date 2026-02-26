/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ["Caveat", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
      colors: {
        pink: { diary: "#FFB5C2" },
        lavender: { diary: "#C3B1E1" },
        blue: { diary: "#A7C7E7" },
        mint: { diary: "#B5EAD7" },
        gold: { diary: "#FFD700" },
        cream: { diary: "#FFF8F0" },
        charcoal: { diary: "#4A4A4A" },
      },
    },
  },
  plugins: [],
}
