const express = require("express");
const cors = require("cors");
const db = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve React build in production
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

// ─── GET /questions/random ───────────────────────────────────────────────────
app.get("/questions/random", (req, res) => {
  const { topic, difficulty } = req.query;
  const question = db.getRandomQuestion({ topic, difficulty });
  if (!question) return res.status(404).json({ error: "No questions found" });
  res.json(question);
});

// ─── GET /questions ───────────────────────────────────────────────────────────
app.get("/questions", (req, res) => {
  const { topic, difficulty, search } = req.query;
  const questions = db.getQuestions({ topic, difficulty, search });
  res.json(questions);
});

// ─── GET /questions/:id ───────────────────────────────────────────────────────
app.get("/questions/:id", (req, res) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) return res.status(404).json({ error: "Question not found" });
  res.json(question);
});

// ─── POST /questions ──────────────────────────────────────────────────────────
app.post("/questions", (req, res) => {
  const { topic, question, answer, difficulty = "medium", hint = "" } = req.body;
  if (!topic || !question || !answer) {
    return res.status(400).json({ error: "topic, question, and answer are required" });
  }
  const created = db.createQuestion({ topic, question, answer, difficulty, hint });
  res.status(201).json(created);
});

// ─── PUT /questions/:id ─────────────────────────────────────────────────────────
app.put("/questions/:id", (req, res) => {
  const existing = db.getQuestionById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Question not found" });
  const updated = db.updateQuestion(req.params.id, req.body);
  res.json(updated);
});

// ─── DELETE /questions/:id ────────────────────────────────────────────────────
app.delete("/questions/:id", (req, res) => {
  const existing = db.getQuestionById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Question not found" });
  db.deleteQuestion(req.params.id);
  res.json({ message: "Question deleted", id: Number(req.params.id) });
});

// ─── GET /topics ──────────────────────────────────────────────────────────────
app.get("/topics", (req, res) => {
  const topics = db.getQuestions({}).map((item) => item.topic);
  res.json([...new Set(topics)].sort());
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚀 Quiz Platform API running at http://localhost:${PORT}`);
});


// Serve React app for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
