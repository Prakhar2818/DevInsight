"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>

      <p className="text-[var(--foreground-secondary)] mt-2">
        Analyze repositories, generate diagrams and debug errors
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)]">Repository Analyzer</h3>
          <p className="text-[var(--foreground-secondary)] mt-2">
            Analyze GitHub repository architecture
          </p>
        </div>

        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)]">Debug Assistant</h3>
          <p className="text-[var(--foreground-secondary)] mt-2">
            Identify root causes of runtime errors
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
