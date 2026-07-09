import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}
