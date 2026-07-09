"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2, Search, FileCode2 } from "lucide-react";
import { traceFlow, getFileContent } from "../services/api.service";

export default function TracerViewer({ repoContext, selectedFilePath }: { repoContext: string, selectedFilePath?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Update query if a new file is selected and auto-trigger the trace
  useEffect(() => {
    if (selectedFilePath) {
      const fileName = selectedFilePath.split('/').pop();
      const newQuery = `Trace the interactions, dependencies, and usage of ${fileName} across the codebase. Where is it used and what does it use?`;
      setQuery(newQuery);
      
      // Auto-trigger trace when file changes
      const timeoutId = setTimeout(() => {
        handleTrace(newQuery);
      }, 500); // Debounce just in case
      return () => clearTimeout(timeoutId);
    }
  }, [selectedFilePath]);

  const handleTrace = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      let finalContext = repoContext;
      
      // If a file is selected, fetch its contents and format the context clearly
      if (selectedFilePath) {
        try {
          const fileRes = await getFileContent(selectedFilePath);
          if (fileRes.data && fileRes.data.content) {
            finalContext = `[FOCUS ON THIS FILE: ${selectedFilePath}]\n\`\`\`\n${fileRes.data.content}\n\`\`\`\n\n[OVERALL REPOSITORY STRUCTURE]\n${repoContext}`;
          }
        } catch (e) {
          console.error("Failed to fetch file content for tracer context", e);
        }
      }

      // OpenRouter free models have strict context limits. Truncate context if it is massively huge to prevent 400 Bad Request errors.
      if (finalContext.length > 25000) {
        finalContext = finalContext.substring(0, 25000) + "\n...[TRUNCATED FOR LENGTH]";
      }

      const res = await traceFlow(q, finalContext);
      
      let nodesData = [];
      let edgesData = [];
      
      // Axios wraps response in res.data
      // Backend wraps in { data: ... }
      // LLM might ALSO wrap in { data: ... }
      const payload = res.data?.data?.data || res.data?.data || res.data;

      if (payload && payload.nodes && payload.edges) {
        nodesData = payload.nodes;
        edgesData = payload.edges;
      } else if (res.data && res.data.nodes && res.data.edges) {
        nodesData = res.data.nodes;
        edgesData = res.data.edges;
      }

      if (nodesData.length > 0) {
        setNodes(nodesData);
        setEdges(edgesData);
      } else {
        throw new Error("Invalid response structure or no nodes returned");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to trace flow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      {selectedFilePath && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 text-sm text-blue-700 font-medium">
          <FileCode2 className="w-4 h-4" />
          <span>Currently tracing context from: <strong>{selectedFilePath.split('/').pop()}</strong></span>
        </div>
      )}
      <div className="p-4 border-b border-[var(--border)] bg-slate-50 flex items-center gap-4 z-10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., What happens during user login?"
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrace()}
          />
        </div>
        <button
          onClick={() => handleTrace()}
          disabled={isLoading || !query.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Trace Flow"}
        </button>
      </div>
      
      <div className="flex-1 relative w-full h-[600px]">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm shadow-md">
            {error}
          </div>
        )}
        
        {nodes.length === 0 && !isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">Ask a question to trace the execution flow.</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-600 z-50 bg-slate-50/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-medium">Tracing code flow...</p>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
