"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Shield, Zap, Search } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaGitlab, FaBitbucket } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative w-full pt-40 pb-32 overflow-hidden flex flex-col items-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-white" />
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ 
          background: 'radial-gradient(circle at top left, #fdba74 0%, transparent 40%), radial-gradient(circle at top right, #38bdf8 0%, transparent 40%), radial-gradient(circle at center 70%, #ffffff 0%, transparent 60%)'
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Main Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            DevInsight 2.0 is live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
            Elevate your Code,<br />Architecture and Success.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-light">
            Paste a GitHub URL and instantly visualize project structure,
            generate architecture diagrams, and get AI explanations for any line of code.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/signup">
              <button 
                className="px-6 py-3 rounded-md transition-colors flex items-center gap-2"
                style={{ background: '#0f172a', color: '#ffffff' }}
              >
                Schedule a demo <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                Login
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating 3D Interface Mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl mt-20"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 flex flex-col md:flex-row gap-6 rounded-2xl shadow-xl shadow-slate-200/50">
            {/* Sidebar Mock */}
            <div className="w-16 hidden md:flex flex-col gap-6 items-center pt-4 border-r border-slate-100 pr-6">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 font-bold mb-4">D</div>
              <div className="w-5 h-5 rounded bg-slate-200" />
              <div className="w-5 h-5 rounded bg-slate-200" />
              <div className="w-5 h-5 rounded bg-slate-200" />
            </div>

            {/* Main Content Mock */}
            <div className="flex-1">
              <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md shadow-blue-200 flex items-center justify-center text-white">
                  <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-slate-800">Hi, Developer!</h3>
                  <p className="text-slate-500">What repository can I analyze today?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-start hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-slate-800 mb-2">Repository Analyzer</h4>
                  <p className="text-sm text-slate-500 mb-4">Visualize and chat with codebase architectures.</p>
                  <div className="mt-auto w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-sky-400 rounded-full" />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-start hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-slate-800 mb-2">Debug Assistant</h4>
                  <p className="text-sm text-slate-500 mb-4">Trace errors and find root causes instantly.</p>
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center ml-auto">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-6"
        >
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-sky-50 text-sky-700 font-medium text-sm">
            <Zap className="w-4 h-4" /> AI-Powered
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm">
            <Shield className="w-4 h-4" /> Secure & Private
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-50 text-orange-700 font-medium text-sm">
            <Code2 className="w-4 h-4" /> Robust Engine
          </div>
        </motion.div>
        
        {/* Integrations */}
        <div className="mt-32 w-full max-w-4xl border-t border-slate-200 pt-16">
          <p className="text-sm text-slate-400 mb-8 uppercase tracking-widest font-semibold">
            Natively integrates with your ecosystem
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <FaGithub /> GitHub
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <FaGitlab /> GitLab
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <FaBitbucket /> Bitbucket
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
