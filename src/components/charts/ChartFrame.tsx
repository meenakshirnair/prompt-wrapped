interface Props {
  kicker?: string
  title: string
  note?: string
  pageRef?: string  // e.g. "Fig. 01"
  children: React.ReactNode
}

export function ChartFrame({ kicker, title, note, pageRef, children }: Props) {
  return (
    <div className="pt-8 mt-4 border-t border-divider dark:border-divider-dark">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          {kicker && (
            <p className="text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium mb-2">
              {kicker}
            </p>
          )}
          <h3 className="font-display text-[32px] md:text-[36px] leading-none tracking-tight">
            {title}
          </h3>
          {note && (
            <p className="font-display italic text-sm text-subink dark:text-subink-dark mt-2">
              {note}
            </p>
          )}
        </div>
        {pageRef && (
          <span className="font-mono text-[10px] tracking-widest text-subink dark:text-subink-dark">
            {pageRef}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}