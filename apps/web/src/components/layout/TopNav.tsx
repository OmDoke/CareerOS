"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { useDashboardAnalytics } from "../../features/analytics/hooks/useAnalytics";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import {
  LayoutDashboard,
  FileText,
  Map,
  CalendarDays,
  Dumbbell,
  Briefcase,
  RefreshCw,
  Settings,
  Bell,
  Target,
  Flame,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume",         icon: FileText,        label: "Resume" },
  { href: "/roadmap",        icon: Map,             label: "Roadmap" },
  { href: "/today",          icon: CalendarDays,    label: "Today" },
  { href: "/practice",       icon: Dumbbell,        label: "Practice" },
  { href: "/job-scraper",    icon: Briefcase,       label: "Job Scraper" },
  { href: "/naukri-updater", icon: RefreshCw,       label: "Naukri Updater" },
];

export function TopNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  const { data: stats } = useDashboardAnalytics();
  const { data: roadmap } = useRoadmap();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const targetRole = roadmap?.targetRole || "Full Stack Engineer";
  const userInitials = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center gap-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 mr-2 group">
        <div className="h-8 w-8 rounded-xl bg-white border border-slate-200/80 shadow-sm p-0.5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
          <Image
            src="/logo.png"
            alt="CareerOS"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <span className="font-black text-sm tracking-tight text-slate-900 group-hover:text-primary transition-colors hidden sm:block">
          CareerOS
        </span>
      </Link>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-200 shrink-0" />

      {/* Icon-only Nav */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 group",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side: Target Role + Streak + Bell + Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Target Role Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
          <Target className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Target:</span>
          <span className="text-slate-900 font-bold truncate max-w-[120px]">{targetRole}</span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-xs">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{stats?.currentStreak || 1}d</span>
        </div>

        {/* Notification Bell */}
        <Link
          href="/settings"
          className="relative h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs shrink-0"
          title="Settings"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
        </Link>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all group"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs relative">
              {userInitials}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {/* Dropdown */}
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
