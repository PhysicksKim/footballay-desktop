/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app.html', './renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
