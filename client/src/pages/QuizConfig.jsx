import React, { useState } from "react";

export default function QuizConfig({ onStartQuiz }) {
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(120);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numQuestions > 0 && timePerQuestion > 0) {
      onStartQuiz({ numQuestions, timePerQuestion });
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-accent text-3xl font-bold tracking-tight mb-2">
            &gt;_ QUIZR
          </h1>
          <p className="text-muted font-mono text-sm">Configure your quiz session</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-text font-mono text-sm font-semibold mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full bg-bg border border-border text-text text-sm font-mono px-3 py-2 rounded focus:outline-none focus:border-accent"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-text font-mono text-sm font-semibold mb-2">
                Time per Question (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="600"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 10)}
                className="w-full bg-bg border border-border text-text text-sm font-mono px-3 py-2 rounded focus:outline-none focus:border-accent"
                placeholder="120"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl bg-accent text-bg font-display font-bold text-base hover:bg-accent-dim transition-colors shadow-lg shadow-accent/20"
            >
              Start Quiz →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}