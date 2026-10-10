"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const handleMissingProvider = () => {
      toast.error("Invalid or Missing Gemini API Key", {
        description: "A valid API key is required to use AI features.",
        action: {
          label: "Go To Settings",
          onClick: () => router.push("/settings"),
        },
        duration: 10000,
        id: "ai-provider-missing", // Prevent duplicates
      });
    };

    window.addEventListener("ai-provider-missing", handleMissingProvider);
    return () => window.removeEventListener("ai-provider-missing", handleMissingProvider);
  }, [router]);
  
  return (
    <div className="flex min-h-screen bg-background relative selection:bg-primary/20 selection:text-foreground">
      {/* Dynamic Ambient Glassmorphism Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[20%] w-[550px] h-[550px] rounded-full bg-primary/15 blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] rounded-full bg-accent/15 blur-[130px] animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute bottom-[-15%] left-[30%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 relative max-w-full overflow-hidden">
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      <Toaster position="bottom-right" richColors theme="system" />
    </div>
  );
}
