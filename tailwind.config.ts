import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#080D1A",
        surface: {
          DEFAULT: "#0F172A",
          hover: "#17233D",
          border: "#1E293B",
          card: "rgba(15, 23, 42, 0.75)",
        },
        navy: {
          950: "#060A14",
          900: "#0B1120",
          850: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        brand: {
          electric: "#00F59B",
          mint: "#10E79D",
          cyan: "#06B6D4",
          dark: "#080D1A",
          card: "#0D1629",
          border: "#172642",
          borderGlow: "rgba(0, 245, 155, 0.2)",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 245, 155, 0.25)",
        "glow-lg": "0 0 45px -10px rgba(0, 245, 155, 0.35)",
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "brand-glow": "radial-gradient(circle at 50% 0%, rgba(0, 245, 155, 0.15), transparent 70%)",
        "mesh-pattern": "radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

