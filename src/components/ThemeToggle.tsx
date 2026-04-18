import { useTheme } from "../ThemeContext"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex items-center gap-0 text-[10px] uppercase tracking-editorial font-medium font-mono border border-ink dark:border-paper rounded-none"
    >
      <span
        className={`px-3 py-1.5 transition-colors ${
          !isDark ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-subink dark:text-subink-dark"
        }`}
      >
        ☀ Light
      </span>
      <span
        className={`px-3 py-1.5 transition-colors ${
          isDark ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-subink dark:text-subink-dark"
        }`}
      >
        Dark ☾
      </span>
    </button>
  )
}