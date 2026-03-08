"use client";

import { useState } from "react";
import { analyzeParser } from "../../services/api.service";
import DashboardLayout from "@/components/DashboardLayout";

export default function ParserPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const handleParse = async () => {
    const res = await analyzeParser(code);

    setResult(JSON.stringify(res.data, null, 2));
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-[var(--foreground)]">Code Parser</h1>

      <textarea
        className="border border-[var(--border)] w-full p-4 mt-6 rounded-lg bg-[var(--background)] text-[var(--foreground)]"
        rows={8}
        placeholder="Paste source code"
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleParse}
        className="bg-[var(--primary-600)] text-white px-6 py-2 mt-4 rounded-lg hover:bg-[var(--primary-700)] transition-colors"
      >
        Analyze Code
      </button>

      <pre className="bg-[var(--background)] border border-[var(--border)] mt-6 p-4 rounded-lg text-[var(--foreground-secondary)] overflow-auto">{result}</pre>
    </DashboardLayout>
  );
}
