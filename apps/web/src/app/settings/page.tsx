"use client";

import { useAuthStore } from "../../store/auth.store";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Sun, Monitor, Save, User, Bell, LogOut, Bot } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import * as motion from "framer-motion/client";
import { TelegramConnectCard } from "../../features/notifications/components/TelegramConnectCard";
import { NotificationSettingsCard } from "../../features/notifications/components/NotificationSettingsCard";
import { NotificationHistoryTable } from "../../features/notifications/components/NotificationHistoryTable";
import { AIProviderCard } from "../../features/settings/components/AIProviderCard";

type TabType = "account" | "preferences" | "notifications" | "ai-provider";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);
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
              variant={activeTab === "notifications" ? "secondary" : "ghost"} 
              className="justify-start shrink-0"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button 
              variant={activeTab === "ai-provider" ? "secondary" : "ghost"} 
              className="justify-start shrink-0"
              onClick={() => setActiveTab("ai-provider")}
            >
              <Bot className="mr-2 h-4 w-4" />
              AI Provider
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
                    <CardTitle>Appearance & Theme</CardTitle>
                    <CardDescription>CareerOS is configured with a Light-Mode Glassmorphism interface.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Sun className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Light Glassmorphism (hexOS)</p>
                          <p className="text-xs text-slate-500">Frosted white panels, brand violet accents, and high-contrast typography</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 items-start">
                  <div className="space-y-6">
                    <TelegramConnectCard />
                    <NotificationSettingsCard />
                  </div>
                  <div>
                    <NotificationHistoryTable />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ai-provider" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <AIProviderCard />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
