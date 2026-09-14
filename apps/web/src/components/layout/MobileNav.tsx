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
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-md z-50 px-2 py-2 pb-safe">
      <div className="flex justify-around items-center">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[64px] rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive ? "stroke-[2.5px]" : "")} />
              <span className="text-[10px] font-medium leading-none">{item.name}</span>
            </Link>
          );
        })}
        {/* We can route the "More" button to /settings where they can find Resume, Logout, Profile */}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center justify-center p-2 min-w-[64px] rounded-lg transition-colors",
            pathname === "/settings" || pathname === "/resume"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Menu className={cn("h-5 w-5 mb-1", (pathname === "/settings" || pathname === "/resume") ? "stroke-[2.5px]" : "")} />
          <span className="text-[10px] font-medium leading-none">More</span>
        </Link>
      </div>
    </div>
  );
}
