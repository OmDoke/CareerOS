"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { useAuthStore } from "../../store/auth.store";
import { useLogout } from "../../features/auth/hooks/useAuth";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Link href="/resume">
              <Button variant="outline">Resume</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
        
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.firstName || user?.email}!</h2>
          <p className="text-muted-foreground">This is your career preparation dashboard. Start tracking your progress here.</p>
        </div>
      </div>
    </ProtectedLayout>
  );
}
