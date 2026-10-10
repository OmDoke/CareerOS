"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../../store/auth.store";
import { useDashboardAnalytics } from "../../features/analytics/hooks/useAnalytics";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { 
  Search, 
  Bell, 
  Sparkles, 
  Target, 
  Flame, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ChevronDown
} from "lucide-react";

export function TopNav() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  const { data: stats } = useDashboardAnalytics();
  const { data: roadmap } = useRoadmap();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const targetRole = roadmap?.targetRole || "Full Stack Engineer";
  const displayName = user?.firstName || user?.email?.split('@')[0] || "Candidate";
  const userInitials = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Global Search Command Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, questions, skills... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-12 rounded-full border border-slate-200 bg-white/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all shadow-xs"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Center/Right: Target Role Pill + Quick Metrics + Profile Pill */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Target Role Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
          <Target className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Target:</span>
          <span className="text-slate-900 font-bold truncate max-w-[150px]">{targetRole}</span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-xs">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{stats?.currentStreak || 1}d Streak</span>
        </div>

        {/* Notification Bell */}
        <Link 
          href="/settings"
          className="relative h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs shrink-0"
          title="Notifications & Settings"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
        </Link>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all group"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs relative">
              {userInitials}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                {displayName}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Pro Candidate
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.email || "candidate@careeros.ai"}</p>
                <p className="text-[10px] text-slate-400 font-medium">Interview Ready Track</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                Profile Details
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                Settings & API Keys
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
