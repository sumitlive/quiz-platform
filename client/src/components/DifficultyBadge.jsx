import React from "react";

const COLORS = {
  easy:   { bg: "bg-emerald-900/40", text: "text-emerald-400", border: "border-emerald-700" },
  medium: { bg: "bg-amber-900/40",   text: "text-amber-400",   border: "border-amber-700"   },
  hard:   { bg: "bg-red-900/40",     text: "text-red-400",     border: "border-red-700"     },
};

export default function DifficultyBadge({ difficulty }) {
  const d = difficulty?.toLowerCase() || "medium";
  const c = COLORS[d] || COLORS.medium;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${c.bg} ${c.text} ${c.border} uppercase tracking-wider`}>
      {d}
    </span>
  );
}
