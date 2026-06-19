"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Cloud, Server, Database, Key, Bug, GitBranch, Zap, FileSearch, BookOpen, History } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-sky-500" />,
      title: "Interactive Code Viewer",
      desc: "Navigate complex repositories with full syntax highlighting and line-by-line AI explanations.",
    },
    {
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
      title: "Architecture Visualization",
      desc: "Auto-generate UML, flowcharts, and component diagrams to grasp the big picture instantly.",
    },
    {
      icon: <Cloud className="w-6 h-6 text-orange-500" />,
      title: "Runtime Error Debugger",
      desc: "Paste your error logs and let our AI pinpoint the exact root cause across your entire codebase.",
    },
    {
      icon: <Key className="w-6 h-6 text-emerald-500" />,
      title: "Automated Documentation",
      desc: "Generate comprehensive technical specs and function-level documentation directly from source.",
    },
  ];

  return (
    <section className="pt-32 pb-16 relative z-10 w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-left"
            >
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {feature.desc}
              </p>
              <button className="text-xs font-semibold text-sky-500 hover:text-sky-600 uppercase tracking-wider flex items-center gap-1 group">
                Get Started <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Big Security Section */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Comprehensive <br /> Codebase Mastery
          </h2>
          <p className="text-lg text-slate-600">Everything a new developer needs to onboard, understand, and debug an unfamiliar project in record time.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-50 border border-slate-100 rounded-2xl transform rotate-12 group-hover:rotate-6 transition-transform duration-700 flex items-center justify-center shadow-lg">
              <Server className="w-10 h-10 text-sky-400" />
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-500" />
              <span className="text-slate-800 font-semibold">Context-Aware AI Chat</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100 group-hover:scale-110 transition-transform duration-500 shadow-md">
                <Database className="w-10 h-10 text-sky-500" />
              </div>
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-500" />
              <span className="text-slate-800 font-semibold">Instant Visual Diagrams</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-40 h-40 border-2 border-indigo-100 rounded-full flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <div className="w-24 h-24 border-2 border-indigo-200 rounded-full" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Bug className="w-12 h-12 text-indigo-500 group-hover:-translate-y-2 transition-transform duration-500" />
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <span className="text-slate-800 font-semibold">Smart Error Debugging</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
               <div className="w-12 h-16 bg-slate-50 rounded-xl border border-slate-200 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 shadow-sm" />
               <div className="w-12 h-16 bg-slate-50 rounded-xl border border-slate-200 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-sm" />
               <div className="w-12 h-16 bg-slate-50 rounded-xl border border-slate-200 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-150 shadow-sm" />
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-800 font-semibold">Seamless Repo Sync</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-orange-50 border border-orange-100 rounded-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-md">
                <BookOpen className="w-12 h-12 text-orange-400" />
              </div>
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-orange-500" />
              <span className="text-slate-800 font-semibold">Automated Documentation</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-end hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-2 border-dashed border-sky-200 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 border-2 border-dashed border-sky-300/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <History className="w-10 h-10 text-sky-400 group-hover:scale-125 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-auto flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" />
              <span className="text-slate-800 font-semibold">Saved Analysis History</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
