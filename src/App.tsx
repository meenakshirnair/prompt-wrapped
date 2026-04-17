import { useState } from "react"
import { parseClaude } from "./lib/parseClaude"
import type { NormalizedData } from "./types"

function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [data, setData] = useState<NormalizedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    setFileName(file.name)
    setError(null)
    setData(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const json = JSON.parse(text)

        // Claude exports are an array at the top level.
        if (!Array.isArray(json)) {
          setError("This doesn't look like a Claude export. Expected an array of conversations.")
          return
        }

        const parsed = parseClaude(json)
        setData(parsed)
        console.log("Parsed:", parsed)
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

  const totalMessages = data?.conversations.reduce(
    (sum, c) => sum + c.messages.length,
    0
  ) ?? 0

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-3">Prompt Wrapped 🎁</h1>
      <p className="text-slate-400 mb-10 text-center max-w-md">
        See what you actually use AI for. 100% private, your data never leaves your browser.
      </p>

      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
          isDragging ? "border-purple-400 bg-slate-800" : "border-slate-600 hover:border-slate-400"
        }`}
      >
        <input type="file" accept=".json" onChange={handleSelect} className="hidden" />
        <p className="text-lg mb-2">Drag your conversations.json here</p>
        <p className="text-sm text-slate-500">or click to choose a file</p>
      </label>

      {error && (
        <p className="mt-6 text-red-400">⚠ {error}</p>
      )}

      {data && (
        <div className="mt-10 bg-slate-800 rounded-xl p-6 max-w-lg w-full">
          <p className="text-green-400 mb-4">✓ Loaded: {fileName}</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{data.conversations.length}</p>
              <p className="text-sm text-slate-400">Conversations</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{totalMessages.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Messages</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App