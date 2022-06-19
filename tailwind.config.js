/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}"
  ],
  theme: {
    extend: {
        fontFamily: {
            "sans": "Inter, sans-serif",
        }
    },
  },
  plugins: [],
}
