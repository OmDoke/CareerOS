"use client";

import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: { label: string; href?: string }[];
  showBackButton?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbItems,
  showBackButton = false,
  action,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-1">
        <div className="flex items-start gap-3">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="btn-ghost h-8 w-8 rounded-lg p-0 flex items-center justify-center mt-1 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg-primary)]">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-[var(--fg-secondary)] mt-1 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0 flex items-center">{action}</div>
        )}
      </div>
    </div>
  );
}
