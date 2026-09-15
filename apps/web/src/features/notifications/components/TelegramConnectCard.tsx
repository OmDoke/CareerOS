"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Copy, ExternalLink, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function TelegramConnectCard() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ["telegram-status"],
    queryFn: async () => {
      const res = await api.get("/telegram/status");
      return res.data;
    },
    refetchInterval: token ? 2000 : false, // Poll if waiting for connection
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/telegram/connect");
      return res.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setBotUsername(data.botUsername);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      await api.post("/telegram/disconnect");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram-status"] });
      setToken(null);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telegram Bot</CardTitle>
          <CardDescription>Checking connection status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Once connected while polling, clear token
  if (status?.connected && token) {
    setToken(null);
    queryClient.invalidateQueries({ queryKey: ["telegram-status"] });
  }

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-500" />
          <CardTitle>Telegram Integration</CardTitle>
        </div>
        <CardDescription>
          Connect CareerOS to Telegram to receive study reminders, motivation, and weekly reports.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {status?.connected ? (
          <div className="flex flex-col gap-4">
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-success dark:text-green-400">Connected Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You are receiving notifications at @{status.username || "Telegram"}.
                </p>
              </div>
            </div>
          </div>
        ) : token ? (
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground mb-2">Your secure connection token:</p>
              <div className="flex justify-center items-center gap-2">
                <code className="text-2xl font-mono font-bold tracking-widest bg-background px-4 py-2 rounded border">
                  {token}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Expires in 15 minutes.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <a href={`https://t.me/${botUsername}?start=${token}`} target="_blank" rel="noreferrer" className="w-full">
                <Button className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white">
                  Open Telegram App <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Waiting for you to start the bot...
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            We&apos;ll generate a unique token for you. You&apos;ll need to send this to our Telegram Bot to verify your account.
          </div>
        )}
      </CardContent>

      <CardFooter>
        {!status?.connected && !token && (
          <Button 
            onClick={() => connectMutation.mutate()} 
            disabled={connectMutation.isPending}
            className="w-full sm:w-auto"
          >
            {connectMutation.isPending ? "Generating..." : "Connect Telegram"}
          </Button>
        )}
        
        {status?.connected && (
          <Button 
            variant="destructive" 
            onClick={() => disconnectMutation.mutate()}
            disabled={disconnectMutation.isPending}
            className="w-full sm:w-auto"
          >
            Disconnect Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
