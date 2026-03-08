"use client"

import mermaid from "mermaid"
import { useEffect } from "react"

export default function DiagramViewer({ code }: any) {

  useEffect(() => {

    mermaid.initialize({ startOnLoad: true })

    mermaid.contentLoaded()

  }, [code])

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        Architecture Diagram
      </h3>

      <div className="mermaid">
        {code}
      </div>

    </div>

  )

}
