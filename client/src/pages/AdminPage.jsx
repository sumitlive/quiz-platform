import React, { useState, useEffect } from "react";
import { api } from "../api";
import MarkdownEditor from "../components/MarkdownEditor";
import DifficultyBadge from "../components/DifficultyBadge";

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    topic: "",
    question: "",
    answer: "",
    hint: "",
    difficulty: "medium",
  });

  useEffect(() => { loadQuestions(); }, [search]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = search ? { search } : {};
      const data = await api.getQuestions(filters);
      setQuestions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ topic: "", question: "", answer: "", hint: "", difficulty: "medium" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (q) => {
    setForm({
      topic: q.topic,
      question: q.question,
      answer: q.answer,
      hint: q.hint || "",
      difficulty: q.difficulty,
    });
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.topic || !form.question || !form.answer) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await api.updateQuestion(editingId, form);
      } else {
        await api.createQuestion(form);
      }
      await loadQuestions();
      resetForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteQuestion(id);
      await loadQuestions();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-accent text-lg font-bold tracking-tight">&gt;_ ADMIN</h1>
            <p className="text-muted text-xs font-mono mt-0.5">Manage quiz questions</p>
          </div>
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-border text-text font-mono text-xs font-semibold hover:bg-accent/20 transition-colors"
          >
            Back to Quiz
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Error alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm font-mono">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-accent font-bold text-lg">
                  {editingId ? "✎ Edit" : "+ New"}
                </h2>
                {showForm && (
                  <button
                    onClick={resetForm}
                    className="text-xs font-mono text-muted hover:text-text transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {showForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-muted mb-2">Topic</label>
                    <input
                      type="text"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      placeholder="e.g. Python, C++"
                      className="w-full bg-bg border border-border text-text rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-muted mb-2">Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className="w-full bg-bg border border-border text-text rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>


                  <div>
                    <label className="block text-xs font-mono font-bold text-muted mb-2">Question (Markdown)</label>
                    <MarkdownEditor
                      value={form.question}
                      onChange={(v) => setForm({ ...form, question: v })}
                      minHeight={120}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-muted mb-2">Answer (Markdown)</label>
                    <MarkdownEditor
                      value={form.answer}
                      onChange={(v) => setForm({ ...form, answer: v })}
                      minHeight={120}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-muted mb-2">Hint (Optional)</label>
                    <textarea
                      value={form.hint}
                      onChange={(e) => setForm({ ...form, hint: e.target.value })}
                      placeholder="e.g. Think about which join type keeps all records from the left table..."
                      className="w-full bg-bg border border-border text-text rounded px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 px-4 py-2 rounded-lg bg-accent text-bg font-mono font-bold text-sm hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : editingId ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 rounded-lg bg-border text-text font-mono font-bold text-sm hover:bg-border/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-3 rounded-lg bg-accent/10 border border-accent/40 text-accent font-mono font-bold hover:bg-accent/20 transition-colors"
                >
                  New Question
                </button>
              )}
            </div>
          </div>

          {/* Questions list */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-bg border border-border text-text rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {loading && !showForm ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-sm font-mono mb-4">No questions found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 rounded-lg bg-accent text-bg font-mono font-bold text-sm hover:bg-accent-dim transition-colors"
                >
                  Create First Question
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="bg-surface border border-border rounded-lg p-4 hover:border-accent/40 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-mono font-bold text-accent text-sm mb-1">
                          {q.topic}
                        </h3>
                        <p className="text-text text-sm line-clamp-2">{q.question.substring(0, 80)}...</p>
                        <div className="flex items-center gap-2 mt-2">
                          <DifficultyBadge difficulty={q.difficulty} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1 text-xs font-mono rounded bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1 text-xs font-mono rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 text-xs text-muted font-mono text-center">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
