import React, { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function MarkdownEditor({ value, onChange, placeholder = "Write markdown...", minHeight = 180 }) {
  const [tab, setTab] = useState("write");

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-surface">
        {["write", "preview"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
              tab === t
                ? "text-accent border-b-2 border-accent bg-bg"
                : "text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto px-3 py-2 text-xs text-muted font-mono">
          {value?.length ?? 0} chars
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full bg-bg text-text font-mono text-sm p-4 resize-none outline-none"
          style={{ minHeight, lineHeight: 1.6 }}
        />
      ) : (
        <div
          className="p-4 bg-bg overflow-y-auto"
          style={{ minHeight }}
        >
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-muted text-sm italic font-body">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
