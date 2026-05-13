import React from "react";

export default function ResultsPage({ results, onNewQuiz }) {
  const { correct, total, timePerQuestion } = results;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-accent text-3xl font-bold tracking-tight mb-2">
            Quiz Complete!
          </h1>
          <p className="text-muted font-mono text-sm">Here's how you did</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-2xl text-center">
          <div className="mb-6">
            <div className="text-6xl mb-2">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <div className="text-4xl font-display font-bold text-accent mb-1">
              {correct}/{total}
            </div>
            <div className="text-muted font-mono text-sm">
              {percentage}% correct
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-text font-mono text-sm">Questions Answered</span>
              <span className="text-accent font-mono font-bold">{total}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-text font-mono text-sm">Correct Answers</span>
              <span className="text-accent font-mono font-bold">{correct}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text font-mono text-sm">Time per Question</span>
              <span className="text-accent font-mono font-bold">{timePerQuestion}s</span>
            </div>
          </div>

          <button
            onClick={onNewQuiz}
            className="w-full px-6 py-3 rounded-xl bg-accent text-bg font-display font-bold text-base hover:bg-accent-dim transition-colors shadow-lg shadow-accent/20"
          >
            Take Another Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}