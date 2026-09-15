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
      toast.error("Connect your Gemini API Key", {
        description: "An API key is required to use AI features.",
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
    <div className="flex min-h-screen bg-background">
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
