/** @type {import('tailwindcss').Config} */
export default {
    content: ['./renderer/app/index.html', './renderer/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
