import { useTheme } from "../ThemeContext"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 bg-ink-200 dark:bg-ink-800 hover:bg-ink-300 dark:hover:bg-ink-700"
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white dark:bg-brand-400 shadow transition-transform duration-300 flex items-center justify-center text-xs ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  )
}