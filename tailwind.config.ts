import type { Config } from "tailwindcss";
import { themeColors } from "./lib/tailwind-colors";
import { themeBoxShadow, themeAnimation, themeKeyframes } from "./lib/tailwind-effects";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        serif: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: themeBoxShadow,
      animation: themeAnimation,
      keyframes: themeKeyframes,
    },
  },
  plugins: [],
};

export default config;
