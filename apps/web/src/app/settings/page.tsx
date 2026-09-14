"use client";

import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Save, User, Bell, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and application settings.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[200px_1fr]">
          {/* Settings Nav */}
          <nav className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Button>
            <Button variant="ghost" className="justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </nav>

          {/* Settings Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="w-full p-2 border rounded-md bg-secondary/50 text-muted-foreground" 
                  />
                  <p className="text-xs text-muted-foreground">Your email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.firstName || ""} 
                    placeholder="Enter your name" 
                    className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors" 
                  />
                </div>
                <Button onClick={handleSave} className="mt-2">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how CareerOS looks on your device.</CardDescription>
              </CardHeader>
              <CardContent>
                {mounted && (
                  <div className="flex gap-4">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex-1"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex-1"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex-1"
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Sign out</h4>
                    <p className="text-xs text-muted-foreground mt-1">Log out of your account on this device.</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-sm">Delete Account</h4>
                    <p className="text-xs text-muted-foreground mt-1">Permanently remove your account and all data.</p>
                  </div>
                  <Button variant="destructive" onClick={() => alert("Contact support to delete account.")} className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
