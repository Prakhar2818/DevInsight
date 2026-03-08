"use client";

import { useState } from "react";
import { analyzeRepo } from "../services/api.service";
import { useRouter } from "next/navigation";

export default function RepoInput() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    const res = await analyzeRepo(url);

    // Save the complete response data including both structure and files
    const dataToSave = {
      repoUrl: url,
      structure: res.data.structure,
      files: res.data.files || [],
    };
    
    localStorage.setItem("repoStructure", JSON.stringify(dataToSave));
    localStorage.setItem("repoUrl", url);

    router.push("/analyzer");
  };

  return (
    <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Analyze GitHub Repository</h2>

      <input
        type="text"
        placeholder="Paste repository URL"
        className="border border-[var(--border)] w-full p-3 rounded-lg bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]"
        onChange={(e) => setUrl(e.target.value)}
        value={url}
      />

      <button
        onClick={handleAnalyze}
        className="bg-[var(--primary-600)] text-white px-6 py-2 rounded-lg mt-4 hover:bg-[var(--primary-700)] transition-colors"
      >
        Analyze
      </button>
    </div>
  );
}
