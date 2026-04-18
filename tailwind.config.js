/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — cool tones, bold
        brand: {
          50:  "#ecfeff",  // almost white cyan
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",  // mint / bright accent
          400: "#22d3ee",  // electric teal
          500: "#06b6d4",  // primary
          600: "#0891b2",  // hover
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",  // deep, for dark mode accents
        },
        // Secondary — deeper blues for contrast
        ink: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Pop accent — used sparingly for highlights
        pop: {
          400: "#34d399",  // mint green
          500: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}