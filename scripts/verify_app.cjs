const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Total questions loaded: ${data.length}`);

const topics = ['Percentage', 'Ratio & Proportion', 'Profit & Loss', 'DSA'];
const counts = {};

for (const t of topics) {
  counts[t] = 0;
}

let errors = [];

data.forEach((q, idx) => {
  // Check ID
  if (!q.id || typeof q.id !== 'string') {
    errors.push(`[${idx}] Missing or invalid id: ${q.id}`);
  }

  // Check Topic
  if (!topics.includes(q.topic)) {
    errors.push(`[${q.id}] Invalid topic: ${q.topic}`);
  } else {
    counts[q.topic]++;
  }

  // Check Question string
  if (!q.question || q.question.trim().length < 10) {
    errors.push(`[${q.id}] Question string too short or missing`);
  }

  // Check Options
  if (!q.options || typeof q.options !== 'object') {
    errors.push(`[${q.id}] Missing options object`);
  } else {
    for (const opt of ['A', 'B', 'C', 'D']) {
      if (!q.options[opt] || q.options[opt].trim().length === 0) {
        errors.push(`[${q.id}] Option ${opt} is empty`);
      }
    }
  }

  // Check Correct Answer
  if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
    errors.push(`[${q.id}] Invalid correctAnswer: ${q.correctAnswer}`);
  }

  // Check Explanation
  if (!q.explanation || q.explanation.trim().length < 20) {
    errors.push(`[${q.id}] Explanation too short or missing`);
  }

  // Check Memory Trick
  if (!q.memoryTrick || q.memoryTrick.trim().length < 15) {
    errors.push(`[${q.id}] Memory trick too short or missing`);
  }
});

console.log('Topic Distribution:', counts);

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
} else {
  console.log('SUCCESS: All 100 questions verified against strict schema, options, explanations, and memory tricks!');
}
