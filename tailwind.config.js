/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./apps/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'color-1': '#f8f6f1',
                'color-2': '#e1eae5',
                'color-3': '#a7d7b8',
                'color-4': '#66b2a0',
                'color-5': '#4e796b',
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#ea580c", // orange-600
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f3f4f6", // gray-100
                    foreground: "#1f2937", // gray-800
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#fed7aa", // orange-200
                    foreground: "#9a3412", // orange-800
                },
                accent: {
                    DEFAULT: "#ffedd5", // orange-100
                    foreground: "#9a3412", // orange-800
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
}
