"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DiagramViewer from "@/components/DiagramViewer"
import { generateDiagram } from "../../services/api.service"

export default function DiagramPage() {

  const [diagram, setDiagram] = useState("")

  const generate = async () => {

    const structure = JSON.parse(
      localStorage.getItem("repoStructure") || "{}"
    )

    const res = await generateDiagram(structure)

    setDiagram(res.data.diagram)
  }

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
        Architecture Diagram
      </h1>

      <button
        onClick={generate}
        className="bg-[var(--primary-600)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-700)] transition-colors"
      >
        Generate Diagram
      </button>

      {diagram && <DiagramViewer code={diagram} />}

    </DashboardLayout>

  )

}
