import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          light: "#243257",
          soft: "#3B4A73",
        },
        paper: {
          DEFAULT: "#F7F5F0",
          dim: "#EFECE3",
        },
        flag: {
          DEFAULT: "#B3261E",
          light: "#D6483E",
          bg: "#FBEAE8",
        },
        verified: {
          DEFAULT: "#1F6F5C",
          light: "#2E8E76",
          bg: "#E7F3EF",
        },
        slate: {
          DEFAULT: "#5B6472",
          dim: "#8991A0",
        },
        hairline: "#D8D3C7",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, #D8D3C7 40px)",
      },
      keyframes: {
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(1.4) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.96) rotate(-8deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-8deg)" },
        },
        "redline-draw": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "stamp-in": "stamp-in 0.5s cubic-bezier(0.2,0.9,0.3,1.2) forwards",
        "redline-draw": "redline-draw 0.6s ease-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
