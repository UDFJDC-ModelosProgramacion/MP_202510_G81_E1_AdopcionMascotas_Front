/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'color-1': '#f8f6f1',
                'color-2': '#e1eae5',
                'color-3': '#a7d7b8',
                'color-4': '#66b2a0',
                'color-5': '#4e796b',
            }
        },
    },
    plugins: [],
}
