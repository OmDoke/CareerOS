import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../providers/query-provider";
import { Toaster } from "../components/ui/sonner";
import { RootLayoutWrapper } from "../layouts/RootLayoutWrapper";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CareerOS",
  description: "AI-powered interview preparation platform",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", fontSans.variable)}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
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
