/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Nanti kita tambahin color palette SIDIAS di sini
      colors: {
        primary: {
          50:  '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        secondary: {
          500: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}