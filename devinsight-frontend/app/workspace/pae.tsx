"use client";

import DashboardLayout from "@/components/DashboardLayout";
import FileTree from "@/components/FileTree";
import AIChat from "@/components/AIChat";

export default function Workspace() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-6">
        <FileTree files={["src", "package.json", "index.js"]} />

        <div className="col-span-2">
          <AIChat />
        </div>
      </div>
    </DashboardLayout>
  );
}
