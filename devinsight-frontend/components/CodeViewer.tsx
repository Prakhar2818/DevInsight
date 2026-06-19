"use client";

import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck, FiMaximize } from "react-icons/fi";
import { getFileContent } from "../services/api.service";

interface CodeViewerProps {
  repoPath: string;
  filePath: string;
}

export default function CodeViewer({ repoPath, filePath }: CodeViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!filePath || !repoPath) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await getFileContent(`${repoPath}/${filePath}`);
        setContent(response.data.content);
      } catch (error) {
        console.error("Failed to fetch file content", error);
        setContent("// Failed to load file content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [filePath, repoPath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine language from extension
  const getLanguage = () => {
    const ext = filePath.split(".").pop();
    switch (ext) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
        return "javascript";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "html":
        return "html";
      case "css":
      case "scss":
        return "css";
      case "py":
        return "python";
      default:
        return "typescript"; // default fallback
    }
  };

  if (!filePath) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-white rounded-xl border border-[var(--border)] p-6">
        Select a file from the explorer to view its contents
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <span className="font-mono text-sm text-[var(--foreground)] truncate">{filePath}</span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            title="Copy Code"
          >
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
          </button>
          <button 
            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            title="Fullscreen"
          >
            <FiMaximize />
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-auto bg-[#fafafa]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <SyntaxHighlighter
            language={getLanguage()}
            style={oneLight}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "14px",
            }}
          >
            {content}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
