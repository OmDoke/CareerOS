import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../providers/query-provider";
import { Toaster } from "../components/ui/sonner";
import { RootLayoutWrapper } from "../layouts/RootLayoutWrapper";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CareerOS",
  description: "AI-powered interview preparation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="antialiased dark:bg-zinc-950 dark:text-zinc-50 min-h-screen flex flex-col">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <RootLayoutWrapper>
              {children}
            </RootLayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
