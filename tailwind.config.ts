import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#BE9830", // Gold
                    green: "#2E9C57",
                    bronze: "#9D7C3F",
                },
                secondary: {
                    DEFAULT: "#F5F0E1", // Cream
                    dark: "#1E1E1E", // Dark Grey
                },
                grey: {
                    DEFAULT: "#757575",
                },
            },
        },
    },
    plugins: [],
};
export default config;
