interface Props {
  page: number
  total: number
}

export function FooterMeta({ page, total }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest text-subink dark:text-subink-dark pt-6 mt-16 border-t border-divider dark:border-divider-dark">
      <span>Page {pad(page)} / {pad(total)}</span>
      <span>·  ·  ·</span>
      <span>Edition of one</span>
    </div>
  )
}