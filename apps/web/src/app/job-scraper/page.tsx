"use client";

import { useState } from "react";
import { Briefcase, Save, CheckCircle2, Link as LinkIcon, MapPin, RefreshCw } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";


export default function JobScraperPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [url, setUrl] = useState("https://www.arbeitnow.com/api/job-board-api");
  const [locations, setLocations] = useState<string[]>(["remote"]);

  const [rapidUrl, setRapidUrl] = useState("");
  const [rapidKey, setRapidKey] = useState("");
  const [rapidHost, setRapidHost] = useState("");
  const [isRapidSaving, setIsRapidSaving] = useState(false);
  const [isRapidSaved, setIsRapidSaved] = useState(false);

  const handleLocationToggle = (loc: string) => {
    setLocations(prev => 
      prev.includes(loc) 
        ? prev.filter(l => l !== loc)
        : [...prev, loc]
    );
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.post("/settings/integrations/job-scraper", {
        url,
        location: locations.join(","),
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

  const handleRapidSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRapidSaving(true);
    
    try {
      await api.post("/settings/integrations/rapidapi", {
        url: rapidUrl,
        key: rapidKey,
        host: rapidHost
      });
      setIsRapidSaved(true);
      toast.success("RapidAPI configuration saved successfully!");
      setTimeout(() => setIsRapidSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save RapidAPI configuration.");
    } finally {
      setIsRapidSaving(false);
    }
  };

  return (
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
                        ${locations.includes(loc) ? "border-primary ring-1 ring-primary bg-primary/5" : "border-input"}
                      `}
                    >
                      <input 
                        type="checkbox" 
                        name="location" 
                        value={loc} 
                        checked={locations.includes(loc)}
                        onChange={() => handleLocationToggle(loc)}
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

        {/* RapidAPI Module */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden mt-8">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                RapidAPI Configuration
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure your RapidAPI endpoint (e.g. JSearch) to be used with the /jobsrapid command on Telegram.
              </p>
            </div>
            <form onSubmit={handleRapidSave} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">RapidAPI URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="url" 
                    required
                    value={rapidUrl}
                    onChange={(e) => setRapidUrl(e.target.value)}
                    placeholder="https://jsearch.p.rapidapi.com/search" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">X-RapidAPI-Key</label>
                <input 
                  type="password" 
                  required
                  value={rapidKey}
                  onChange={(e) => setRapidKey(e.target.value)}
                  placeholder="Your RapidAPI Key" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">X-RapidAPI-Host</label>
                <input 
                  type="text" 
                  required
                  value={rapidHost}
                  onChange={(e) => setRapidHost(e.target.value)}
                  placeholder="jsearch.p.rapidapi.com" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={isRapidSaving}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 disabled:opacity-50"
                >
                  {isRapidSaving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : isRapidSaved ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isRapidSaving ? "Saving..." : isRapidSaved ? "Saved!" : "Save RapidAPI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
