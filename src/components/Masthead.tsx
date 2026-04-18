import { ThemeToggle } from "./ThemeToggle"

export function Masthead() {
  return (
    <header className="relative z-10 flex items-center justify-between pb-5 border-b border-divider dark:border-divider-dark">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-editorial font-medium">
        <div className="w-2 h-2 rounded-full bg-pop" />
        <span>Prompt Wrapped</span>
        <span className="text-subink dark:text-subink-dark">/ Issue Nº 01</span>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-[11px] font-mono text-subink dark:text-subink-dark tracking-widest">MMXXVI</span>
        <ThemeToggle />
      </div>
    </header>
  )
}