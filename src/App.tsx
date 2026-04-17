import { useState } from "react"

function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const json = JSON.parse(text)
        console.log("Parsed JSON:", json)
        console.log("Top-level keys:", Object.keys(json))
      } catch (err) {
        console.error("Not valid JSON:", err)
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-3">Prompt Wrapped 🎁</h1>
      <p className="text-slate-400 mb-10 text-center max-w-md">
        See what you actually use AI for. 100% private — your data never leaves your browser.
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

      {fileName && (
        <p className="mt-6 text-green-400">
          ✓ Loaded: {fileName} — open the browser console to see the data
        </p>
      )}
    </div>
  )
}

export default App