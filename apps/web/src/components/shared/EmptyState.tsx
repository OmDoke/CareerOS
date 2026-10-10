import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
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
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="card p-12 md:p-16 flex flex-col items-center justify-center text-center">
        {/* Icon container — warm accent bg, no glassmorphism */}
        <div
          className="h-16 w-16 rounded-xl flex items-center justify-center mb-6 border"
          style={{
            backgroundColor: "var(--accent-dim)",
            borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
            color: "var(--accent-hover)",
          }}
        >
          <Icon className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight">
          {title}
        </h2>

        <p className="text-sm text-[var(--fg-secondary)] max-w-sm leading-relaxed mb-8">
          {description}
        </p>

        <div className="w-full flex flex-col items-center">
          {children}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          {primaryAction && (
            primaryAction.href ? (
              <Link href={primaryAction.href}>
                <button className="btn-primary px-7 py-2.5 text-sm">
                  {primaryAction.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            ) : (
              <button
                onClick={primaryAction.onClick}
                className="btn-primary px-7 py-2.5 text-sm"
              >
                {primaryAction.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <button className="btn-ghost px-6 py-2.5 text-sm">
                  {secondaryAction.label}
                </button>
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="btn-ghost px-6 py-2.5 text-sm"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
