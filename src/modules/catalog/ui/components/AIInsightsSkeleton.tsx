"use client";

export function AIInsightsSkeleton() {
  return (
    <section
      data-testid="ai-insights-skeleton"
      aria-busy="true"
      aria-label="Loading AI insights"
      className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-4 md:p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded bg-neutral-700" />
        <div className="h-5 w-32 animate-pulse rounded bg-neutral-700" />
      </div>

      {/* Summary skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-neutral-700" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-700" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-700" />
      </div>

      {/* Pros/Cons skeleton */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Pros */}
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-700" />
          <div className="space-y-1.5">
            <div className="h-3 w-full animate-pulse rounded bg-neutral-700/50" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-neutral-700/50" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-neutral-700/50" />
          </div>
        </div>
        {/* Cons */}
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-700" />
          <div className="space-y-1.5">
            <div className="h-3 w-full animate-pulse rounded bg-neutral-700/50" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-neutral-700/50" />
          </div>
        </div>
      </div>

      {/* Recommendations skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-32 animate-pulse rounded-full bg-neutral-700" />
        <div className="h-8 w-28 animate-pulse rounded-full bg-neutral-700" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-700" />
      </div>
    </section>
  );
}
