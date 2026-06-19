"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { analyzeParser } from "../../services/api.service";
import DashboardLayout from "@/components/DashboardLayout";
import AnalysisLoader from "@/components/AnalysisLoader";
import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";

export default function AnalyzerPage() {
  const [structure, setStructure] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [repoPath, setRepoPath] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");

  useEffect(() => {
    const data = localStorage.getItem("repoStructure");
    const storedUrl = localStorage.getItem("repoUrl") || "";

    if (data && storedUrl) {
      const parsed = JSON.parse(data);
      setStructure(parsed.structure || parsed);
      
      const name = storedUrl.split('/').pop()?.replace('.git', '');
      const path = `repos/${name}`;
      setRepoPath(path);

      analyzeParser(path).then((res) => {
        setMetadata(res.data.metadata);
        setLoading(false);
      }).catch((err) => {
        console.error("Error getting analysis:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col overflow-y-auto scrollbar-hide">
        <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)] flex-shrink-0">Repository Analysis</h1>

        {loading && <AnalysisLoader />}

        {/* Metadata Grid */}
        {metadata && !loading && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Framework</p>
              <p className="text-lg font-bold text-[var(--foreground)]">{metadata.framework}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Language</p>
              <p className="text-lg font-bold text-[var(--foreground)]">{metadata.language}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Database</p>
              <p className="text-lg font-bold text-[var(--foreground)]">{metadata.database}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">ORM</p>
              <p className="text-lg font-bold text-[var(--foreground)]">{metadata.orm}</p>
            </div>
          </div>
        )}

        {/* Next Steps / CTAs */}
        {!loading && metadata && (
          <div className="mt-8 bg-white p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center max-w-2xl mx-auto flex-shrink-0">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Analysis Complete!</h2>
            <p className="text-[var(--foreground-secondary)] mb-6 text-lg">
              We have successfully parsed the repository structure and extracted the tech stack.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/workspace"
                className="px-6 py-3 bg-[#feefde] border border-[#ffdbb5] text-black rounded-lg font-semibold hover:bg-[#ffdbb5] transition-colors shadow-sm flex items-center justify-center"
              >
                <span className="text-black">Open Workspace</span>
              </Link>
              <a 
                href="/chat"
                className="px-6 py-3 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Ask AI Assistant
              </a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
