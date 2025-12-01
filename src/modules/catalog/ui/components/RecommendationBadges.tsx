"use client";

import { Battery, Camera, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";

const ICON_MAP: Array<{
  pattern: RegExp;
  icon: typeof Camera | typeof Battery | typeof Sparkles | typeof Zap;
}> = [
  { pattern: /photo|camera|lens|photography/i, icon: Camera },
  { pattern: /battery|power|long|endurance/i, icon: Battery },
  { pattern: /performance|speed|fast|processor/i, icon: Zap },
  { pattern: /default|safe/i, icon: Sparkles },
];

export interface RecommendationBadgesProps {
  recommendedFor?: string[];
}

export function RecommendationBadges({
  recommendedFor,
}: RecommendationBadgesProps) {
  const badges = recommendedFor ?? [];
  const [selected, setSelected] = useState<string | null>(null);

  const items = useMemo(
    () =>
      badges.map((label) => {
        const match = ICON_MAP.find((entry) => entry.pattern.test(label));
        return {
          label,
          icon: match?.icon ?? Sparkles,
        };
      }),
    [badges],
  );

  if (badges.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-amber-300">
          Recommended for
        </span>
      </div>
      <ul aria-label="Recommended user types" className="flex flex-wrap gap-2">
        {items.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              aria-pressed={selected === label}
              onClick={() =>
                setSelected((prev) => (prev === label ? null : label))
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm min-h-[44px] min-w-[44px] transition ${
                selected === label
                  ? "border-amber-400 bg-amber-500/20 text-amber-100 shadow-lg"
                  : "border-white/20 bg-white/5 text-amber-200 hover:border-amber-300 hover:bg-amber-500/10"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300`}
            >
              <Icon className="h-4 w-4 text-amber-400" aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
