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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col items-center justify-center text-center p-12 py-16 border-dashed shadow-sm">
        <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
        
        <p className="text-muted-foreground max-w-md mb-8">
          {description}
        </p>
        
        {children}
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          {primaryAction && (
            primaryAction.href ? (
              <Link href={primaryAction.href}>
                <Button size="lg" className="w-full sm:w-auto">
                  {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                  {primaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={primaryAction.onClick} className="w-full sm:w-auto">
                {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                {primaryAction.label}
              </Button>
            )
          )}
          
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="lg" onClick={secondaryAction.onClick} className="w-full sm:w-auto">
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      </Card>
    </motion.div>
  );
}
