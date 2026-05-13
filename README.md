# 🎯 QUIZR - Timed Quiz & Coding Practice Platform

A full-stack web application for timed coding questions with syntax highlighting, markdown rendering, and an admin panel for CRUD operations.

---

## 📋 Features

✅ **Quiz Interface**
- Timed questions with dynamic countdown timer
- Auto-reveal answers when timer expires
- Markdown rendering for rich content
- Syntax highlighting for code blocks (Python, C++, SQL, etc.)
- Filter by topic and difficulty
- Streak counter

✅ **Admin Panel**
- Create new questions
- Edit existing questions
- Delete questions
- Markdown editor with live preview
- Search functionality

✅ **Tech Stack**
- **Backend:** Node.js + Express
- **Frontend:** React 18 + Tailwind CSS
- **Database:** SQLite
- **Content:** Markdown with GFM, Code Highlighting with highlight.js

---

## 📁 Project Structure

```
quiz-platform/
├── server/
│   ├── index.js                 # Express server
│   ├── package.json             # Server dependencies
│   └── database/
│       └── setup.js             # SQLite initialization & seed data
│
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main app with routing
│   │   ├── api.js               # API client
│   │   ├── index.js             # React entry point
│   │   ├── index.css            # Global styles
│   │   ├── components/
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   ├── MarkdownEditor.jsx
│   │   │   ├── TimerRing.jsx
│   │   │   └── DifficultyBadge.jsx
│   │   ├── hooks/
│   │   │   └── useTimer.js
│   │   └── pages/
│   │       ├── QuizPage.jsx
│   │       └── AdminPage.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Install Dependencies**

```bash
# Backend
cd quiz-platform/server
npm install

# Frontend (in a new terminal)
cd quiz-platform/client
npm install
```

### **Step 2: Start the Backend Server**

```bash
cd quiz-platform/server
npm start
```

You should see:
```
🚀 Quiz Platform API running at http://localhost:3001
```

The database will auto-initialize with sample questions.

### **Step 3: Start the Frontend**

```bash
cd quiz-platform/client
npm start
```

Your browser will open at `http://localhost:3000`

---

## 📖 How to Use

### **Quiz Mode** (Main Page)

1. **View Question** - Read the markdown-formatted question
2. **Watch Timer** - Countdown timer in the top right
3. **Reveal Answer** - Click "Reveal Answer" or let timer expire
4. **Filter** - Use dropdown filters to filter by topic/difficulty
5. **Next** - Click "Next Question" for another quiz

### **Admin Mode** (Gear Icon 📋)

1. **Click the gear icon** in bottom-right corner
2. **Create Question** - Fill in topic, question (markdown), answer (markdown), difficulty, timer
3. **Edit** - Click "Edit" on any question
4. **Delete** - Click "Delete" (with confirmation)
5. **Preview** - Toggle between "write" and "preview" tabs in the markdown editor

---

## 🗄️ Database

SQLite database auto-creates with these seed questions:
- **Python:** Two Sum (easy)
- **Python:** LRU Cache (hard)
- **C++:** Valid Parentheses (easy)
- **C++:** Reverse Linked List (medium)
- **SQL:** Second Highest Salary (medium)
- **SQL:** Department-wise Top 3 Salaries (hard)

**Database file:** `server/quiz.db` (auto-created)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions/random` | Random question (with filters) |
| GET | `/questions` | All questions (with filters) |
| GET | `/questions/:id` | Single question |
| POST | `/questions` | Create question |
| PUT | `/questions/:id` | Update question |
| DELETE | `/questions/:id` | Delete question |
| GET | `/topics` | List all topics |
| GET | `/health` | Health check |

**Query Parameters:**
- `topic` - Filter by topic (e.g., `?topic=Python`)
- `difficulty` - Filter by difficulty (e.g., `?difficulty=hard`)
- `search` - Search in question/answer (e.g., `?search=array`)

**Example Request:**
```bash
curl http://localhost:3001/questions/random?topic=Python&difficulty=easy
```

---

## ✏️ Markdown Features Supported

### Code Blocks with Syntax Highlighting
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

### Tables
| Language | Difficulty | Time Limit |
|----------|-----------|-----------|
| Python   | Easy      | 45s       |
| C++      | Hard      | 120s      |

### Formatting
- **Bold** - `**text**`
- *Italic* - `*text*`
- ~~Strikethrough~~ - `~~text~~`
- `Inline code` - `` `code` ``
- Lists, quotes, links, images

---

## 🛠️ Troubleshooting

### **Port 3000 already in use**
```bash
# Change frontend port
PORT=3002 npm start
```

### **Port 3001 already in use**
```bash
# Change backend port
PORT=3002 node index.js
```

### **CORS errors**
The server has CORS enabled by default. If issues persist, check:
- Frontend is on `http://localhost:3000`
- Backend is on `http://localhost:3001`
- Check `package.json` proxy setting

### **Database errors**
Delete `server/quiz.db` and restart server to reinitialize:
```bash
rm server/quiz.db
npm start
```

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **better-sqlite3** - SQLite driver
- **cors** - Cross-origin requests

### Frontend
- **react** - UI library
- **react-markdown** - Markdown renderer
- **highlight.js** - Code syntax highlighting
- **rehype-highlight** - Markdown code highlight plugin
- **remark-gfm** - GitHub Flavored Markdown support
- **tailwindcss** - Utility CSS framework

---

## 🎨 Design

**Dark theme** with accent colors:
- Background: `#0a0e17` (Dark blue-black)
- Accent: `#00ff9d` (Neon green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)

**Fonts:**
- Display: Space Mono (headings)
- Code: JetBrains Mono (code blocks)
- Body: IBM Plex Sans (text)

---

## 🔧 Environment Variables

Create `.env` in `server/` (optional):
```
PORT=3001
```

Create `.env.local` in `client/` (optional):
```
REACT_APP_API_URL=http://localhost:3001
```

---

## 📝 Example: Adding a New Question via API

```bash
curl -X POST http://localhost:3001/questions \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "JavaScript",
    "question": "## What does this return?\n\n```javascript\nconst x = [1,2,3].map(n => n * 2);\nconsole.log(x);\n```",
    "answer": "```javascript\n[2, 4, 6]\n```",
    "difficulty": "easy",
    "timer_seconds": 45
  }'
```

---

## 📜 License

MIT - Free to use and modify

---

## 🚀 Performance Tips

- **Lazy load questions** - Load on demand
- **Optimize images** - Use SVG for icons
- **Code splitting** - React will auto-split with create-react-app
- **Database indexing** - SQLite indexes topic, difficulty

---

## 🎓 Educational Use

This platform is perfect for:
- Coding interview prep
- Competitive programming practice
- Computer science courses
- Self-study with timed challenges
- Team quiz competitions

---

## 📞 Support

For issues, check:
1. Both servers are running (backend on 3001, frontend on 3000)
2. Database file exists at `server/quiz.db`
3. All dependencies installed (`npm install`)
4. Node version compatibility (v14+)

---

**Built with ❤️ for developers**
