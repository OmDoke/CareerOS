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
  Flame,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Target,
} from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume",         icon: FileText,        label: "Resume" },
  { href: "/roadmap",        icon: Map,             label: "Roadmap" },
  { href: "/today",          icon: CalendarDays,    label: "Today" },
  { href: "/practice",       icon: Dumbbell,        label: "Practice" },
  { href: "/job-scraper",    icon: Briefcase,       label: "Jobs" },
  { href: "/naukri-updater", icon: RefreshCw,       label: "Naukri" },
];

export function TopNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  const { data: stats } = useDashboardAnalytics();
  const { data: roadmap } = useRoadmap();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const targetRole = roadmap?.targetRole || "Set target role";
  const userInitials = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header className="topnav h-14 shrink-0 sticky top-0 z-30 px-4 md:px-6 flex items-center gap-3">
      {/* ── Logo ── */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 shrink-0 group"
        aria-label="CareerOS home"
      >
        <div className="h-7 w-7 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-0.5 flex items-center justify-center overflow-hidden shadow-sm">
          <Image
            src="/logo.png"
            alt="CareerOS"
            width={28}
            height={28}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <span className="font-semibold text-sm tracking-tight text-[var(--fg-primary)] group-hover:text-[var(--accent)] transition-colors hidden sm:block">
          CareerOS
        </span>
      </Link>

      {/* ── Divider ── */}
      <div className="h-5 w-px bg-[var(--border)] shrink-0" />

      {/* ── Nav links — icon + label on desktop, icon-only on mobile ── */}
      <nav className="flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-sunken)]"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Right side ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Target role — desktop only */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-sunken)] border border-[var(--border)] text-xs font-medium text-[var(--fg-secondary)]">
          <Target className="h-3 w-3 text-[var(--accent)] shrink-0" />
          <span className="truncate max-w-[130px]">{targetRole}</span>
        </div>

        {/* Streak pill */}
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold"
          style={{
            backgroundColor: "var(--accent-dim)",
            borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
            color: "var(--accent-hover)",
          }}
          title={`${stats?.currentStreak || 0}-day streak`}
        >
          <Flame className="h-3.5 w-3.5" style={{ fill: "currentColor" }} />
          <span className="stat-number">{stats?.currentStreak || 0}</span>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-label="User menu"
            className="flex items-center gap-1.5 px-1 pr-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all"
          >
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
            >
              {userInitials}
            </div>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-[var(--fg-muted)] transition-transform duration-150",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isDropdownOpen && (
            <div
              role="menu"
              onMouseLeave={() => setIsDropdownOpen(false)}
              className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-md)] p-1.5 z-50 animate-[fade-up_0.15s_ease_forwards]"
            >
              {/* User info */}
              <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                <p className="text-xs font-semibold text-[var(--fg-primary)] truncate">
                  {user?.email || "candidate@careeros.ai"}
                </p>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">Interview prep track</p>
              </div>

              {[
                { href: "/profile", icon: UserIcon, label: "Profile" },
                { href: "/settings", icon: Settings, label: "Settings & API Keys" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--fg-primary)] transition-colors"
                >
                  <item.icon className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-[var(--border)] my-1" />

              <button
                role="menuitem"
                onClick={() => { setIsDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--err)] hover:bg-[var(--err-dim)] transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
