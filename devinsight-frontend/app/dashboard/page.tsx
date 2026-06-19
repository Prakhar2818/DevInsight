"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.name || "Developer"}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            What would you like to analyze today?
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Repo Analyzer Card */}
        <div className="bg-white rounded-[24px] p-6 relative overflow-hidden group flex flex-col justify-between hover:-translate-y-1 transition-all cursor-pointer shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-sky-400 rounded-sm" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-mono">
              <Clock className="w-3 h-3" />
              <span>12:02:58</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center items-center gap-2 transform group-hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-4 bg-sky-200 rounded" />
              <div className="w-20 h-4 bg-sky-300 rounded" />
              <div className="w-12 h-4 bg-sky-200 rounded" />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-4" />

          <div>
            <h3 className="font-bold text-xl text-slate-900 mb-1">
              Analyze Repository
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Paste a URL to visualize architecture.
            </p>
            
            <div className="flex justify-between items-center">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                View Analysis
              </button>
              <span className="text-xs text-slate-400 font-medium">Analysis is ready</span>
            </div>
          </div>
        </div>

        {/* Debug Assistant Card */}
        <div className="bg-white rounded-[24px] p-6 relative overflow-hidden group flex flex-col justify-between hover:-translate-y-1 transition-all cursor-pointer shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-orange-400 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-mono">
              <Clock className="w-3 h-3" />
              <span>Idle</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-32 h-32 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
              <div className="w-12 h-12 border-4 border-dashed border-orange-300 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-4" />

          <div>
            <h3 className="font-bold text-xl text-slate-900 mb-1">
              Debug Assistant
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Trace root causes instantly.
            </p>
            
            <div className="flex justify-between items-center">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Start Debugging
              </button>
              <span className="text-xs text-slate-400 font-medium">Ready</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
