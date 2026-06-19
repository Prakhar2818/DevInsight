import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />

      <div className="flex-1 bg-[var(--background)] p-6 overflow-y-auto">
        <div className="h-[calc(100vh-64px-48px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
