"use client";

import React, { useState, useEffect, useMemo } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { getFileTree } from "../services/api.service";

interface FileTreeProps {
  files?: string[];
  repoPath?: string;
  onFileSelect?: (path: string) => void;
}

export default function FileTree({ files, repoPath, onFileSelect }: FileTreeProps) {
  const [treeData, setTreeData] = useState<TreeViewBaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Build tree from flat array (fallback for Analyzer)
  const buildTreeFromFlat = useMemo(() => {
    if (!files) return [];
    
    const root: any[] = [];
    const folderMap = new Map<string, any>();

    const sortedFiles = [...files].sort();

    for (const filePath of sortedFiles) {
      const parts = filePath.split("/");
      let currentPath = "";
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!folderMap.has(currentPath)) {
          const node = {
            id: currentPath,
            label: part,
            children: []
          };
          
          folderMap.set(currentPath, node);
          
          if (parentPath === "") {
            root.push(node);
          } else {
            const parent = folderMap.get(parentPath);
            if (parent) {
              parent.children.push(node);
            }
          }
        }
      }
    }
    
    // Remove empty children arrays
    const cleanTree = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.children.length === 0) delete node.children;
        else cleanTree(node.children);
      }
    };
    cleanTree(root);
    
    return root;
  }, [files]);

  useEffect(() => {
    if (repoPath) {
      setLoading(true);
      getFileTree(repoPath)
        .then(res => {
          // Backend returns root object { id, label, children }
          // We wrap it in an array for RichTreeView
          setTreeData([res.data.tree]);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch tree", err);
          setLoading(false);
        });
    } else if (files) {
      setTreeData(buildTreeFromFlat);
    }
  }, [repoPath, files, buildTreeFromFlat]);

  const handleItemClick = (event: React.SyntheticEvent, itemId: string) => {
    if (onFileSelect) {
      // If it has an extension, treat it as a file (basic heuristic)
      if (itemId.includes(".")) {
        // Remove the root prefix if it exists to get the relative file path
        let relativePath = itemId;
        if (itemId.startsWith("root/")) {
          relativePath = itemId.replace("root/", "");
        }
        onFileSelect(relativePath);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] h-full flex flex-col shadow-sm">
      <div className="sticky top-0 bg-[var(--background-secondary)] border-b border-[var(--border)] px-4 py-3 flex-shrink-0 rounded-t-xl">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          File Explorer
        </h3>
      </div>
      <div className="p-2 overflow-auto flex-1">
        {loading ? (
           <div className="flex justify-center py-4">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
           </div>
        ) : treeData.length > 0 ? (
          <RichTreeView 
            items={treeData} 
            onItemClick={handleItemClick}
            sx={{
              '& .MuiTreeItem-content': { padding: '4px 8px', borderRadius: '8px' },
              '& .MuiTreeItem-label': { fontSize: '0.875rem', fontFamily: 'var(--font-inter)' }
            }}
          />
        ) : (
          <p className="text-[var(--foreground-secondary)] text-sm p-4">No files to display</p>
        )}
      </div>
    </div>
  );
}
