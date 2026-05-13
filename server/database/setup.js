const fs = require("fs");
const path = require("path");

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, "questions.json");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const seedQuestions = [
  {
    id: 1,
    topic: "Python",
    difficulty: "easy",
    question: `## Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers* such that they add up to \`target\`.

**Constraints:**
- Each input has exactly one solution
- You may not use the same element twice

\`\`\`python
# Example
nums = [2, 7, 11, 15]
target = 9
# Output: [0, 1]  (nums[0] + nums[1] == 9)
\`\`\`

Write an O(n) solution.`,
    answer: `## Solution: Hash Map Approach

Use a dictionary to store each number's index as you iterate.

\`\`\`python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]
\`\`\`

**Complexity:**
| Metric | Value |
|--------|-------|
| Time   | O(n)  |
| Space  | O(n)  |

**Key insight:** For each element, check if its complement already exists in the map. This avoids the O(n²) brute force approach.`,
  },
  {
    id: 2,
    topic: "C++",
    difficulty: "medium",
    question: `## Reverse a Linked List

Implement a function to reverse a singly linked list **in-place**.

\`\`\`cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
\`\`\`

**Example:**
\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1
\`\`

Solve iteratively **and** recursively.`,
    answer: `## Iterative Solution

\`\`\`cpp
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        ListNode* next = curr->next;  // save next
        curr->next = prev;            // reverse link
        prev = curr;                  // advance prev
        curr = next;                  // advance curr
    }
    return prev;  // prev is new head
}
\`\`

## Recursive Solution

\`\`\`cpp
ListNode* reverseListRec(ListNode* head) {
    // Base case: empty or single node
    if (!head || !head->next) return head;
    
    ListNode* newHead = reverseListRec(head->next);
    head->next->next = head;  // reverse the link
    head->next = nullptr;     // break old link
    return newHead;
}
\`\`

**Complexity Comparison:**

| Approach   | Time | Space |
|------------|------|-------|
| Iterative  | O(n) | O(1)  |
| Recursive  | O(n) | O(n)  |

> 💡 Prefer iterative for production — no stack overflow risk on large lists.`,
  },
  {
    id: 3,
    topic: "SQL",
    difficulty: "medium",
    question: `## Second Highest Salary

Write a SQL query to find the **second highest salary** from the \`employees\` table.

\`\`\`sql
CREATE TABLE employees (
    id      INTEGER PRIMARY KEY,
    name    TEXT,
    salary  INTEGER
);
\`\`\`

| id | name    | salary |
|----|---------|--------|
| 1  | Alice   | 90000  |
| 2  | Bob     | 75000  |
| 3  | Charlie | 90000  |
| 4  | Diana   | 60000  |

Return \`NULL\` if no second highest salary exists.`,
    answer: `## Solution Using LIMIT + OFFSET

\`\`\`sql
SELECT MAX(salary) AS SecondHighestSalary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
\`\`\`

## Alternative: DENSE_RANK (Modern SQL)

\`\`\`sql
WITH ranked AS (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT MAX(salary) AS SecondHighestSalary
FROM ranked
WHERE rnk = 2;
\`\`\`

## Using LIMIT/OFFSET

\`\`\`sql
SELECT salary AS SecondHighestSalary
FROM (
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS temp;
\`\`\`
`,
  },
];

function removeTimerField(item) {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => key !== "timer_seconds")
  );
}

function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    const normalized = seedQuestions.map(removeTimerField);
    fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  }

  try {
    const file = fs.readFileSync(DB_PATH, "utf8");
    const items = JSON.parse(file);
    const normalized = Array.isArray(items) ? items.map(removeTimerField) : seedQuestions.map(removeTimerField);
    if (JSON.stringify(items) !== JSON.stringify(normalized)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), "utf8");
    }
    return normalized;
  } catch (error) {
    const normalized = seedQuestions.map(removeTimerField);
    fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

const db = loadDatabase();

function nextId() {
  return db.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
}

module.exports = {
  getRandomQuestion: ({ topic, difficulty }) => {
    const filtered = db.filter((item) => {
      return (!topic || item.topic === topic) && (!difficulty || item.difficulty === difficulty);
    });
    if (!filtered.length) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  },

  getQuestions: ({ topic, difficulty, search }) => {
    const filtered = db.filter((item) => {
      const matchesTopic = !topic || item.topic === topic;
      const matchesDiff = !difficulty || item.difficulty === difficulty;
      const matchesSearch = !search || item.question.includes(search) || item.topic.includes(search);
      return matchesTopic && matchesDiff && matchesSearch;
    });
    return [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getQuestionById: (id) => db.find((item) => item.id === Number(id)) || null,

  createQuestion: ({ topic, question, answer, difficulty = "medium", hint = "" }) => {
    const newQuestion = {
      id: nextId(),
      topic,
      question,
      answer,
      hint,
      difficulty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.unshift(newQuestion);
    saveDatabase(db);
    return newQuestion;
  },

  updateQuestion: (id, updates) => {
    const index = db.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;

    const existing = db[index];
    const updated = {
      ...existing,
      topic: updates.topic ?? existing.topic,
      question: updates.question ?? existing.question,
      answer: updates.answer ?? existing.answer,
      hint: updates.hint ?? existing.hint,
      difficulty: updates.difficulty ?? existing.difficulty,
      updated_at: new Date().toISOString(),
    };

    db[index] = updated;
    saveDatabase(db);
    return updated;
  },

  deleteQuestion: (id) => {
    const index = db.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;
    const deleted = db.splice(index, 1)[0];
    saveDatabase(db);
    return deleted;
  },
};
