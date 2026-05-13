import React, { useState } from "react";
import QuizConfig from "./pages/QuizConfig";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("config");
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  const handleStartQuiz = (config) => {
    setQuizConfig(config);
    setCurrentPage("quiz");
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentPage("results");
  };

  const handleNewQuiz = () => {
    setQuizConfig(null);
    setQuizResults(null);
    setCurrentPage("config");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "config":
        return <QuizConfig onStartQuiz={handleStartQuiz} />;
      case "quiz":
        return <QuizPage config={quizConfig} onComplete={handleQuizComplete} />;
      case "results":
        return <ResultsPage results={quizResults} onNewQuiz={handleNewQuiz} />;
      case "admin":
        return <AdminPage />;
      default:
        return <QuizConfig onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}

      {/* Floating nav button - only show when not in quiz */}
      {currentPage !== "quiz" && (
        <button
          onClick={() => setCurrentPage(currentPage === "admin" ? "config" : "admin")}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-bg flex items-center justify-center font-bold text-xl hover:bg-accent-dim transition-colors shadow-lg shadow-accent/30 hover:shadow-accent/50 z-50"
          title={currentPage === "admin" ? "Go to Quiz" : "Go to Admin"}
        >
          {currentPage === "admin" ? "🎯" : "⚙️"}
        </button>
      )}
    </div>
  );
}
