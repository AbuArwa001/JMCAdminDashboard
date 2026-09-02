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
                // Jamia ecosystem brand palette (matches jamia-admin)
                jamia: {
                    dark: "#1a1512",
                    "dark-deeper": "#120e0c",
                    "dark-border": "#2d2520",
                    gold: "#c99335",
                    "gold-hover": "#e39e3b",
                    brown: "#4a2311",
                    orange: "#db5a27",
                    teal: "#5ea38c",
                    cream: "#fcf9f2",
                    emerald: "#006838",
                    "emerald-dark": "#004d29",
                },
                // Legacy primary mapped to jamia colors
                primary: {
                    DEFAULT: "#c99335",
                    light: "#e39e3b",
                    dark: "#9D7C3F",
                    green: "#006838",
                    bronze: "#9D7C3F",
                },
                secondary: {
                    DEFAULT: "#fcf9f2",
                    dark: "#1a1512",
                    surface: "#2d2520",
                },
                gold: {
                    50: "#FAF6E9",
                    100: "#F5EBCC",
                    200: "#E9D294",
                    300: "#DEB85C",
                    400: "#D4AF37",
                    500: "#c99335",
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
            fontFamily: {
                serif: ["var(--font-cinzel)", "serif"],
                sans: ["var(--font-outfit)", "sans-serif"],
            },
            boxShadow: {
                "gold-glow": "0 10px 30px -5px rgba(201, 147, 53, 0.25)",
                "gold-sm": "0 4px 15px -2px rgba(201, 147, 53, 0.15)",
                "emerald-glow": "0 10px 30px -5px rgba(0, 104, 56, 0.25)",
                "card-luxury": "0 10px 40px -10px rgba(26, 21, 18, 0.08)",
                "card-hover": "0 20px 45px -12px rgba(201, 147, 53, 0.15)",
                "glass": "0 8px 32px 0 rgba(26, 21, 18, 0.07)",
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
