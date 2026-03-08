"use client"

import { useState } from "react"
import { askRepo } from "../services/api.service"

export default function AIChat() {

  const [question,setQuestion]=useState("")
  const [messages,setMessages]=useState<any[]>([])

  const ask = async () => {
    if (!question.trim()) return

    const res = await askRepo(question, localStorage.getItem("repoUrl") || "repo")

    setMessages([
      ...messages,
      {role:"user",text:question},
      {role:"ai",text:res.data.answer}
    ])

    setQuestion("")
  }

  return (

    <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">

      <h3 className="font-semibold mb-4 text-[var(--foreground)]">
        Ask DevInsight AI
      </h3>

      <div className="h-60 overflow-auto mb-4">

        {messages.map((m,i)=>(
          <div key={i} className="mb-2">

            <b className={m.role === "user" ? "text-[var(--primary-600)]" : "text-[var(--accent-info)]"}>{m.role==="user"?"You":"AI"}:</b>
            <p className="text-[var(--foreground)]">{m.text}</p>

          </div>
        ))}

      </div>

      <input
        className="border border-[var(--border)] w-full p-2 rounded-lg bg-[var(--background)] text-[var(--foreground)]"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />

      <button
        onClick={ask}
        className="bg-[var(--primary-600)] text-white px-4 py-2 mt-2 rounded-lg hover:bg-[var(--primary-700)] transition-colors"
      >
        Ask
      </button>

    </div>

  )

}
