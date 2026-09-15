"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { useState, useEffect } from "react";
import { Save, BellRing } from "lucide-react";

export function NotificationSettingsCard() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const res = await api.get("/notifications/settings");
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updated: any) => {
      const res = await api.patch("/notifications/settings", updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
  });

  if (isLoading || !settings) return <SpinnerSkeleton />;

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    mutation.mutate(settings);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>Customize what alerts you receive and when.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Timing Settings */}
        <div className="grid gap-4 md:grid-cols-2 p-4 bg-secondary/20 rounded-lg border">
          <div className="space-y-2">
            <Label>Daily Reminder Time</Label>
            <Select value={settings.reminderTime} onValueChange={(val: string) => handleChange("reminderTime", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, i) => {
                  const hour = i.toString().padStart(2, "0");
                  return <SelectItem key={hour} value={`${hour}:00`}>{hour}:00 UTC</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">When the scheduler should check for your daily tasks.</p>
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={settings.timezone} onValueChange={(val: string) => handleChange("timezone", val)} disabled>
              <SelectTrigger>
                <SelectValue placeholder="UTC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Default)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Currently locked to UTC.</p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Study Reminders</Label>
              <p className="text-sm text-muted-foreground">Alert me if I miss my daily session.</p>
            </div>
            <Switch checked={settings.studyReminder} onCheckedChange={(val: boolean) => handleChange("studyReminder", val)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Review & Practice Reminders</Label>
              <p className="text-sm text-muted-foreground">Notify me about spaced repetition and weak topics.</p>
            </div>
            <Switch 
              checked={settings.reviewReminder} 
              onCheckedChange={(val: boolean) => {
                handleChange("reviewReminder", val);
                handleChange("practiceReminder", val);
              }} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">AI Motivation</Label>
              <p className="text-sm text-muted-foreground">Daily personalized motivational messages.</p>
            </div>
            <Switch checked={settings.motivationMessages} onCheckedChange={(val: boolean) => handleChange("motivationMessages", val)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Weekly Report</Label>
              <p className="text-sm text-muted-foreground">Receive a summary of your progress every Sunday.</p>
            </div>
            <Switch checked={settings.weeklyReport} onCheckedChange={(val: boolean) => handleChange("weeklyReport", val)} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSave} disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? "Saving..." : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
