export const themeBoxShadow = {
  "gold-glow": "0 10px 30px -5px rgba(201, 147, 53, 0.25)",
  "gold-sm": "0 4px 15px -2px rgba(201, 147, 53, 0.15)",
  "emerald-glow": "0 10px 30px -5px rgba(0, 104, 56, 0.25)",
  "card-luxury": "0 10px 40px -10px rgba(26, 21, 18, 0.08)",
  "card-hover": "0 20px 45px -12px rgba(201, 147, 53, 0.15)",
  glass: "0 8px 32px 0 rgba(26, 21, 18, 0.07)",
};

export const themeAnimation = {
  shimmer: "shimmer 2.5s infinite linear",
  float: "float 3s ease-in-out infinite",
  "pulse-glow": "pulseGlow 2s infinite ease-in-out",
};

export const themeKeyframes = {
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
};
