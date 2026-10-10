import React from "react";
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
  accentColor?: "accent" | "ok" | "err" | "muted";
}

const ACCENT_MAP = {
  accent: {
    bg: "var(--accent-dim)",
    border: "color-mix(in srgb, var(--accent) 25%, transparent)",
    fg: "var(--accent-hover)",
  },
  ok: {
    bg: "var(--ok-dim)",
    border: "color-mix(in srgb, var(--ok) 25%, transparent)",
    fg: "var(--ok)",
  },
  err: {
    bg: "var(--err-dim)",
    border: "color-mix(in srgb, var(--err) 25%, transparent)",
    fg: "var(--err)",
  },
  muted: {
    bg: "var(--bg-sunken)",
    border: "var(--border)",
    fg: "var(--fg-secondary)",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  delay = 0,
  accentColor = "accent",
}: StatCardProps) {
  const colors = ACCENT_MAP[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div
        className={cn(
          "card card-interactive p-5 relative overflow-hidden",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-[var(--fg-muted)] mb-3">{title}</p>
            <div
              className="stat-number text-3xl font-medium text-[var(--fg-primary)] tabular-nums leading-none"
            >
              {value}
            </div>

            {(description || trend) && (
              <div className="flex items-center gap-2 mt-2">
                {trend && (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: trend.positive === true
                        ? "var(--ok-dim)"
                        : trend.positive === false
                        ? "var(--err-dim)"
                        : "var(--bg-sunken)",
                      color: trend.positive === true
                        ? "var(--ok)"
                        : trend.positive === false
                        ? "var(--err)"
                        : "var(--fg-secondary)",
                    }}
                  >
                    {trend.value > 0 ? "+" : ""}{trend.value}%
                  </span>
                )}
                {description && (
                  <span className="text-xs text-[var(--fg-muted)]">{description}</span>
                )}
              </div>
            )}
          </div>

          {/* Icon — uses the colour accent system */}
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.fg,
            }}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
