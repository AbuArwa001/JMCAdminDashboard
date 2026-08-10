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
                    light: "#D4AF37",
                    dark: "#9D7C3F",
                    green: "#10B981",
                    bronze: "#9D7C3F",
                },
                secondary: {
                    DEFAULT: "#F8FAFC",
                    dark: "#0F172A", 
                    surface: "#1E293B",
                },
                gold: {
                    50: "#FAF6E9",
                    100: "#F5EBCC",
                    200: "#E9D294",
                    300: "#DEB85C",
                    400: "#D4AF37",
                    500: "#BE9830",
                    600: "#9D7C3F",
                    700: "#7B5E28",
                    800: "#5A421A",
                    900: "#3D2C10",
                },
                grey: {
                    DEFAULT: "#64748B",
                    light: "#F1F5F9",
                },
            },
            boxShadow: {
                "gold-glow": "0 10px 30px -5px rgba(190, 152, 48, 0.25)",
                "gold-sm": "0 4px 15px -2px rgba(190, 152, 48, 0.15)",
                "card-luxury": "0 10px 40px -10px rgba(15, 23, 42, 0.05)",
                "card-hover": "0 20px 45px -12px rgba(190, 152, 48, 0.15)",
                "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
            },
            animation: {
                "shimmer": "shimmer 2.5s infinite linear",
                "float": "float 3s ease-in-out infinite",
                "pulse-glow": "pulseGlow 2s infinite ease-in-out",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                pulseGlow: {
                    "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.05)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
