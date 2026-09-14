"use client";

import { useAuthStore } from "../../store/auth.store";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Save, User, Bell, Shield, LogOut, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import * as motion from "framer-motion/client";

type TabType = "account" | "preferences" | "billing";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("account");

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
    <>
      <div className="animate-in fade-in duration-500 space-y-8">
        <PageHeader 
          title="Settings"
          description="Manage your account preferences and application settings."
          breadcrumbItems={[{ label: "Settings" }]}
        />

        <div className="grid gap-8 md:grid-cols-[220px_1fr] items-start">
          {/* Settings Nav */}
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar sticky top-24 z-10">
            <Button 
              variant={activeTab === "account" ? "secondary" : "ghost"} 
              className="justify-start shrink-0"
              onClick={() => setActiveTab("account")}
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </Button>
            <Button 
              variant={activeTab === "preferences" ? "secondary" : "ghost"} 
              className="justify-start shrink-0"
              onClick={() => setActiveTab("preferences")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Preferences
            </Button>
            <Button 
              variant={activeTab === "billing" ? "secondary" : "ghost"} 
              className="justify-start shrink-0"
              onClick={() => setActiveTab("billing")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
          </nav>

          {/* Settings Content */}
          <div className="space-y-6">
            {activeTab === "account" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>Manage your billing and subscription details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-xl bg-secondary/30 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg">Pro Plan</h4>
                        <p className="text-sm text-muted-foreground">Active until Dec 31, 2026</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">$15 <span className="text-sm text-muted-foreground font-normal">/ mo</span></p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
