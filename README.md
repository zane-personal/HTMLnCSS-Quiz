# Markup Lab — HTML & CSS Intermediate Quiz

A self-contained 35-minute quiz for intermediate HTML and CSS, with beginner-friendly **Flexbox** and **CSS Grid** rounds.

40 multiple-choice questions · 4 topic areas · instant scoring · full answer review · no build step and no dependencies.

## Run it

Open `index.html` in any modern browser.

For the most reliable persistence (and to avoid any `file://` quirks in your browser), serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Features

- **35-minute countdown** with a live timer, warning state under 5 minutes, and automatic submission at 00:00.
- **40 questions** split across:
  - HTML & semantics — 12
  - CSS fundamentals — 11
  - Flexbox — 9
  - CSS Grid — 8

  HTML and CSS questions are intermediate level. Flexbox and Grid questions focus on core, beginner-friendly concepts such as `display: flex`, `justify-content`, `1fr`, and `gap`.
- **Free navigation** between questions, a 40-cell question map, and flagging for later review.
- **Instant scoring** with a pass mark of 70%, a per-topic breakdown, and explanations for every answer.
- **Answer review** filtered by all, incorrect, or flagged questions.
- **Progress persistence** across reloads via `localStorage`, with a `window.name` fallback for browsers that treat local files as opaque origins. You can resume an in-progress attempt or reopen a completed result.
- **Keyboard support**:
  - `A`–`D` or `1`–`4` — select an answer
  - `←` / `→` — previous / next question
  - `F` — flag the current question
- Responsive layout, dark mode via `prefers-color-scheme`, reduced-motion support, and accessible controls (Lighthouse: 100 accessibility).

## Project structure

```
.
├── index.html          # Screens: start, quiz, results, submit dialog
├── css/
│   └── styles.css      # Design system, layout, dark mode, responsive rules
├── js/
│   ├── questions.js    # Question bank (40 items with answers + explanations)
│   └── app.js          # Quiz engine, timer, scoring, persistence, review
└── README.md
```

## Customising

- **Time limit** — change `QUIZ_SECONDS` at the top of `js/app.js` (currently `35 * 60`).
- **Pass mark** — change `PASS_PERCENT` in `js/app.js` (currently `70`).
- **Questions** — edit `js/questions.js`. Each item needs:

  ```js
  {
    id: "unique-id",
    category: "HTML" | "CSS" | "Flexbox" | "Grid",
    question: "Question text, with `inline code` allowed",
    options: ["A", "B", "C", "D"],
    answer: 1, // zero-based index of the correct option
    explanation: "Why the answer is correct."
  }
  ```

  Category counts and the start-screen topic list update automatically.

> Note: the 35-minute limit and 40-question count are also shown as static copy on the start screen and footer. Update those labels if you change the configuration.
