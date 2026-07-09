"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Download, FileText } from "lucide-react";
import { generateDocs } from "../services/api.service";

export default function DocsGenerator({ parsedStructure }: { parsedStructure?: any }) {
  const [markdown, setMarkdown] = useState<string>("");
  const [docxUrl, setDocxUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!parsedStructure || markdown) return;

    const generate = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await generateDocs(parsedStructure);
        const payload = res.data?.data || res.data;
        if (payload && payload.markdown) {
          setMarkdown(payload.markdown);
          setDocxUrl(payload.downloadUrl);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Docs generation error:", err);
        setError("Failed to generate documentation.");
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [parsedStructure, markdown]);

  return (
    <div className="bg-white border border-[var(--border)] shadow-sm rounded-xl h-full flex flex-col relative overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)]">Project Documentation</h3>
        </div>
        {docxUrl && (
          <a
            href={docxUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white rounded-lg text-sm font-semibold hover:bg-[#d97706] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download DOCX
          </a>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Generating intelligent documentation...</p>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          </div>
        ) : markdown ? (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>No documentation available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
