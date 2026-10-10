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
  Briefcase,
  RefreshCw
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../../lib/utils";

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
  const logout = useAuthStore((state) => state.clearAuth);

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
