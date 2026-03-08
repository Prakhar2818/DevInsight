"use client";

import { useEffect, useState } from "react";
import { repoIntelligence } from "../../services/api.service";
import DashboardLayout from "@/components/DashboardLayout";
import RepoStructure from "@/components/RepoStructure";
import AnalysisLoader from "@/components/AnalysisLoader";
import FileTree from "@/components/FileTree";
import IntelligenceView from "@/components/IntelligenceView";

export default function AnalyzerPage() {
  const [structure, setStructure] = useState<any>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("repoStructure");

    if (data) {
      const parsed = JSON.parse(data);

      setStructure(parsed.structure || parsed);
      
      // Use the flat files array directly from the backend
      if (parsed.files && Array.isArray(parsed.files)) {
        setFiles(parsed.files);
      } else {
        // Fallback: extract files from nested structure
        const extractFiles = (obj: any): string[] => {
          const result: string[] = [];
          if (Array.isArray(obj)) {
            obj.forEach((item) => {
              if (typeof item === 'object' && item !== null) {
                if (item.path) {
                  result.push(item.path);
                }
                if (item.children) {
                  result.push(...extractFiles(item.children));
                }
              }
            });
          } else if (typeof obj === 'object' && obj !== null) {
            if (obj.path) {
              result.push(obj.path);
            }
            if (obj.children) {
              result.push(...extractFiles(obj.children));
            }
          }
          return result;
        };
        const extractedFiles = extractFiles(parsed.structure || parsed);
        setFiles(extractedFiles);
      }

      // Get repoUrl from localStorage
      const repoUrl = localStorage.getItem("repoUrl") || "";
      
      repoIntelligence({ repoUrl, structure: parsed.structure || parsed }).then((res) => {
        setAnalysis(res.data.result?.analysis || res.data.analysis || "");
        setLoading(false);
      }).catch((err) => {
        console.error("Error getting intelligence:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6 flex flex-col overflow-y-auto scrollbar-hide">
        <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)] flex-shrink-0">Repository Analysis</h1>

        {loading && <AnalysisLoader />}

        {/* Architecture Explanation - Full width */}
        {analysis && !loading && (
          <div className="mb-4 flex-shrink-0">
            <IntelligenceView analysis={analysis} />
          </div>
        )}

        {/* Repository Structure and File Tree - Side by Side */}
        {!loading && (
          <div className="flex gap-4 flex-1">
            <div className="flex-1">
              <RepoStructure structure={structure} />
            </div>
            <div className="flex-1">
              {files.length > 0 ? (
                <FileTree files={files} />
              ) : (
                <div className="p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl h-full">
                  <p className="text-[var(--foreground-secondary)]">No files found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
