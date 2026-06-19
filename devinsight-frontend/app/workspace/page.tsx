"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";

export default function Workspace() {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [repoPath, setRepoPath] = useState<string>("");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedUrl = localStorage.getItem("repoUrl");
    if (storedUrl) {
      setRepoUrl(storedUrl);
      const name = storedUrl.split('/').pop()?.replace('.git', '');
      setRepoPath(`repos/${name}`);
    }

    const historyStr = localStorage.getItem("repoHistory");
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    }
  }, []);

  const handleSelectRepo = (url: string) => {
    setRepoUrl(url);
    const name = url.split('/').pop()?.replace('.git', '');
    setRepoPath(`repos/${name}`);
    localStorage.setItem("repoUrl", url);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col">
        <div className="mb-4 flex-shrink-0 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Workspace</h1>
            <p className="text-[var(--foreground-secondary)]">{repoUrl}</p>
          </div>
          
          {history.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-[var(--foreground-secondary)]">Recent Repositories:</span>
              <select 
                className="bg-white border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[#38bdf8] shadow-sm cursor-pointer"
                value={repoUrl}
                onChange={(e) => handleSelectRepo(e.target.value)}
              >
                {history.map(url => (
                  <option key={url} value={url}>{url.split('/').slice(-2).join('/')}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Sidebar: File Explorer */}
          <div className="w-80 flex-shrink-0">
            {repoPath ? (
              <FileTree 
                repoPath={repoPath} 
                onFileSelect={(path) => setSelectedFilePath(path)} 
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-xl border border-[var(--border)] p-4 text-center text-gray-500">
                No repository selected. Please analyze a repository first.
              </div>
            )}
          </div>

          {/* Main: Code Viewer */}
          <div className="flex-1 min-w-0">
            <CodeViewer repoPath={repoPath} filePath={selectedFilePath} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
