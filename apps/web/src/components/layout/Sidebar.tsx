import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  CalendarDays, 
  Dumbbell, 
  Settings, 
  LogOut,
  User,
  Briefcase,
  RefreshCw
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../../lib/utils";
import { useRoadmap } from "../../features/roadmap/hooks/useRoadmap";
import { useDashboardAnalytics } from "../../features/analytics/hooks/useAnalytics";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Today", href: "/today", icon: CalendarDays },
  { name: "Practice", href: "/practice", icon: Dumbbell },
  { name: "Job Scraper", href: "/job-scraper", icon: Briefcase },
  { name: "Naukri Updater", href: "/naukri-updater", icon: RefreshCw },
];

const BOTTOM_NAV_ITEMS = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  
  const { data: roadmapData } = useRoadmap();
  const { data: dashboardStats } = useDashboardAnalytics();

  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-slate-200/80 bg-white/80 backdrop-blur-2xl min-h-screen px-4 py-6 sticky top-0 h-screen overflow-y-auto z-30">
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200/80 shadow-soft p-1 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
          <Image
            src="/logo.png"
            alt="CareerOS Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-primary transition-colors">CareerOS</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary">AI Career Engine</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5 px-3">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25 border border-primary/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {user && (
        <div className="mt-6 mb-4 p-4 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-soft">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
              {user.firstName ? user.firstName[0].toUpperCase() : <User className="h-5 w-5" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900">{user.firstName || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-500">Target Role</span>
                <span className="truncate ml-2 text-slate-900 font-semibold">{roadmapData?.targetRole || "Not set"}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-500">Progress</span>
                <span className="text-accent font-bold">{roadmapData ? "In Progress" : "0%"}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full" style={{ width: roadmapData ? "33%" : "0%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Daily Streak</span>
                <span className="text-amber-600 font-bold flex items-center">
                  🔥 {dashboardStats?.currentStreak || 0} days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 pt-3 border-t border-slate-200/80">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
