import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  className,
  delay = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-8 w-8 rounded-md bg-secondary/50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          
          {(description || trend) && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {trend && (
                <span className={cn(
                  "font-medium",
                  trend.positive === true && "text-success",
                  trend.positive === false && "text-destructive",
                  trend.positive === undefined && "text-foreground"
                )}>
                  {trend.value > 0 ? "+" : ""}{trend.value}%
                </span>
              )}
              {trend && <span className="mx-1">•</span>}
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
