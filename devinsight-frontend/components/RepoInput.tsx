"use client";

import { useState } from "react";
import { analyzeRepo } from "../services/api.service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RepoInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

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
      let allStructures = {};
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
          <input
            type="text"
            placeholder="https://github.com/username/repo"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-16 text-lg text-slate-700 outline-none focus:border-sky-400 focus:bg-white transition-all"
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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
