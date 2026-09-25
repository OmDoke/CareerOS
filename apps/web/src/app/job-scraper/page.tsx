"use client";

import { useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Briefcase, Save, CheckCircle2, Link as LinkIcon, MapPin, RefreshCw } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function JobScraperPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [url, setUrl] = useState("https://www.arbeitnow.com/api/job-board-api");
  const [location, setLocation] = useState("remote");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.post("/settings/integrations/job-scraper", {
        url,
        location,
      });
      setIsSaved(true);
      toast.success("Job scraper configuration saved successfully!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            Job Scraper Configuration
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure the API source and location for your automated job scraper. These jobs will be matched against your resume and sent to your Telegram.
          </p>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Job Board API URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="url" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/jobs" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10" 
                  />
                </div>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Leave default for Arbeitnow, or provide a custom RapidAPI (e.g. JSearch) endpoint URL to scrape Naukri/LinkedIn.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Target Location</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {["remote", "pune", "mumbai", "bangalore"].map((loc) => (
                    <label 
                      key={loc}
                      className={`
                        relative flex cursor-pointer rounded-lg border bg-background p-4 shadow-sm hover:bg-secondary/50 transition-colors
                        ${location === loc ? "border-primary ring-1 ring-primary bg-primary/5" : "border-input"}
                      `}
                    >
                      <input 
                        type="radio" 
                        name="location" 
                        value={loc} 
                        checked={location === loc}
                        onChange={(e) => setLocation(e.target.value)}
                        className="sr-only" 
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-foreground capitalize flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {loc}
                          </span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : isSaved ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
