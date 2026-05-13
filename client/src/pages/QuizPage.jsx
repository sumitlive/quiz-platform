import React, { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useTimer } from "../hooks/useTimer";
import TimerRing from "../components/TimerRing";
import MarkdownRenderer from "../components/MarkdownRenderer";
import DifficultyBadge from "../components/DifficultyBadge";

const TOPIC_ICONS = { Python: "🐍", "C++": "⚙️", SQL: "🗄️", Default: "📝" };

export default function QuizPage({ config, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  const handleExpire = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const timeLimit = Number(config?.timePerQuestion) || 60;
  const timer = useTimer(timeLimit, handleExpire);

  useEffect(() => {
    api.getTopics().then(setTopics).catch(() => {});
  }, []);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (filterTopic) filters.topic = filterTopic;
      if (filterDiff) filters.difficulty = filterDiff;
      const allQuestions = await api.getQuestions(filters);
      // Shuffle and take numQuestions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, config?.numQuestions || 10);
      setQuestions(selected);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterTopic, filterDiff, config]);

  useEffect(() => {
    if (config) {
      loadQuestions();
    }
  }, [config, loadQuestions]);

  useEffect(() => {
    if (question && !loading) {
      timer.reset(timeLimit, true);
      setShowAnswer(false);
      setAnswered(false);
    }
  }, [question, loading, timeLimit]);

  const handleReveal = () => {
    timer.pause();
    setShowAnswer(true);
    if (!answered) {
      setAnswered(true);
      setStreak((s) => s + 1);
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    timer.pause();
    if (isLastQuestion) {
      // Quiz complete
      onComplete({
        correct: score,
        total: questions.length,
        timePerQuestion: config?.timePerQuestion || 60
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const icon = TOPIC_ICONS[question?.topic] || TOPIC_ICONS.Default;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-accent text-lg font-bold tracking-tight">&gt;_ QUIZR</span>
            <span className="hidden sm:block text-muted text-xs font-mono">timed coding practice</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
              <span className="text-sm">📊</span>
              <span className="text-accent font-mono text-sm font-bold">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                <span className="text-sm">🔥</span>
                <span className="text-accent font-mono text-sm font-bold">{streak}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted font-mono mr-1">FILTER:</span>
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="bg-bg border border-border text-text text-xs font-mono px-2 py-1 rounded focus:outline-none focus:border-accent"
          >
            <option value="">All Topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value)}
            className="bg-bg border border-border text-text text-xs font-mono px-2 py-1 rounded focus:outline-none focus:border-accent"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted font-mono text-sm">Loading question...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-4xl">⚠️</div>
            <p className="text-danger font-mono text-sm">{error}</p>
            <button onClick={loadQuestion} className="btn-primary">Try Again</button>
          </div>
        ) : question ? (
          <div className="animate-slide-up">
            {/* Question card */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h2 className="font-display text-accent font-bold text-lg">{question.topic}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <DifficultyBadge difficulty={question.difficulty} />
                      <span className="text-muted text-xs font-mono">
                        {config?.timePerQuestion || 60}s limit
                      </span>
                    </div>
                  </div>
                </div>
                <TimerRing
                  timeLeft={timer.timeLeft}
                  progress={timer.progress}
                  isWarning={timer.isWarning}
                  isDanger={timer.isDanger}
                  isExpired={timer.isExpired}
                  size={100}
                />
              </div>

              {/* Question body */}
              <div className="px-6 py-6">
                <MarkdownRenderer content={question.question} />
              </div>

              {/* Reveal / CTA */}
              {!showAnswer && (
                <div className="px-6 py-4 border-t border-border bg-bg/40 flex items-center justify-between">
                  <p className="text-xs text-muted font-mono">
                    {timer.isRunning ? "⏱ Timer running..." : timer.isExpired ? "⌛ Time's up!" : ""}
                  </p>
                  <button
                    onClick={handleReveal}
                    className="px-5 py-2 rounded-lg bg-accent/10 border border-accent/40 text-accent font-mono text-sm font-semibold hover:bg-accent/20 transition-colors"
                  >
                    Reveal Answer →
                  </button>
                </div>
              )}
            </div>

            {/* Answer card */}
            {showAnswer && (
              <div className="mt-4 bg-surface border border-accent/30 rounded-xl overflow-hidden shadow-2xl animate-slide-up">
                <div className="px-6 py-3 border-b border-accent/30 bg-accent/5 flex items-center gap-2">
                  <span className="text-accent text-sm font-mono font-bold">✓ ANSWER</span>
                </div>
                <div className="px-6 py-6">
                  <MarkdownRenderer content={question.answer} />
                </div>
                
                {/* Hint section */}
                {question.hint && (
                  <div className="border-t border-accent/30 px-6 py-4 bg-accent/5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-accent text-sm font-mono font-bold">💡 HINT</span>
                    </div>
                    <div className="text-text text-sm leading-relaxed">
                      {question.hint}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleNext}
                className="group flex items-center gap-3 px-8 py-3 rounded-xl bg-accent text-bg font-display font-bold text-base hover:bg-accent-dim transition-colors shadow-lg shadow-accent/20"
              >
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}