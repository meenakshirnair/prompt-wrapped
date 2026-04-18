import { useState, useMemo } from "react"
import { parseClaude } from "./lib/parseClaude"
import { computeMetrics } from "./lib/computeMetrics"
import type { NormalizedData } from "./types"
import { ActivityChart } from "./components/charts/ActivityChart"
import { HourChart } from "./components/charts/HourChart"
import { WeekdayChart } from "./components/charts/WeekdayChart"
import { TopicChart } from "./components/charts/TopicChart"
import { WrappedCard } from "./components/WrappedCard"
import { ThemeToggle } from "./components/ThemeToggle"
import { GradientMesh } from "./components/GradientMesh"
import { AnimatedNumber } from "./components/AnimatedNumber"
import { TiltCard } from "./components/TiltCard"

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
        if (!Array.isArray(json)) {
          setError("This doesn't look like a Claude export. Expected an array of conversations.")
          return
        }
        setData(parseClaude(json))
      } catch (err) {
        console.error(err)
        setError("Could not parse this file as JSON.")
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
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600" />
          <span className="font-bold text-lg">Prompt Wrapped</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="px-6 md:px-10 pb-20 max-w-6xl mx-auto">
        {!metrics && <Landing isDragging={isDragging} setIsDragging={setIsDragging} handleDrop={handleDrop} handleSelect={handleSelect} error={error} />}

        {metrics && (
          <div className="space-y-10 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-pop-500 font-medium">
                ✓ Loaded: {fileName}
              </p>
              <button
                onClick={() => { setData(null); setFileName(null) }}
                className="text-sm text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 underline"
              >
                Load different file
              </button>
            </div>

            <StatGrid title="The basics">
              <Stat label="Conversations" value={metrics.totalConversations.toLocaleString()} animateFrom={metrics.totalConversations} />
              <Stat label="Messages" value={metrics.totalMessages.toLocaleString()} animateFrom={metrics.totalMessages} />
              <Stat label="You wrote" value={`${metrics.totalUserWords.toLocaleString()} words`} animateFrom={metrics.totalUserWords} />
              <Stat label="AI wrote" value={`${metrics.totalAssistantWords.toLocaleString()} words`} animateFrom={metrics.totalAssistantWords} />
            </StatGrid>

            <StatGrid title="Your habits">
              <Stat label="Active days" value={metrics.activeDays.toString()} animateFrom={metrics.activeDays} />
              <Stat label="Current streak" value={`${metrics.currentStreak} days`} animateFrom={metrics.currentStreak} />
              <Stat label="Longest streak" value={`${metrics.longestStreak} days`} animateFrom={metrics.longestStreak} />
              <Stat label="Avg msgs per chat" value={metrics.avgMessagesPerConversation.toFixed(1)} animateFrom={metrics.avgMessagesPerConversation} />
            </StatGrid>

            <StatGrid title="Extremes">
              <Stat label="First chat" value={metrics.firstMessageDate?.toLocaleDateString() ?? "—"} />
              <Stat label="Last chat" value={metrics.lastMessageDate?.toLocaleDateString() ?? "—"} />
              <Stat label="Longest chat" value={`${metrics.longestConversationLength} msgs`} sublabel={metrics.longestConversationTitle} animateFrom={metrics.longestConversationLength} />
              <Stat label="Avg prompt length" value={`${metrics.avgUserWordsPerMessage.toFixed(0)} words`} animateFrom={metrics.avgUserWordsPerMessage} />
            </StatGrid>

            <div>
              <h2 className="text-sm uppercase tracking-wider text-ink-500 font-semibold mb-4">Patterns</h2>
              <div className="space-y-6">
                <ActivityChart data={metrics.messagesByDay} />
                <TopicChart data={metrics.topics} />
                <div className="grid md:grid-cols-2 gap-6">
                  <HourChart data={metrics.messagesByHour} />
                  <WeekdayChart data={metrics.messagesByWeekday} />
                </div>
              </div>
            </div>

            <WrappedCard metrics={metrics} />
          </div>
        )}
      </main>
    </div>
  )
}

function Landing({ isDragging, setIsDragging, handleDrop, handleSelect, error }: any) {
  return (
    <div className="relative text-center pt-20">
      <GradientMesh />
      <p className="text-sm font-medium tracking-wider uppercase text-brand-500 mb-4">
        Your year in AI
      </p>
      <h1 className="font-display text-6xl md:text-7xl leading-tight mb-6">
        See what you <em>actually</em><br />use AI for.
      </h1>
      <p className="text-lg text-ink-500 max-w-xl mx-auto mb-12">
        Upload your Claude conversation export and get a personalized dashboard of your AI usage patterns. 100% private, nothing leaves your browser.
      </p>

      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`block max-w-xl mx-auto border-2 border-dashed rounded-3xl p-16 cursor-pointer transition-all ${
          isDragging
            ? "border-brand-400 bg-brand-50 dark:bg-brand-950 scale-[1.02]"
            : "border-ink-300 dark:border-ink-700 hover:border-brand-400 hover:bg-ink-100/50 dark:hover:bg-ink-900/50"
        }`}
      >
        <input type="file" accept=".json" onChange={handleSelect} className="hidden" />
        <div className="text-5xl mb-4">📥</div>
        <p className="text-xl font-semibold mb-2">Drop your conversations.json</p>
        <p className="text-sm text-ink-500">or click anywhere to browse</p>
      </label>

      {error && <p className="mt-6 text-red-500">⚠ {error}</p>}

      <div className="mt-12 text-sm text-ink-500">
        <p className="mb-2">Don't have your export yet?</p>
        <a href="https://claude.ai" target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-600 underline">
          Get it from claude.ai → Settings → Privacy → Export data
        </a>
      </div>
    </div>
  )
}

function StatGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm uppercase tracking-wider text-ink-500 font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </div>
  )
}

function Stat({ label, value, sublabel, animateFrom }: {
  label: string
  value: string
  sublabel?: string
  animateFrom?: number
}) {
  return (
    <TiltCard className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-5 transition-colors">
      <p className="text-xs uppercase tracking-wider text-ink-500 font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1">
        {animateFrom !== undefined ? (
          <AnimatedNumber
            value={animateFrom}
            format={(n) => value.replace(/[\d,]+/, Math.round(n).toLocaleString())}
          />
        ) : (
          value
        )}
      </p>
      {sublabel && <p className="text-xs text-ink-500 truncate" title={sublabel}>{sublabel}</p>}
    </TiltCard>
  )
}

export default App