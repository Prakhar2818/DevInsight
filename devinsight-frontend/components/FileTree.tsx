"use client";

import { useState, useMemo } from "react";
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown } from "react-icons/fa";

interface FileTreeProps {
  files: string[];
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
}

export default function FileTree({ files }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "backend", "frontend"]));

  // Build tree structure from flat file paths
  const tree = useMemo(() => {
    const root: TreeNode[] = [];
    const folderMap = new Map<string, TreeNode>();

    // Sort files to ensure folders come first
    const sortedFiles = [...files].sort();

    for (const filePath of sortedFiles) {
      const parts = filePath.split("/");
      let currentPath = "";
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        const isLast = i === parts.length - 1;
        const isFolder = !isLast || part.includes(".") === false;
        
        if (!folderMap.has(currentPath)) {
          const node: TreeNode = {
            name: part,
            path: currentPath,
            isFolder,
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

    return root;
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = depth * 16 + 8;

    if (node.isFolder) {
      return (
        <div key={node.path}>
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-2 py-1 px-2 hover:bg-[var(--primary-50)] rounded cursor-pointer text-sm text-[var(--foreground)]"
            style={{ paddingLeft }}
          >
            {isExpanded ? (
              <FaChevronDown className="text-[var(--foreground-secondary)]" size={10} />
            ) : (
              <FaChevronRight className="text-[var(--foreground-secondary)]" size={10} />
            )}
            {isExpanded ? (
              <FaFolderOpen className="text-yellow-500" />
            ) : (
              <FaFolder className="text-yellow-500" />
            )}
            <span className="font-medium">{node.name}</span>
          </div>
          {isExpanded && node.children.length > 0 && (
            <div className="border-l border-[var(--border)] ml-3">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File
    return (
      <div
        key={node.path}
        className="flex items-center gap-2 py-1 px-2 hover:bg-[var(--primary-50)] rounded cursor-pointer text-sm text-[var(--foreground)]"
        style={{ paddingLeft: paddingLeft + 14 }}
      >
        <FaFile className="text-[var(--primary-500)]" />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <div className="bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] h-[400px] flex flex-col">
      <div className="sticky top-0 bg-[var(--background-secondary)] border-b border-[var(--border)] p-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          File Explorer
        </h3>
        <p className="text-xs text-[var(--foreground-secondary)]">{files.length} files</p>
      </div>
      <div className="p-2 overflow-auto flex-1">
        {tree.length > 0 ? (
          tree.map((node) => renderNode(node))
        ) : (
          <p className="text-[var(--foreground-secondary)] text-sm p-4">No files to display</p>
        )}
      </div>
    </div>
  );
}
