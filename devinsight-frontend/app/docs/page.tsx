"use client"

import DashboardLayout from "@/components/DashboardLayout"
import DocsGenerator from "@/components/DocsGenerator"

export default function DocsPage() {

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
        Documentation Generator
      </h1>

      <DocsGenerator />

    </DashboardLayout>

  )

}
