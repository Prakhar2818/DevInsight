"use client";

import Link from "next/link";
import { Button } from "@mui/material";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-[var(--primary-600)]">DevInsight AI</h1>

        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
            Home
          </Link>

          <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
            Dashboard
          </Link>

          <Button 
            variant="contained" 
            style={{ 
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff'
            }}
          >
            Analyze Repo
          </Button>
        </div>
      </div>
    </nav>
  );
}
