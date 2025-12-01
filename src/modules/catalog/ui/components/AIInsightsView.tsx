"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Sparkles, ThumbsDown, ThumbsUp, Zap } from "lucide-react";
import { useState } from "react";
import type { ProductInsights } from "@/modules/catalog/domain/entities/ProductInsights";
import { ProsConsList } from "@/modules/catalog/ui/components/ProsConsList";
import { RecommendationBadges } from "@/modules/catalog/ui/components/RecommendationBadges";

interface AIInsightsViewProps {
  insights: ProductInsights | null;
}

export function AIInsightsView({ insights }: AIInsightsViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const detailsId = "ai-insights-details";

  if (!insights) return null;

  return (
    <motion.section
      aria-label="AI-generated product insights"
      aria-live="polite"
      aria-busy={isExpanded}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "easeOut",
      }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm animate-pulse" />
      <div className="absolute inset-[1px] rounded-2xl bg-neutral-950" />

      {/* Content */}
      <div
        className="relative p-4 md:p-6"
        aria-live="polite"
        aria-busy={isExpanded}
      >
        {/* Header - Always visible */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">AI Insights</h2>
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
                  Beta
                </span>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-1 md:line-clamp-none">
                {insights.summary.substring(0, 80)}
                {insights.summary.length > 80 && !isExpanded ? "..." : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                {insights.pros.length}
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <ThumbsDown className="h-4 w-4" aria-hidden="true" />
                {insights.cons.length}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: "easeInOut",
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
            >
              <ChevronDown className="h-5 w-5 text-white" aria-hidden="true" />
            </motion.div>
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
              id={detailsId}
            >
              <div className="mt-6 space-y-6">
                {/* Full Summary */}
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles
                      className="h-4 w-4 text-violet-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-violet-400">
                      Summary
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    {insights.summary}
                  </p>
                </div>

                <ProsConsList pros={insights.pros} cons={insights.cons} />

                <RecommendationBadges
                  recommendedFor={insights.recommendedFor}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
