"use client";

import { useState } from "react";
import { Loader2, Box, Layers, ArrowRightLeft, GitMerge, Settings, LayoutTemplate } from "lucide-react";
import { generateDiagram } from "../services/api.service";
import { ReactFlow, Controls, Background, MiniMap, BackgroundVariant, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function DiagramViewer({ repoContext, repoUrl }: { repoContext: string, repoUrl: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [diagramType, setDiagramType] = useState("architecture");

  const handleGenerate = async (type: string = diagramType) => {
    if (!repoContext) return;
    setIsLoading(true);
    setError("");
    setDiagramType(type);
    
    try {
      const res = await generateDiagram(repoUrl, repoContext, type);
      
      const payload = res.data?.data?.data || res.data?.data || res.data;
      
      let nodesData = [];
      let edgesData = [];
      
      const diagramData = payload?.diagram || payload;
      
      if (diagramData && diagramData.nodes && diagramData.edges) {
        nodesData = diagramData.nodes;
        edgesData = diagramData.edges;
      } else if (res.data && res.data.nodes && res.data.edges) {
        nodesData = res.data.nodes;
        edgesData = res.data.edges;
      }

      if (nodesData.length > 0) {
        // Format class diagram node labels with newlines for ReactFlow
        const formattedNodes = nodesData.map((node: any) => ({
          ...node,
          style: {
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
            minWidth: '150px',
            whiteSpace: 'pre-wrap'
          },
          data: {
            ...node.data,
            label: node.data?.label || ''
          }
        }));

        const formattedEdges = edgesData.map((edge: any) => ({
          ...edge,
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      } else {
        throw new Error("Invalid response structure from diagram generator.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to generate diagram");
    } finally {
      setIsLoading(false);
    }
  };

  const diagramTypes = [
    { id: 'architecture', label: 'Architecture', icon: <Box className="w-4 h-4" /> },
    { id: 'class', label: 'Class', icon: <Layers className="w-4 h-4" /> },
    { id: 'sequence', label: 'Sequence', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'component', label: 'Component', icon: <Settings className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <GitMerge className="w-4 h-4" /> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden relative">
      <div className="p-4 border-b border-[var(--border)] bg-slate-50 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center shadow-sm">
            <LayoutTemplate className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">UML Generator</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
            {diagramTypes.map((dt) => (
              <button
                key={dt.id}
                onClick={() => setDiagramType(dt.id)}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  diagramType === dt.id 
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' 
                    : 'text-slate-600 hover:bg-slate-50 border-b-2 border-transparent'
                }`}
              >
                {dt.icon}
                {dt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerate(diagramType)}
            disabled={isLoading || !repoContext}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative w-full h-full overflow-hidden bg-slate-50">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm shadow-md max-w-2xl text-center">
            {error}
          </div>
        )}
        
        {nodes.length === 0 && !isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl font-medium">Select a diagram type and click Generate</p>
            <p className="text-sm mt-2 opacity-75">Now renders entirely as native React Flow nodes!</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600 z-50 bg-slate-50/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-medium">Generating {diagramType} diagram...</p>
          </div>
        )}

        {nodes.length > 0 && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={4}
            attributionPosition="bottom-right"
            panOnDrag={true}
            zoomOnScroll={true}
          >
            <Controls />
            <MiniMap pannable zoomable nodeColor="#10b981" maskColor="rgba(248, 250, 252, 0.8)" />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
