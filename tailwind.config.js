/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,html}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#131619",
        primaryTransparent: "rgba(0, 0, 0, 0.73)",
        secondary: "#FF9900",
        grayish: "#B4B4B4",

      }
    },
  },
  plugins: [],
}

