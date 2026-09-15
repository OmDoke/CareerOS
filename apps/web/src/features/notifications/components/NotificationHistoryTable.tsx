"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpinnerSkeleton } from "@/components/shared/LoadingSkeleton";
import { Clock, MessageCircle, Bug, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NotificationHistoryTable() {
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ["notification-history"],
    queryFn: async () => {
      const res = await api.get("/notifications/history");
      return res.data;
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/notifications/test");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Test notification dispatched!");
      queryClient.invalidateQueries({ queryKey: ["notification-history"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send test notification");
    }
  });

  if (isLoading) return <SpinnerSkeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notification Log</CardTitle>
          <CardDescription>Recent messages sent to your Telegram account.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => testMutation.mutate()} disabled={testMutation.isPending}>
          <Bug className="h-4 w-4 mr-2" />
          Test Connection
        </Button>
      </CardHeader>
      <CardContent>
        {history?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications sent yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history?.map((log: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-secondary/10 transition-colors">
                <div className="mt-1 shrink-0">
                  {log.status === "DELIVERED" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : log.status === "FAILED" ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(log.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 text-foreground pt-1">{log.message}</p>
                  {log.error && (
                    <p className="text-xs text-destructive mt-1 font-mono">Error: {log.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
