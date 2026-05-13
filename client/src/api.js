const BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
};

export const api = {
  getRandomQuestion: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${BASE}/questions/random${params ? "?" + params : ""}`).then(handle);
  },
  getQuestions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${BASE}/questions${params ? "?" + params : ""}`).then(handle);
  },
  getQuestion: (id) => fetch(`${BASE}/questions/${id}`).then(handle),
  createQuestion: (data) =>
    fetch(`${BASE}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),
  updateQuestion: (id, data) =>
    fetch(`${BASE}/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),
  deleteQuestion: (id) =>
    fetch(`${BASE}/questions/${id}`, { method: "DELETE" }).then(handle),
  getTopics: () => fetch(`${BASE}/topics`).then(handle),
};
