"use client"

import Link from "next/link"
import { 
  LayoutDashboard, 
  FolderTree, 
  SearchCode, 
  MessageSquare, 
  Bug, 
  GitMerge, 
  Share2, 
  FileText, 
  ShieldCheck, 
  PackageSearch, 
  Activity, 
  BrainCircuit 
} from "lucide-react"

export default function Sidebar() {

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/workspace", icon: <FolderTree size={20} />, label: "Workspace" },
    { href: "/chat", icon: <MessageSquare size={20} />, label: "AI Chat" },
    { href: "/debug", icon: <Bug size={20} />, label: "Debug Assistant" },
    { href: "/tracer", icon: <GitMerge size={20} />, label: "Flow Tracer" },
    { href: "/diagrams", icon: <Share2 size={20} />, label: "Architecture Diagrams" },
    { href: "/docs", icon: <FileText size={20} />, label: "Documentation" },
    { href: "/security", icon: <ShieldCheck size={20} />, label: "Security Scanner" },
    { href: "/dependencies", icon: <PackageSearch size={20} />, label: "Dependencies" },
    { href: "/health", icon: <Activity size={20} />, label: "Health Score" },
    { href: "/architect", icon: <BrainCircuit size={20} />, label: "AI Architect" },
  ]

  return (
    <aside className="w-64 bg-[var(--background-secondary)] border-r border-[var(--border)] h-screen p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm tracking-wider">DI</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          DevInsight <span className="text-[#38bdf8]">AI</span>
        </h2>
      </div>

      <nav className="flex flex-col gap-2 overflow-y-auto pb-20 custom-scrollbar">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex gap-3 items-center p-3 rounded-lg text-[var(--foreground-secondary)] hover:text-[#38bdf8] hover:bg-[var(--primary-50)] transition-colors"
          >
            <span className="text-[#38bdf8]">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
