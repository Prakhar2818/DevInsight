"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import RepoInput from "@/components/RepoInput";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.name || "Developer"}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            What would you like to analyze today?
          </p>
        </div>
      </div>

      <div className="mb-12">
        <RepoInput />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-sky-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Architecture Parsing
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Automatically detect your framework, database, language, and ORM
            simply by pasting a GitHub URL. Instantly generate a robust file
            explorer to navigate your codebase contextually.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            AI Intelligence
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Talk to your repository. Ask complex questions about the
            architecture, request deep-dives into specific file functionalities,
            and get real-time generative answers based on your codebase
            structure.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Debug Assistant
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Paste error logs directly into the assistant to get instant
            root-cause analysis. DevInsight will trace through your repository
            and suggest the exact files and lines of code you need to fix.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
