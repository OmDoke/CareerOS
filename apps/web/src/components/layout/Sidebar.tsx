import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  CalendarDays, 
  Dumbbell, 
  Settings, 
  LogOut,
  User
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
    <aside className="hidden md:flex flex-col w-[260px] border-r bg-card min-h-screen px-4 py-6 sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
          C
        </div>
        <span className="font-bold text-xl tracking-tight">CareerOS</span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {user && (
        <div className="mt-8 mb-6 p-4 rounded-xl bg-secondary/50 border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.firstName ? user.firstName[0].toUpperCase() : <User className="h-5 w-5" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.firstName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-muted-foreground">Target Role</span>
                <span className="truncate ml-2">{roadmapData?.targetRole || "Not set"}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{roadmapData ? "In Progress" : "0%"}</span>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: roadmapData ? "33%" : "0%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Daily Streak</span>
                <span className="text-orange-500 font-bold flex items-center">
                  🔥 {dashboardStats?.currentStreak || 0} days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 pt-4 border-t">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
