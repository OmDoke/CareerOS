"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bot, Eye, EyeOff, RefreshCw, Key, CheckCircle2, XCircle, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AISettings {
  exists: boolean;
  provider?: string;
  maskedApiKey?: string;
  selectedModel?: string;
  isConnected?: boolean;
  lastValidated?: string;
}

export function AIProviderCard() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [fetchingModels, setFetchingModels] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/v1/settings/ai");
      setSettings(res.data);
      if (res.data.selectedModel) {
        setSelectedModel(res.data.selectedModel);
      }
      
      // If connected, fetch available models automatically
      if (res.data.exists && res.data.isConnected) {
        fetchModels();
      }
    } catch (error) {
      toast.error("Failed to fetch AI settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    setFetchingModels(true);
    try {
      const res = await api.get("/api/v1/settings/ai/models");
      if (res.data.success) {
        setModels(res.data.models);
      }
    } catch (error) {
      toast.error("Failed to fetch available models.");
    } finally {
      setFetchingModels(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey) {
      toast.error("Please enter an API Key");
      return;
    }
    
    setSaving(true);
    try {
      const res = await api.post("/api/v1/settings/ai", {
        provider: "GEMINI",
        apiKey,
      });
      if (res.data.success) {
        toast.success("API Key saved and validated successfully!");
        setApiKey("");
        fetchSettings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid API Key");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateModel = async (model: string) => {
    setSelectedModel(model);
    try {
      await api.post("/api/v1/settings/ai", {
        provider: "GEMINI",
        selectedModel: model,
      });
      toast.success("Default model updated");
      setSettings((prev) => prev ? { ...prev, selectedModel: model } : null);
    } catch (error) {
      toast.error("Failed to update model");
    }
  };

  const handleTestConnection = async () => {
    const loadingToast = toast.loading("Testing connection...");
    try {
      const res = await api.post("/api/v1/settings/ai/test");
      if (res.data.success) {
        toast.success(`Connection successful! Latency: ${res.data.latency}ms`, { id: loadingToast });
        setSettings((prev) => prev ? { ...prev, isConnected: true } : null);
      }
    } catch (error) {
      toast.error("Connection failed. Check your API key.", { id: loadingToast });
      setSettings((prev) => prev ? { ...prev, isConnected: false } : null);
    }
  };

  if (loading) {
    return <Card><CardContent className="p-8 text-center">Loading AI Configuration...</CardContent></Card>;
  }

  return (
    <Card className="w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-5 w-5 text-primary" />
              AI Provider Setup
            </CardTitle>
            <CardDescription className="mt-1">
              Connect your personal Gemini API key to power CareerOS.
            </CardDescription>
          </div>
          {settings?.exists && (
            <Badge variant={settings.isConnected ? "default" : "destructive"} className="px-3 py-1">
              {settings.isConnected ? (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="w-3 h-3 mr-1" /> Disconnected</>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* API Key Section */}
        <div className="space-y-3 p-5 border rounded-xl bg-card">
          <div>
            <Label className="text-base font-semibold">Gemini API Key</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Your key is heavily encrypted (AES-256-GCM) before leaving the server. We never store plaintext keys.
            </p>
          </div>
          
          {settings?.exists && settings.maskedApiKey ? (
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono tracking-wider">{settings.maskedApiKey}</code>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSettings({ ...settings, exists: false })}>
                Update Key
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 bg-background"
                />
                <button 
                  type="button" 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button onClick={handleSaveKey} disabled={saving || !apiKey} className="w-full sm:w-auto">
                {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Connect
              </Button>
            </div>
          )}
        </div>

        {/* Model Selection Section */}
        {settings?.exists && settings.isConnected && (
          <div className="space-y-3 p-5 border rounded-xl bg-card">
             <div className="flex items-start justify-between">
               <div>
                  <Label className="text-base font-semibold">Default Generative Model</Label>
                  <p className="text-sm text-muted-foreground">
                    Select which model you want to use for AI generations.
                  </p>
               </div>
               <Button variant="outline" size="sm" onClick={fetchModels} disabled={fetchingModels}>
                 <RefreshCw className={`h-3.5 w-3.5 mr-2 ${fetchingModels ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
             </div>
             
             <Select value={selectedModel} onValueChange={handleUpdateModel}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent>
                {models.length > 0 ? (
                  models.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))
                ) : (
                  <SelectItem value={selectedModel || "gemini-3.6-flash"}>{selectedModel || "gemini-3.6-flash"}</SelectItem>
                )}
              </SelectContent>
             </Select>
          </div>
        )}

      </CardContent>
      {settings?.exists && (
        <CardFooter className="bg-secondary/20 border-t py-4 px-6 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Last Validated: {settings.lastValidated ? new Date(settings.lastValidated).toLocaleString() : "Unknown"}
          </p>
          <Button variant="outline" size="sm" onClick={handleTestConnection}>
            Test Connection
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
