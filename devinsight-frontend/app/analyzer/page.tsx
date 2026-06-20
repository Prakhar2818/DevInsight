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
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [repoPath, setRepoPath] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    import("@/services/api.service").then(({ getRepoHistory }) => {
      getRepoHistory()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const uniqueUrls = Array.from(new Set(res.data.map((r: any) => r.repoUrl))) as string[];
            setHistory(uniqueUrls);
          } else {
            setHistory([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load repo history", err);
          setHistory([]);
        });
    });

    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('url');
    const storedUrl = urlParam || localStorage.getItem("repoUrl") || "";

    const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
    let allStructures = {};
    try { allStructures = JSON.parse(allStructuresStr); } catch(e) {}
    
    let parsedStructure = null;
    if (allStructures[storedUrl]) {
      parsedStructure = allStructures[storedUrl].structure || allStructures[storedUrl];
    } else {
      const data = localStorage.getItem("repoStructure");
      if (data) {
        const parsed = JSON.parse(data);
        parsedStructure = parsed.structure || parsed;
      }
    }

    if (parsedStructure && storedUrl) {
      setRepoUrl(storedUrl);
      setStructure(parsedStructure);
      
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

      // Fetch AI Intelligence
      fetch('http://localhost:4000/repo/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: storedUrl, structure: parsedStructure })
      })
      .then(res => res.json())
      .then(data => {
        setAiAnalysis(data.result?.analysis || data.analysis || "Could not generate analysis.");
        setAiLoading(false);
      })
      .catch(err => {
        console.error("Error fetching AI analysis:", err);
        setAiAnalysis("Error fetching AI analysis. Make sure the local LLM is running.");
        setAiLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="mb-4 flex-shrink-0 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Repository Analysis</h1>
            {repoUrl && <p className="text-[var(--foreground-secondary)]">{repoUrl}</p>}
          </div>
          
          <div className="flex gap-4 items-center">
            {history.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-[var(--foreground-secondary)]">Recent Repositories:</span>
                <select 
                  className="bg-white border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[#38bdf8] shadow-sm cursor-pointer"
                  value={repoUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    window.location.href = `/analyzer?url=${encodeURIComponent(newUrl)}`;
                  }}
                >
                  {history.map(url => (
                    <option key={url} value={url}>{url.split('/').slice(-2).join('/')}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {loading && <AnalysisLoader />}

        {/* Metadata Grid */}
        {metadata && !loading && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Framework</p>
              <p className="text-lg font-bold text-[#38bdf8]">{metadata.framework}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Language</p>
              <p className="text-lg font-bold text-[#38bdf8]">{metadata.language}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Database</p>
              <p className="text-lg font-bold text-[#38bdf8]">{metadata.database}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">ORM</p>
              <p className="text-lg font-bold text-[#38bdf8]">{metadata.orm}</p>
            </div>
          </div>
        )}

        {/* AI Intelligence Analysis */}
        {metadata && !loading && (
          <div className="mb-8 bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex-shrink-0">
            <div className="p-5 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">AI Architecture Analysis</h2>
              </div>
              <Link 
                href="/workspace"
                className="px-4 py-2 bg-[#feefde] border border-[#ffdbb5] text-black rounded-lg font-semibold hover:bg-[#ffdbb5] transition-colors shadow-sm text-sm"
              >
                Open Workspace
              </Link>
            </div>
            <div className="p-6">
              {aiLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mt-6"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none text-[var(--foreground-secondary)] whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
