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
      
      localStorage.setItem("repoStructure", JSON.stringify(dataToSave));
      localStorage.setItem("repoUrl", url);

      router.push("/analyzer");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-2 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Analyze GitHub Repository
      </motion.h2>
      
      <motion.p 
        className="text-foreground-secondary mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Paste a GitHub repository URL to get started with AI-powered analysis
      </motion.p>

      <div className="relative">
        {/* Input glow effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-cyan opacity-0"
          animate={{ opacity: focused ? 0.5 : 0 }}
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
            className="input-glass w-full p-4 pr-32 text-lg"
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={url}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          
          {/* Search icon */}
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2"
            animate={{ scale: focused ? 1.1 : 1 }}
          >
            <svg 
              className="w-6 h-6 text-foreground-muted" 
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
        className="btn-primary w-full mt-6 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
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
        className="mt-6 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-sm text-foreground-muted">Try:</span>
        {["facebook/react", "vercel/next.js", "nestjs/nest"].map((repo, i) => (
          <motion.button
            key={repo}
            onClick={() => setUrl(`https://github.com/${repo}`)}
            className="text-sm px-3 py-1 rounded-full bg-white/5 text-foreground-secondary hover:text-foreground hover:bg-white/10 transition-colors"
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
