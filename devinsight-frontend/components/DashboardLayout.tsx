import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-[var(--background)] p-6 overflow-hidden">
        <div className="h-[calc(100vh-60px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
