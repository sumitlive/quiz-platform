import React from "react";

export default function TimerRing({ timeLeft, progress, isWarning, isDanger, isExpired, size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const stroke = isExpired || isDanger
    ? "#ef4444"
    : isWarning
    ? "#f59e0b"
    : "#00ff9d";

  const ringAnim = isDanger
    ? "animate-timer-warn"
    : isWarning
    ? "animate-timer-warn"
    : "animate-pulse-glow";

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = mins > 0
    ? `${mins}:${secs.toString().padStart(2, "0")}`
    : secs.toString();

  return (
    <div className={`timer-ring-container ${ringAnim}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="timer-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className="timer-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{
            fontSize: size < 100 ? "1.1rem" : "1.6rem",
            color: stroke,
          }}
        >
          {isExpired ? "✓" : display}
        </span>
        {!isExpired && (
          <span className="text-xs font-body mt-0.5" style={{ color: stroke, opacity: 0.7 }}>
            {mins > 0 ? "min" : "sec"}
          </span>
        )}
      </div>
    </div>
  );
}
