"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useState } from "react"
import { askRepo } from "../../services/api.service"

export default function AskPage() {

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const handleAsk = async () => {

    const repoUrl = localStorage.getItem("repoUrl") || "storedRepo"

    const res = await askRepo(question, repoUrl)

    setAnswer(res.data.answer)
  }

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        Ask Repository
      </h1>

      <input
        className="border border-[var(--border)] w-full p-3 mt-6 rounded-lg bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]"
        placeholder="Ask a question about this repo"
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="bg-[var(--primary-600)] text-white px-6 py-2 mt-4 rounded-lg hover:bg-[var(--primary-700)] transition-colors"
      >
        Ask AI
      </button>

      <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 mt-6 text-[var(--foreground)]">
        {answer}
      </div>

    </DashboardLayout>

  )

}
