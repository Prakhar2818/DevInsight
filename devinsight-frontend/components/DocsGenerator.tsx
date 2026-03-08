"use client"

import { generateDocs } from "../services/api.service"

export default function DocsGenerator() {

  const handleGenerate = async () => {

    const res = await generateDocs("repoUrl")

    window.open(res.data.downloadUrl)
  }

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 rounded-xl">

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Documentation Generator
      </h2>

      <p className="text-[var(--foreground-secondary)] mt-2">
        Generate full project documentation.
      </p>

      <button
        onClick={handleGenerate}
        className="bg-[var(--accent-success)] text-white px-6 py-2 mt-4 rounded-lg hover:opacity-90 transition-opacity"
      >
        Download Docs
      </button>

    </div>

  )

}
