import { useState, useMemo } from "react"
import { computeMetrics } from "./lib/computeMetrics"
import type { NormalizedData } from "./types"
import { ActivityChart } from "./components/charts/ActivityChart"
import { HourChart } from "./components/charts/HourChart"
import { WeekdayChart } from "./components/charts/WeekdayChart"
import { TopicChart } from "./components/charts/TopicChart"
import { WrappedCard } from "./components/WrappedCard"
import { Masthead } from "./components/Masthead"
import { FooterMeta } from "./components/FooterMeta"
import { detectAndParse } from "./lib/detectAndParse"

function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [data, setData] = useState<NormalizedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const metrics = useMemo(() => data ? computeMetrics(data) : null, [data])

  const handleFile = (file: File) => {
    setFileName(file.name)
    setError(null)
    setData(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const json = JSON.parse(text)
        const parsed = detectAndParse(json)
        setData(parsed)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Could not read this file.")
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="relative min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-8 relative z-10">
        <Masthead />

        <main>
          {!metrics && (
            <Landing
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              handleDrop={handleDrop}
              handleSelect={handleSelect}
              error={error}
            />
          )}

          {metrics && (
            <div>
              <div className="flex items-center justify-between py-4 border-b border-divider dark:border-divider-dark text-[11px] uppercase tracking-editorial font-medium">
                <span className="text-pop">● Loaded: {fileName}</span>
                <button
                  onClick={() => { setData(null); setFileName(null) }}
                  className="text-subink dark:text-subink-dark hover:text-ink dark:hover:text-paper transition-colors"
                >
                  Load different →
                </button>
              </div>

              <Section kicker="Part One" title="The numbers" page={2}>
                <div className="grid md:grid-cols-2 gap-y-10 gap-x-16">
                  <BigStat label="Conversations" value={metrics.totalConversations.toLocaleString()} />
                  <BigStat label="Messages exchanged" value={metrics.totalMessages.toLocaleString()} />
                  <BigStat label="Words you wrote" value={metrics.totalUserWords.toLocaleString()} />
                  <BigStat label="Words written back" value={metrics.totalAssistantWords.toLocaleString()} />
                </div>
              </Section>

              <Section kicker="Part Two" title="Your habits" page={3}>
                <div className="grid md:grid-cols-2 gap-y-10 gap-x-16">
                  <BigStat label="Active days" value={metrics.activeDays.toString()} />
                  <BigStat label="Current streak" value={`${metrics.currentStreak} days`} />
                  <BigStat label="Longest streak" value={`${metrics.longestStreak} days`} />
                  <BigStat label="Avg messages per chat" value={metrics.avgMessagesPerConversation.toFixed(1)} />
                </div>
              </Section>

              <Section kicker="Part Three" title="The extremes" page={4}>
                <div className="grid md:grid-cols-2 gap-y-10 gap-x-16">
                  <BigStat label="First conversation" value={metrics.firstMessageDate?.toLocaleDateString() ?? "—"} />
                  <BigStat label="Most recent" value={metrics.lastMessageDate?.toLocaleDateString() ?? "—"} />
                  <BigStat
                    label="Longest single chat"
                    value={`${metrics.longestConversationLength} msgs`}
                    sublabel={metrics.longestConversationTitle}
                  />
                  <BigStat label="Average prompt length" value={`${metrics.avgUserWordsPerMessage.toFixed(0)} words`} />
                </div>
              </Section>

              <Section kicker="Part Four" title="Patterns" page={5}>
                <ActivityChart data={metrics.messagesByDay} />
                <TopicChart data={metrics.topics} />
                <HourChart data={metrics.messagesByHour} />
                <WeekdayChart data={metrics.messagesByWeekday} />
              </Section>

              <Section kicker="The wrap" title="Your year, on one page" page={6}>
                <WrappedCard metrics={metrics} />
              </Section>

              <FooterMeta page={6} total={6} />
            </div>
          )}

          {!metrics && <FooterMeta page={1} total={6} />}
        </main>
      </div>
    </div>
  )
}

function Section({
  kicker,
  title,
  page,
  children,
}: {
  kicker: string
  title: string
  page: number
  children: React.ReactNode
}) {
  return (
    <section className="pt-24 pb-8">
      <div className="flex items-baseline justify-between mb-16 pb-4 border-b border-divider dark:border-divider-dark">
        <div>
          <p className="text-[11px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium mb-3">
            {kicker}
          </p>
          <h2 className="font-display text-[48px] md:text-[56px] leading-none tracking-tight">
            {title}
          </h2>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-subink dark:text-subink-dark">
          Pg. {String(page).padStart(2, "0")}
        </span>
      </div>
      {children}
    </section>
  )
}

function BigStat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium mb-3">
        {label}
      </p>
      <p className="font-display text-[64px] leading-none tracking-tight mb-1">
        {value}
      </p>
      {sublabel && (
        <p className="text-sm text-subink dark:text-subink-dark italic mt-2 font-display">
          "{sublabel}"
        </p>
      )}
    </div>
  )
}

function Landing({ isDragging, setIsDragging, handleDrop, handleSelect, error }: any) {
  return (
    <div className="relative pt-20 pb-8">
      <p className="text-[11px] uppercase tracking-editorial font-medium text-subink dark:text-subink-dark mb-6">
        A zine about your year in AI
      </p>

      <h1 className="font-display text-[72px] md:text-[96px] leading-[0.95] tracking-tight mb-8 max-w-[720px]">
        See what you <em className="text-pop italic">actually</em><br />
        use AI for.
      </h1>

      <p className="font-display italic text-xl md:text-2xl text-subink dark:text-subink-dark max-w-xl leading-snug mb-14">
        A small, private field guide to the questions you asked, the hours you kept, and the habits you didn't know you had.
      </p>

      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`block max-w-xl border border-dashed cursor-pointer transition-all p-10 ${
          isDragging
            ? "border-pop bg-pop/5"
            : "border-ink dark:border-paper hover:border-pop"
        }`}
      >
        <input type="file" accept=".json" onChange={handleSelect} className="hidden" />
        <p className="text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium mb-2">
          Enter →
        </p>
        <p className="font-display text-[28px] leading-tight mb-1">
          Drop your conversations.json
        </p>
        <p className="text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium mt-3">
          Works with Claude or ChatGPT
        </p>
        <p className="text-sm text-subink dark:text-subink-dark">
          Or click to browse. Nothing leaves your browser.
        </p>
      </label>

      {error && (
        <p className="mt-6 text-pop text-sm">⚠ {error}</p>
      )}

      <p className="mt-14 text-xs text-subink dark:text-subink-dark max-w-lg leading-relaxed">
        Don't have your export yet? For Claude, go to{" "}
        <a href="https://claude.ai" target="_blank" rel="noreferrer" className="underline decoration-pop decoration-2 underline-offset-4 hover:text-pop transition-colors">
          claude.ai
        </a>
        {" "}→ Settings → Privacy → Export data. For ChatGPT, go to{" "}
        <a href="https://chatgpt.com" target="_blank" rel="noreferrer" className="underline decoration-pop decoration-2 underline-offset-4 hover:text-pop transition-colors">
          chatgpt.com
        </a>
        {" "}→ Settings → Data Controls → Export. You'll get an email with a zip; the JSON lives inside.
      </p>
    </div>
  )
}

export default App