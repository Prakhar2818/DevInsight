"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DiagramViewer from "@/components/DiagramViewer"

export default function DiagramPage() {
  const [url, setUrl] = useState("")
  const [structure, setStructure] = useState("")

  useEffect(() => {
    const repoUrl = localStorage.getItem("repoUrl") || "";
    setUrl(repoUrl);

    const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
    let allStructures: Record<string, any> = {};
    try { allStructures = JSON.parse(allStructuresStr); } catch(e) {}

    let currentStructure = {};
    if (allStructures[repoUrl]) {
      currentStructure = allStructures[repoUrl].structure || allStructures[repoUrl];
    } else {
      const structureRaw = localStorage.getItem("repoStructure");
      if (structureRaw) {
        const parsed = JSON.parse(structureRaw);
        currentStructure = parsed.structure || parsed;
      }
    }
    
    setStructure(JSON.stringify(currentStructure));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
        Architecture Diagram
      </h1>

      <DiagramViewer repoUrl={url} repoContext={structure} />
    </DashboardLayout>
  )
}
