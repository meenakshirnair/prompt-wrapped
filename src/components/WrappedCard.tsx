import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import type { Metrics } from "../types"

interface Props {
  metrics: Metrics
}

export function WrappedCard({ metrics }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const topTopic = metrics.topics[0]
  const peakHour = metrics.messagesByHour.reduce(
    (peak, curr) => (curr.count > peak.count ? curr : peak),
    metrics.messagesByHour[0]
  )

  const yearRange = metrics.firstMessageDate && metrics.lastMessageDate
    ? `${metrics.firstMessageDate.getFullYear()} – ${metrics.lastMessageDate.getFullYear()}`
    : ""

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
        const node = cardRef.current

        // Wait a frame to ensure layout is stable
        await new Promise(resolve => requestAnimationFrame(resolve))

        const rect = node.getBoundingClientRect()
        console.log("Exporting at:", rect.width, "x", rect.height)

        const dataUrl = await toPng(node, {
        backgroundColor: "#0f172a",
        pixelRatio: 2,
        cacheBust: true,
        fetchRequestInit: { cache: "no-cache" },
        skipFonts: false,
        })
        const link = document.createElement("a")
        link.download = "prompt-wrapped.png"
        link.href = dataUrl
        link.click()
    } catch (err) {
        console.error("Export failed:", err)
    } finally {
        setDownloading(false)
    }
  }

  return (
    <div>
        <h2 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Your Wrapped</h2>

        {/* Outer centering wrapper (not captured) */}
        <div className="flex justify-center">
        {/* The actual card — ref here, no margin */}
        <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl text-white"
            style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f59e0b 100%)",
            width: "540px",
            maxWidth: "100%",
            padding: "40px",
            }}
        >
            {/* Decorative corners */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col gap-10">
            <div>
                <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
                Prompt Wrapped {yearRange && `· ${yearRange}`}
                </p>
                <h1 className="text-4xl font-bold leading-tight">
                {metrics.totalMessages.toLocaleString()} messages.<br />
                {metrics.activeDays} days.<br />
                One year of AI.
                </h1>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Stat value={metrics.totalUserWords.toLocaleString()} label="words written" />
                <Stat value={metrics.totalConversations.toString()} label="conversations" />
                <Stat value={`${metrics.longestStreak}`} label="day longest streak" />
                <Stat value={formatHour(peakHour?.hour ?? 0)} label="peak hour" />
            </div>

            <div>
                {topTopic && (
                <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Top topic</p>
                    <p className="text-2xl font-bold">{topTopic.label}</p>
                    <p className="text-sm text-white/80">{topTopic.percentage.toFixed(0)}% of messages</p>
                </div>
                )}
                <p className="text-xs text-white/60 tracking-wide">
                Made with promptwrapped.app
                </p>
            </div>
            </div>
        </div>
        </div>

        <div className="text-center mt-6">
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-white text-slate-900 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {downloading ? "Preparing..." : "⬇ Download my Wrapped"}
        </button>
        </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold leading-none">{value}</p>
      <p className="text-xs uppercase tracking-wider text-white/80 mt-1">{label}</p>
    </div>
  )
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM"
  if (hour === 12) return "12 PM"
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}