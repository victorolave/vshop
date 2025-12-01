"use client";

import { ChevronDown, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 769;

const getIsDesktop = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= DESKTOP_BREAKPOINT;
};

export interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export function ProsConsList({ pros, cons }: ProsConsListProps) {
  const [isDesktop, setIsDesktop] = useState(getIsDesktop());
  const [prosExpanded, setProsExpanded] = useState(isDesktop);
  const [consExpanded, setConsExpanded] = useState(isDesktop);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
      setProsExpanded(desktop);
      setConsExpanded(desktop);
    };

    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
        <button
          type="button"
          aria-expanded={prosExpanded}
          aria-controls="pros-list"
          onClick={() => setProsExpanded((value) => !value)}
          className="flex w-full items-center justify-between gap-3 text-left min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span className="font-semibold text-emerald-300">Pros</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-emerald-300 transition-transform ${
              prosExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
        {prosExpanded && (
          <ul
            id="pros-list"
            aria-label="Product advantages"
            className="mt-3 space-y-2 text-sm text-neutral-200"
          >
            {pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                {pro}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-rose-500/10 p-4 ring-1 ring-rose-500/20">
        <button
          type="button"
          aria-expanded={consExpanded}
          aria-controls="cons-list"
          onClick={() => setConsExpanded((value) => !value)}
          className="flex w-full items-center justify-between gap-3 text-left min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
        >
          <div className="flex items-center gap-2">
            <ThumbsDown className="h-4 w-4 text-rose-400" aria-hidden="true" />
            <span className="font-semibold text-rose-300">Cons</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-rose-300 transition-transform ${
              consExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
        {consExpanded && (
          <ul
            id="cons-list"
            aria-label="Product disadvantages"
            className="mt-3 space-y-2 text-sm text-neutral-200"
          >
            {cons.map((con) => (
              <li key={con} className="flex items-start gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400"
                  aria-hidden="true"
                />
                {con}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
