import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  CalendarDays, 
  Dumbbell,
  Menu
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOBILE_ITEMS = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Today", href: "/today", icon: CalendarDays },
  { name: "Practice", href: "/practice", icon: Dumbbell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white/90 backdrop-blur-2xl z-50 px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[64px] rounded-2xl transition-all",
                isActive
                  ? "text-primary font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-primary text-white shadow-md shadow-primary/25" : ""
              )}>
                <item.icon className={cn("h-4 w-4", isActive ? "stroke-[2.5px]" : "")} />
              </div>
              <span className="text-[10px] mt-1 font-semibold leading-none">{item.name}</span>
            </Link>
          );
        })}
        {/* We can route the "More" button to /settings where they can find Resume, Logout, Profile */}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center justify-center p-2 min-w-[64px] rounded-2xl transition-all",
            pathname === "/settings" || pathname === "/resume"
              ? "text-primary font-bold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-all",
            (pathname === "/settings" || pathname === "/resume") ? "bg-primary text-white shadow-md shadow-primary/25" : ""
          )}>
            <Menu className={cn("h-4 w-4", (pathname === "/settings" || pathname === "/resume") ? "stroke-[2.5px]" : "")} />
          </div>
          <span className="text-[10px] mt-1 font-semibold leading-none">More</span>
        </Link>
      </div>
    </div>
  );
}
