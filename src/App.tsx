import { useState, useMemo } from "react"
import { parseClaude } from "./lib/parseClaude"
import { computeMetrics } from "./lib/computeMetrics"
import type { NormalizedData } from "./types"
import { ActivityChart } from "./components/charts/ActivityChart"
import { HourChart } from "./components/charts/HourChart"
import { WeekdayChart } from "./components/charts/WeekdayChart"
import { TopicChart } from "./components/charts/TopicChart"
import { WrappedCard } from "./components/WrappedCard"

function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [data, setData] = useState<NormalizedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Compute metrics whenever data changes (memoized so it doesn't recompute on every render)
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
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-10">
          <h1 className="text-5xl font-bold mb-3">Prompt Wrapped 🎁</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            See what you actually use AI for. 100% private, your data never leaves your browser.
          </p>
        </div>

        {!metrics && (
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`block max-w-lg mx-auto border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
              isDragging ? "border-purple-400 bg-slate-800" : "border-slate-600 hover:border-slate-400"
            }`}
          >
            <input type="file" accept=".json" onChange={handleSelect} className="hidden" />
            <p className="text-lg mb-2">Drag your conversations.json here</p>
            <p className="text-sm text-slate-500">or click to choose a file</p>
          </label>
        )}

        {error && (
          <p className="mt-6 text-red-400 text-center">⚠ {error}</p>
        )}

        {metrics && (
          <div className="space-y-6">
            <p className="text-green-400 text-center">✓ Loaded: {fileName}</p>

            <StatGrid title="The basics">
              <Stat label="Conversations" value={metrics.totalConversations.toLocaleString()} />
              <Stat label="Messages" value={metrics.totalMessages.toLocaleString()} />
              <Stat label="You wrote" value={`${metrics.totalUserWords.toLocaleString()} words`} />
              <Stat label="AI wrote" value={`${metrics.totalAssistantWords.toLocaleString()} words`} />
            </StatGrid>

            <StatGrid title="Your habits">
              <Stat label="Active days" value={metrics.activeDays.toString()} />
              <Stat label="Current streak" value={`${metrics.currentStreak} days`} />
              <Stat label="Longest streak" value={`${metrics.longestStreak} days`} />
              <Stat label="Avg msgs per chat" value={metrics.avgMessagesPerConversation.toFixed(1)} />
            </StatGrid>

            <StatGrid title="Extremes">
              <Stat
                label="First chat"
                value={metrics.firstMessageDate?.toLocaleDateString() ?? "—"}
              />
              <Stat
                label="Last chat"
                value={metrics.lastMessageDate?.toLocaleDateString() ?? "—"}
              />
              <Stat
                label="Longest chat"
                value={`${metrics.longestConversationLength} msgs`}
                sublabel={metrics.longestConversationTitle}
              />
              <Stat
                label="Avg prompt length"
                value={`${metrics.avgUserWordsPerMessage.toFixed(0)} words`}
              />
            </StatGrid>

            <div>
              <h2 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Patterns</h2>
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

            <div className="text-center pt-6">
              <button
                onClick={() => { setData(null); setFileName(null) }}
                className="text-slate-400 hover:text-white text-sm underline"
              >
                Load a different file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm uppercase tracking-wide text-slate-500 mb-3">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  )
}

function Stat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {sublabel && (
        <p className="text-xs text-slate-500 truncate" title={sublabel}>
          {sublabel}
        </p>
      )}
    </div>
  )
}

export default App