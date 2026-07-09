"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bug, Sparkles, Loader2, ArrowRight, History, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DebugAssistantPage() {
  const [errorLog, setErrorLog] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    import("@/services/api.service").then(({ getDebugHistory }) => {
      getDebugHistory()
        .then((res) => setHistory(res.data))
        .catch(console.error);
    });
  }, []);

  const handleAnalyze = async () => {
    if (!errorLog.trim()) return;
    
    setIsLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("http://localhost:4000/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errorLog }),
      });

      const data = await res.json();
      setAnalysis(data.analysis || data.solution || "No analysis returned.");
    } catch (err) {
      console.error("Debug analysis error:", err);
      setAnalysis("Error: Failed to analyze the log. Ensure the local AI is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Side: Input */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <Bug size={18} />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Error Log Input</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-3 py-2 bg-white border border-[var(--border)] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <History className="w-4 h-4" />
                History
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !errorLog.trim()}
                className="px-4 py-2 bg-[#feefde] border border-[#ffdbb5] text-slate-900 rounded-lg font-semibold hover:bg-[#ffdbb5] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analyze
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-slate-900 relative">
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste your stack trace, error message, or terminal output here..."
              className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm resize-none outline-none custom-scrollbar placeholder:text-slate-600"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center text-white shadow-sm">
              <Sparkles size={18} />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">AI Diagnosis</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-50">
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div>
                  <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div>
                  <div className="h-5 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-24 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="flex items-center gap-3 text-slate-400 justify-center mt-10">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="font-medium">AI is hunting down the bug...</p>
                </div>
              </div>
            ) : analysis ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate max-w-none text-[var(--foreground-secondary)] whitespace-pre-wrap leading-relaxed"
              >
                {typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Bug className="w-16 h-16 opacity-20" />
                <p className="text-center max-w-sm">
                  Paste an error log on the left and click Analyze. The AI will determine the root cause and provide a fix.
                </p>
                <ArrowRight className="w-6 h-6 animate-bounce hidden lg:block" />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* History Drawer */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-[80px] h-[calc(100vh-80px)] w-96 bg-white border-l border-[var(--border)] shadow-2xl flex flex-col z-50"
          >
            <div className="p-4 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                  <History size={16} />
                </div>
                <h3 className="font-bold text-[var(--foreground)]">Debug History</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-slate-50">
              {history.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No debug history found.</p>
                </div>
              ) : (
                history.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => {
                      setErrorLog(h.error);
                      setAnalysis(h.solution || h.analysis || "No analysis recorded.");
                      setIsHistoryOpen(false);
                    }}
                    className="w-full text-left bg-white border border-[var(--border)] p-4 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group flex flex-col gap-2"
                  >
                    <div className="flex items-start gap-2 text-red-500">
                      <Bug size={14} className="mt-1 flex-shrink-0" />
                      <p className="font-mono text-xs line-clamp-2 leading-tight break-all">
                        {h.error}
                      </p>
                    </div>
                    {h.cause && (
                      <p className="text-xs text-slate-500 font-medium">Cause: {h.cause}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
