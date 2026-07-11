"use client";

import { useState, useEffect } from "react";
import { analyzeRepo } from "../services/api.service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function RepoInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/repo/github/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGithubRepos(data);
      })
      .catch(err => console.error("Could not fetch github repos", err));
    }
  }, [token]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    
    try {
      const res = await analyzeRepo(url);

      // Save the complete response data including both structure and files
      const dataToSave = {
        repoUrl: url,
        structure: res.data.structure,
        files: res.data.files || [],
      };
      
      // Save to allRepoStructures dictionary to support multiple repos
      const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
      let allStructures: Record<string, any> = {};
      try { allStructures = JSON.parse(allStructuresStr); } catch(e) {}
      allStructures[url] = dataToSave;
      localStorage.setItem("allRepoStructures", JSON.stringify(allStructures));

      // Keep legacy for fallback
      localStorage.setItem("repoStructure", JSON.stringify(dataToSave));
      localStorage.setItem("repoUrl", url);

      // Save to history
      const historyStr = localStorage.getItem("repoHistory");
      let history = historyStr ? JSON.parse(historyStr) : [];
      if (!history.includes(url)) {
        history.unshift(url);
        // Keep last 10 repos
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.setItem("repoHistory", JSON.stringify(history));
      }

      router.push(`/workspace?url=${encodeURIComponent(url)}`);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-[24px] p-8 max-w-2xl mx-auto border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-2 text-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Analyze GitHub Repository
      </motion.h2>
      
      <motion.p 
        className="text-slate-500 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Paste a GitHub repository URL to get started with AI-powered analysis
      </motion.p>

      <div className="relative">
        {/* Input glow effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-200 opacity-0"
          animate={{ opacity: focused ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative"
          animate={{ scale: focused ? 1.01 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-16 text-lg text-slate-700 outline-none focus:border-sky-400 focus:bg-white transition-all"
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              value={url}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              disabled={loading}
            />
            {/* Search icon */}
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              animate={{ scale: focused ? 1.1 : 1 }}
            >
              <svg 
                className="w-6 h-6 text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </motion.div>
          </div>

          {/* GitHub Repos Dropdown */}
          <AnimatePresence>
            {focused && githubRepos.length > 0 && !url && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
              >
                <div className="p-2 sticky top-0 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Your GitHub Repositories
                </div>
                {githubRepos.map(repo => (
                  <div 
                    key={repo.id}
                    className="p-3 hover:bg-sky-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-center justify-between"
                    onClick={() => setUrl(repo.url)}
                  >
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        <svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" className="text-slate-400">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                        </svg>
                        {repo.name}
                      </div>
                      {repo.description && <div className="text-xs text-slate-500 mt-1 truncate max-w-sm">{repo.description}</div>}
                    </div>
                    {repo.private && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">Private</span>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleAnalyze}
        disabled={loading || !url.trim()}
        className="w-full mt-6 py-4 text-lg font-semibold rounded-xl bg-[#feefde] text-slate-900 border border-[#ffdbb5] hover:bg-[#ffdbb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={!loading && url.trim() ? { scale: 1.02 } : {}}
        whileTap={!loading && url.trim() ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex items-center justify-center gap-3"
             >
               <motion.div
                 className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               />
               <span>Analyzing...</span>
             </motion.div>
          ) : (
            <motion.div
               key="default"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex items-center justify-center gap-2"
             >
               <span>Analyze Repository</span>
               <motion.span
                 animate={{ x: [0, 5, 0] }}
                 transition={{ duration: 1, repeat: Infinity }}
               >
                 →
               </motion.span>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Quick suggestions */}
      <motion.div
        className="mt-6 flex flex-wrap gap-2 justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-sm font-medium text-slate-400">Try:</span>
        {["facebook/react", "vercel/next.js", "nestjs/nest"].map((repo, i) => (
          <motion.button
            key={repo}
            onClick={() => setUrl(`https://github.com/${repo}`)}
            className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}
          >
            {repo}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
