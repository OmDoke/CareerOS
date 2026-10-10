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
    <div className="flex min-h-screen bg-background relative selection:bg-primary/15 selection:text-primary">
      {/* Dynamic Ambient Light Aurora Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[15%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[25%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
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
