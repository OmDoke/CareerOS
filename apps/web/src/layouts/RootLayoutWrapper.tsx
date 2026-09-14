"use client";

import { usePathname } from "next/navigation";
import { ProtectedLayout } from "./ProtectedLayout";

const publicRoutes = ["/", "/login", "/register"];

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }
  
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
