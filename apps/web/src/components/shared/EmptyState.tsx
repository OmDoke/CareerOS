import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import * as motion from "framer-motion/client";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  children
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-10 md:p-14 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-sm relative z-10">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2 relative z-10">{title}</h2>
        
        <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed relative z-10">
          {description}
        </p>
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {children}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 relative z-10">
          {primaryAction && (
            primaryAction.href ? (
              <Link href={primaryAction.href}>
                <button className="w-full sm:w-auto rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center">
                  {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                  {primaryAction.label}
                </button>
              </Link>
            ) : (
              <button onClick={primaryAction.onClick} className="w-full sm:w-auto rounded-full bg-primary hover:bg-purple-600 text-white font-extrabold uppercase tracking-widest text-[11px] px-8 py-3.5 shadow-lg shadow-primary/25 border border-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center">
                {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                {primaryAction.label}
              </button>
            )
          )}
          
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <button className="w-full sm:w-auto rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-[11px] px-7 py-3.5 shadow-sm transition-all active:scale-95">
                  {secondaryAction.label}
                </button>
              </Link>
            ) : (
              <button onClick={secondaryAction.onClick} className="w-full sm:w-auto rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-[11px] px-7 py-3.5 shadow-sm transition-all active:scale-95">
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
