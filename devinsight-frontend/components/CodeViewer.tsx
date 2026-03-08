"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeViewerProps {
  code: string;
  language?: string;
}

export default function CodeViewer({ code, language = "javascript" }: CodeViewerProps) {
  return (
    <div className="rounded-xl overflow-hidden">
      <SyntaxHighlighter language={language} style={oneDark}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
