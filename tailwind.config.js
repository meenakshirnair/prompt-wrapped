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
        paper: "#faf8f3",
        ink: "#1a1a1a",
        subink: "#6b6b6b",
        divider: "#e8e3d6",
        pop: "#ff5722",
        // Dark-mode paper & divider
        "paper-dark": "#1a1a1a",
        "subink-dark": "#a0a0a0",
        "divider-dark": "#2e2e2e",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["ui-monospace", "'SF Mono'", "Menlo", "monospace"],
      },
      letterSpacing: {
        widest: "0.2em",
        editorial: "0.25em",
      },
    },
  },
  plugins: [],
}