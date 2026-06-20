"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";
import ChatAssistant from "@/components/ChatAssistant";
import RepoInput from "@/components/RepoInput";
import AnalysisLoader from "@/components/AnalysisLoader";
import { MessageSquare } from "lucide-react";
import { analyzeParser, repoIntelligence } from "../../services/api.service";

export default function Workspace() {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [repoPath, setRepoPath] = useState<string>("");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('url');
    const storedUrl = urlParam || localStorage.getItem("repoUrl") || "";
    
    if (storedUrl) {
      setRepoUrl(storedUrl);
      const name = storedUrl.split('/').pop()?.replace('.git', '');
      const path = `repos/${name}`;
      setRepoPath(path);
      localStorage.setItem("repoUrl", storedUrl);

      // Fetch Architecture if available
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

      if (parsedStructure) {
        setLoading(true);
        setAiLoading(true);

        analyzeParser(path).then((res) => {
          setMetadata(res.data.metadata);
          setLoading(false);
        }).catch((err) => {
          console.error("Error getting analysis:", err);
          setLoading(false);
        });

        repoIntelligence({ repoUrl: storedUrl, structure: parsedStructure })
          .then((res) => {
            setAiAnalysis(res.data.result?.analysis || res.data.analysis || "Could not generate analysis.");
            setAiLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching AI analysis:", err);
            setAiAnalysis("Error fetching AI analysis.");
            setAiLoading(false);
          });
      }
    }

    import("@/services/api.service").then(({ getRepoHistory }) => {
      getRepoHistory()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            // Filter unique URLs to avoid duplicates in dropdown
            const uniqueUrls = Array.from(new Set(res.data.map((r: any) => r.repoUrl))) as string[];
            setHistory(uniqueUrls);
          } else {
            setHistory([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load repo history from database", err);
          setHistory([]);
        });
    });
  }, []);

  const handleSelectRepo = (url: string) => {
    window.location.href = `/workspace?url=${encodeURIComponent(url)}`;
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col relative">
        <div className="mb-4 flex-shrink-0 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Workspace</h1>
            <p className="text-[var(--foreground-secondary)]">{repoUrl}</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {history.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-[var(--foreground-secondary)]">Recent Repositories:</span>
                <select 
                  className="bg-white border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[#38bdf8] shadow-sm cursor-pointer"
                  value={repoUrl}
                  onChange={(e) => handleSelectRepo(e.target.value)}
                >
                  {history.map(url => (
                    <option key={url} value={url}>{url.split('/').slice(-2).join('/')}</option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedFilePath && (
              <button 
                onClick={() => setIsAnalysisModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                See Full Analysis
              </button>
            )}

            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-4 py-2 bg-[#feefde] border border-[#ffdbb5] text-slate-900 rounded-lg font-semibold hover:bg-[#ffdbb5] transition-colors shadow-sm flex items-center gap-2"
            >
              <MessageSquare size={18} />
              Ask AI
            </button>
          </div>
        </div>

        {loading && <AnalysisLoader />}

        {!repoPath && !loading ? (
          <div className="flex-1 flex items-center justify-center">
            <RepoInput />
          </div>
        ) : repoPath && !loading ? (
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Sidebar: File Explorer */}
            <div className="w-80 flex-shrink-0">
              <FileTree 
                repoPath={repoPath} 
                onFileSelect={(path) => setSelectedFilePath(path)} 
              />
            </div>

            {/* Main: Code Viewer or Architecture Overview */}
            <div className="flex-1 min-w-0 pr-0 overflow-y-auto custom-scrollbar">
              {selectedFilePath ? (
                <CodeViewer repoPath={repoPath} filePath={selectedFilePath} />
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Metadata Grid */}
                  {metadata && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                        <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Framework</p>
                        <p className="text-lg font-bold text-[#38bdf8]">{metadata.framework}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                        <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Language</p>
                        <p className="text-lg font-bold text-[#38bdf8]">{metadata.language}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                        <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Database</p>
                        <p className="text-lg font-bold text-[#38bdf8]">{metadata.database}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                        <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">ORM</p>
                        <p className="text-lg font-bold text-[#38bdf8]">{metadata.orm}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Intelligence Analysis */}
                  <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex-shrink-0">
                    <div className="p-5 border-b border-[var(--border)] bg-slate-50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Architecture Overview</h2>
                    </div>
                    <div className="p-6">
                      {aiLoading ? (
                        <div className="space-y-4 animate-pulse">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-4 bg-slate-200 rounded w-full"></div>
                          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                          <div className="h-4 bg-slate-200 rounded w-2/3 mt-6"></div>
                        </div>
                      ) : aiAnalysis ? (
                        <div className="prose prose-slate max-w-none text-[var(--foreground-secondary)] whitespace-pre-wrap leading-relaxed">
                          {aiAnalysis}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">Select a file from the explorer to view its contents, or wait for the architectural analysis to generate.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Chat Assistant Overlay */}
        <ChatAssistant 
          repoUrl={repoUrl} 
          selectedFile={selectedFilePath} 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />

        {/* Architecture Analysis Modal */}
        {isAnalysisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Architecture Overview</h2>
                </div>
                <button 
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                {/* Metadata Grid */}
                {metadata && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                      <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Framework</p>
                      <p className="text-lg font-bold text-[#38bdf8]">{metadata.framework}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                      <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Language</p>
                      <p className="text-lg font-bold text-[#38bdf8]">{metadata.language}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                      <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">Database</p>
                      <p className="text-lg font-bold text-[#38bdf8]">{metadata.database}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
                      <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold mb-1">ORM</p>
                      <p className="text-lg font-bold text-[#38bdf8]">{metadata.orm}</p>
                    </div>
                  </div>
                )}

                {/* AI Intelligence Analysis */}
                <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex-shrink-0">
                  <div className="p-6">
                    {aiLoading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3 mt-6"></div>
                      </div>
                    ) : aiAnalysis ? (
                      <div className="prose prose-slate max-w-none text-[var(--foreground-secondary)] whitespace-pre-wrap leading-relaxed">
                        {aiAnalysis}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No analysis generated yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
