"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DiagramViewer from "@/components/DiagramViewer"
import { generateDiagram } from "../../services/api.service"

export default function DiagramPage() {

  const [diagram, setDiagram] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    const url = localStorage.getItem("repoUrl") || "";
    const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
    let allStructures: Record<string, any> = {};
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

    setLoading(true);
    try {
      const res = await generateDiagram(url, structure)
      setDiagram(res.data.diagram)
    } catch (error) {
      console.error("Failed to generate diagram:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
        Architecture Diagram
      </h1>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-[var(--primary-600)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-700)] transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Diagram"}
      </button>

      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center p-12 border border-slate-200 rounded-xl bg-slate-50">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#38bdf8] rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Analyzing architecture and generating diagram...</p>
        </div>
      ) : (
        diagram && <DiagramViewer code={diagram} />
      )}
    </DashboardLayout>
  )

}
