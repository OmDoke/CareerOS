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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className={cn(
        "rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 shadow-soft",
        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] hover:border-primary/30 hover:bg-white/95",
        "transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden",
        className
      )}>
        {/* Subtle ambient gradient flare */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
        
        <div className="flex items-center justify-between pb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <div className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
            <Icon className="h-4 w-4 transition-colors" />
          </div>
        </div>
        
        <div>
          <div className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">{value}</div>
          
          {(description || trend) && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              {trend && (
                <span className={cn(
                  "font-bold px-1.5 py-0.5 rounded-full text-[11px]",
                  trend.positive === true && "text-emerald-700 bg-emerald-50 border border-emerald-200",
                  trend.positive === false && "text-rose-700 bg-rose-50 border border-rose-200",
                  trend.positive === undefined && "text-slate-700 bg-slate-100"
                )}>
                  {trend.value > 0 ? "+" : ""}{trend.value}%
                </span>
              )}
              {trend && <span className="text-slate-300">•</span>}
              <span>{description}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
