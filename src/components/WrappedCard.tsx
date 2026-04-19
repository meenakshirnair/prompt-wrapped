import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import type { Metrics } from "../types"

interface Props {
  metrics: Metrics
}

export function WrappedCard({ metrics }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [copied, setCopied] = useState(false)

  const topTopic = metrics.topics[0]
  const peakHour = metrics.messagesByHour.reduce(
    (peak, curr) => (curr.count > peak.count ? curr : peak),
    metrics.messagesByHour[0]
  )
  const yearRange = metrics.firstMessageDate && metrics.lastMessageDate
    ? `${metrics.firstMessageDate.getFullYear()} – ${metrics.lastMessageDate.getFullYear()}`
    : "MMXXVI"

  // The suggested caption — auto-generated from user's data, copyable
  const caption = `My year in AI, in numbers:

${metrics.totalMessages.toLocaleString()} messages across ${metrics.totalConversations} conversations.
${metrics.totalUserWords.toLocaleString()} words written.
Most-asked topic: ${topTopic?.label ?? "—"} (${topTopic?.percentage.toFixed(0) ?? "0"}%).

Built a free tool to make this — runs entirely in your browser, works with both Claude and ChatGPT exports.

Try yours: https://prompt-wrapped.vercel.app`

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const node = cardRef.current
      await new Promise(resolve => requestAnimationFrame(resolve))
      const rect = node.getBoundingClientRect()
      const width = Math.ceil(rect.width)
      const height = Math.ceil(rect.height)

      const dataUrl = await toPng(node, {
        backgroundColor: "#f2eee3",
        pixelRatio: 2,
        canvasWidth: width * 2,
        canvasHeight: height * 2,
        width,
        height,
        cacheBust: true,
      })
      const link = document.createElement("a")
      link.download = "prompt-wrapped.png"
      link.href = dataUrl
      link.click()
      setHasDownloaded(true)
    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  const handleShareLinkedIn = () => {
    const url = "https://prompt-wrapped.vercel.app"
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  return (
    <div>
      {/* Centering wrapper — not captured */}
      <div className="flex justify-center">
        {/* THE COVER */}
        <div
          ref={cardRef}
          style={{
            width: "540px",
            maxWidth: "100%",
            background: "#f2eee3",
            color: "#1a1a1a",
            border: "6px solid #1a1a1a",
            padding: "40px 36px",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Masthead */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "12px",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff5722" }} />
              <span>Prompt Wrapped</span>
              <span style={{ color: "#6b6b6b" }}>/ Issue Nº 01</span>
            </div>
            <span style={{ fontFamily: "ui-monospace, monospace", color: "#6b6b6b" }}>{yearRange}</span>
          </div>

          {/* Kicker */}
          <p style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "#6b6b6b",
            fontWeight: 500,
            margin: "32px 0 12px 0",
          }}>
            The cover story
          </p>

          {/* Hero headline */}
          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "64px",
            lineHeight: 0.95,
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}>
            {metrics.totalMessages.toLocaleString()}<br />
            messages.
          </h1>

          <p style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "18px",
            lineHeight: 1.3,
            color: "#6b6b6b",
            margin: "0 0 32px 0",
          }}>
            Across {metrics.totalConversations} conversations, {metrics.activeDays} different days.
          </p>

          {/* Stat grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px 32px",
            paddingTop: "24px",
            borderTop: "1px solid #1a1a1a",
          }}>
            <Fact label="Words written" value={metrics.totalUserWords.toLocaleString()} />
            <Fact label="Longest streak" value={`${metrics.longestStreak} days`} />
            <Fact label="Peak hour" value={formatHour(peakHour?.hour ?? 0)} />
            <Fact label="Avg. prompt" value={`${Math.round(metrics.avgUserWordsPerMessage)} words`} />
          </div>

          {/* Pull quote */}
          {topTopic && (
            <div style={{
              marginTop: "36px",
              paddingTop: "20px",
              borderTop: "1px solid #1a1a1a",
            }}>
              <p style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "#6b6b6b",
                fontWeight: 500,
                margin: "0 0 8px 0",
              }}>
                Most of all
              </p>
              <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "28px",
                lineHeight: 1.2,
                margin: 0,
              }}>
                You asked about <span style={{ color: "#ff5722", fontStyle: "italic" }}>{topTopic.label.toLowerCase()}</span>.<br />
                <span style={{ color: "#6b6b6b", fontSize: "16px", fontStyle: "italic" }}>
                  {topTopic.percentage.toFixed(0)}% of everything.
                </span>
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid #1a1a1a",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9px",
            fontFamily: "ui-monospace, monospace",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#6b6b6b",
          }}>
            <span>Edition of one</span>
            <span>·   ·   ·</span>
            <span>promptwrapped.app</span>
          </div>
        </div>
      </div>

      {/* Action zone — outside the card */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-[11px] uppercase tracking-editorial font-medium border border-ink dark:border-paper px-6 py-3 hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors disabled:opacity-50"
          >
            {downloading ? "Preparing..." : hasDownloaded ? "Download again ↻" : "Download cover →"}
          </button>

            <button
              onClick={handleShareLinkedIn}
              className="text-[11px] uppercase tracking-editorial font-medium border border-pop bg-pop text-paper px-6 py-3 hover:bg-ink hover:border-ink transition-colors"
            >
              Share to LinkedIn ↗
            </button>
        </div>

        {/* After-download caption helper */}
          <div className="mt-6 max-w-xl w-full border border-divider dark:border-divider-dark p-6">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark font-medium">
                Suggested caption
              </p>
              <button
                onClick={handleCopyCaption}
                className="text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark hover:text-pop transition-colors"
              >
                {copied ? "Copied ✓" : "Copy →"}
              </button>
            </div>
            <p className="font-display text-base leading-relaxed text-ink dark:text-paper whitespace-pre-line">
              {caption}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-editorial text-subink dark:text-subink-dark">
              Download the cover, then share to LinkedIn with this caption.
            </p>
          </div>
      </div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: "#6b6b6b",
        fontWeight: 500,
        margin: "0 0 6px 0",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: "32px",
        lineHeight: 1,
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  )
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM"
  if (h === 12) return "12 PM"
  if (h < 12) return `${h} AM`
  return `${h - 12} PM`
}