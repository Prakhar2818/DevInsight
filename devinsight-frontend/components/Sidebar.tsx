"use client"

import Link from "next/link"
import DashboardIcon from "@mui/icons-material/Dashboard"
import BugReportIcon from "@mui/icons-material/BugReport"
import ArchitectureIcon from "@mui/icons-material/Architecture"
import DescriptionIcon from "@mui/icons-material/Description"
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer"
import CodeIcon from "@mui/icons-material/Code"

export default function Sidebar() {

  const navItems = [
    { href: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { href: "/analyzer", icon: <ArchitectureIcon />, label: "Repo Analyzer" },
    { href: "/debug", icon: <BugReportIcon />, label: "Debug Assistant" },
    { href: "/diagram", icon: <ArchitectureIcon />, label: "Diagrams" },
    { href: "/docs", icon: <DescriptionIcon />, label: "Documentation" },
    { href: "/parser", icon: <CodeIcon />, label: "Code Parser" },
    { href: "/ask", icon: <QuestionAnswerIcon />, label: "Ask AI" },
  ]

  return (

    <aside className="w-64 bg-[var(--background-secondary)] border-r border-[var(--border)] h-screen p-6">

      <h2 className="text-xl font-bold mb-8 text-[var(--primary-600)]">
        DevInsight AI
      </h2>

      <nav className="flex flex-col gap-3">

        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex gap-3 items-center p-3 rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
          >
            <span className="text-[var(--primary-500)]">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

      </nav>

    </aside>

  )
}
