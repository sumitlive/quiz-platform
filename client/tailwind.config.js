/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Mono'", "monospace"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
      colors: {
        bg: "#0a0e17",
        surface: "#111827",
        border: "#1f2937",
        accent: "#00ff9d",
        "accent-dim": "#00cc7a",
        warn: "#f59e0b",
        danger: "#ef4444",
        muted: "#6b7280",
        text: "#e5e7eb",
        "text-dim": "#9ca3af",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,255,157,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(0,255,157,0.7)" },
        },
        "timer-warn": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(245,158,11,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(245,158,11,0.8)" },
        },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "timer-warn": "timer-warn 0.6s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
