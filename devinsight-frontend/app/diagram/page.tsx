"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DiagramViewer from "@/components/DiagramViewer"
import { generateDiagram } from "../../services/api.service"

export default function DiagramPage() {

  const [diagram, setDiagram] = useState("")

  const generate = async () => {

    const url = localStorage.getItem("repoUrl") || "";
    const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
    let allStructures = {};
    try { allStructures = JSON.parse(allStructuresStr); } catch(e) {}

    let structure = {};
    if (allStructures[url]) {
      structure = allStructures[url].structure || allStructures[url];
    } else {
      const structureRaw = localStorage.getItem("repoStructure");
      if (structureRaw) {
        const parsed = JSON.parse(structureRaw);
        structure = parsed.structure || parsed;
      }
    }

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
