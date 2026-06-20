"use client";

import { useState, useEffect } from "react";
import { askRepo, getChatHistory } from "../services/api.service";
import { Bot, User, X, Loader2, Sparkles, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatAssistantProps {
  repoUrl: string;
  selectedFile: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatAssistant({ repoUrl, selectedFile, isOpen, onClose }: ChatAssistantProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && repoUrl) {
      setMessages([]); // Clear messages when switching context
      getChatHistory(repoUrl, selectedFile)
        .then((res) => {
          if (res.data.history) {
            setMessages(res.data.history.map((m: any) => ({ role: m.role, text: m.content })));
          }
        })
        .catch(() => console.log("Failed to fetch chat history"));
    }
  }, [isOpen, repoUrl, selectedFile]);

  const ask = async () => {
    if (!question.trim()) return;
    
    const userMsg = question;
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg, file: selectedFile }]);
    setLoading(true);

    try {
      const res = await askRepo(userMsg, repoUrl, selectedFile);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.answer || "I couldn't generate an answer." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error connecting to AI. Make sure local LLM is running." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-[80px] h-[calc(100vh-80px)] w-96 bg-white border-l border-[var(--border)] shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">Repository AI</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
              <X size={20} />
            </button>
          </div>

          {/* Context Banner */}
          {selectedFile && (
            <div className="bg-[#feefde] border-b border-[#ffdbb5] px-4 py-2 text-xs text-slate-700 flex items-center gap-2 flex-shrink-0">
              <FileCode size={14} className="text-amber-600" />
              <span className="truncate font-mono">Context: {selectedFile.split('/').pop()}</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-10">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Ask me anything about this repository.</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  m.role === "user" ? "bg-slate-800 text-white" : "bg-[#38bdf8] text-white"
                }`}>
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl ${
                  m.role === "user" 
                    ? "bg-[#feefde] text-slate-900 rounded-tr-none border border-[#ffdbb5]" 
                    : "bg-white text-[var(--foreground)] rounded-tl-none border border-[var(--border)] shadow-sm"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  {m.role === "user" && m.file && (
                     <p className="text-[10px] mt-2 opacity-60 font-mono flex items-center gap-1">
                       <FileCode size={10}/> {m.file.split('/').pop()}
                     </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#38bdf8] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-[var(--border)] shadow-sm p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--border)] bg-white flex-shrink-0">
            <div className="relative">
              <input
                className="w-full bg-slate-50 border border-[var(--border)] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all placeholder:text-slate-400"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Ask about the code..."
              />
              <button
                onClick={ask}
                disabled={loading || !question.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
