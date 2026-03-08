"use client"

import { useState } from "react"
import { debugError } from "../services/api.service"

export default function DebugPanel() {

  const [error, setError] = useState("")
  const [result, setResult] = useState("")

  const handleDebug = async () => {

    const res = await debugError(error)

    setResult(res.data.solution)
  }

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 rounded-xl">

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Debug Assistant
      </h2>

      <textarea
        className="border border-[var(--border)] w-full p-4 mt-4 rounded-lg bg-[var(--background)] text-[var(--foreground)]"
        rows={5}
        placeholder="Paste error message"
        onChange={(e) => setError(e.target.value)}
      />

      <button
        onClick={handleDebug}
        className="bg-[var(--accent-error)] text-white px-5 py-2 mt-4 rounded-lg hover:opacity-90 transition-opacity"
      >
        Analyze Error
      </button>

      <div className="mt-6 text-[var(--foreground)]">
        {result}
      </div>

    </div>

  )

}
