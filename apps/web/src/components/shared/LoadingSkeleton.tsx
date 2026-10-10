import React from "react";

/* ── Skeleton primitives — match real content shapes, no overlays ── */

function Sk({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/* Dashboard skeleton — matches the real dashboard layout */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Readiness gauge card */}
      <div className="card p-6">
        <Sk className="h-4 w-32 mb-4" />
        <Sk className="h-8 w-20 mb-3" />
        <Sk className="h-2 w-full rounded-full" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Sk className="h-3 w-24" />
              <Sk className="h-7 w-7 rounded-lg" />
            </div>
            <Sk className="h-8 w-16" />
            <Sk className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6 space-y-4">
          <Sk className="h-4 w-28" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-3/4" />
          <Sk className="h-10 w-36 rounded-full" />
        </div>
        <div className="card p-6 space-y-4">
          <Sk className="h-4 w-24" />
          <Sk className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* Page skeleton — used on most pages while data loads */
export function SpinnerSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="space-y-2">
        <Sk className="h-3 w-24" />
        <Sk className="h-8 w-56" />
        <Sk className="h-4 w-80" />
      </div>

      {/* Stat row */}
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <Sk className="h-3 w-20" />
            <Sk className="h-8 w-14" />
          </div>
        ))}
      </div>

      {/* Main content block */}
      <div className="card p-6 space-y-4">
        <Sk className="h-5 w-40" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-5/6" />
        <Sk className="h-4 w-4/6" />
        <div className="pt-2">
          <Sk className="h-10 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* Question skeleton — used while AI generates a question */
export function QuestionSkeleton() {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Question card */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <Sk className="h-5 w-24 rounded-full" />
          <Sk className="h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-11/12" />
          <Sk className="h-4 w-3/4" />
        </div>
        <div className="space-y-2 pt-2">
          {[0, 1, 2, 3].map((i) => (
            <Sk key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Sk className="h-9 w-24 rounded-full" />
          <Sk className="h-9 w-32 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-9 w-20 rounded-full" />
          <Sk className="h-9 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* Generic centered spinner — use sparingly */
export function CenteredSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div
        className="h-8 w-8 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin"
      />
      <p className="text-sm text-[var(--fg-muted)]">Loading...</p>
    </div>
  );
}

/* Page skeleton alias */
export function PageSkeleton() {
  return <SpinnerSkeleton />;
}
