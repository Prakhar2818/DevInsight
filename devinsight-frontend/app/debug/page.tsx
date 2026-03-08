"use client";

import DashboardLayout from "@/components/DashboardLayout";
import DebugPanel from "@/components/DebugPanel";

export default function DebugPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">Debug Assistant</h1>

      <DebugPanel />
    </DashboardLayout>
  );
}
