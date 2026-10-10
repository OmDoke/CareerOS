import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { DM_Serif_Display, DM_Sans, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "../providers/query-provider";
import { Toaster } from "../components/ui/sonner";
import { RootLayoutWrapper } from "../layouts/RootLayoutWrapper";

/* ── DM Serif Display — editorial display face for H1-H3 ── */
const fontDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/* ── DM Sans — refined body & UI typeface ── */
const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ── Geist Mono — developer-credible mono for code, scores, timers ── */
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareerOS — AI Interview Prep",
    template: "%s | CareerOS",
  },
  description:
    "Upload your resume. CareerOS analyses your skill gaps, builds a personalized curriculum, and runs daily 60-minute practice sessions with real-time AI feedback — until you hit the hiring bar.",
  keywords: ["interview prep", "FAANG", "software engineer", "AI", "coding interview", "LeetCode", "system design"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "CareerOS — AI Interview Prep",
    description: "Land the offer. Not just pass the screen.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontDisplay.variable,
        fontSans.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
