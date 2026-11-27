# Markup Lab — HTML & CSS Quiz + Layout Lab + Kids Coding Guide

A self-contained 35-minute quiz for intermediate HTML and CSS, with beginner-friendly **Flexbox** and **CSS Grid** rounds — plus **Lesson 2**, a hands-on layout lab where you write the CSS yourself, and a **Kids Coding Guide (Age 6)** for parents and educators.

40 multiple-choice questions · 16 build-it-yourself layouts · play-based coding guide · instant scoring · full answer review · no build step and no dependencies.

## Run it

Open `index.html` in any modern browser.

For the most reliable persistence (and to avoid any `file://` quirks in your browser), serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. The quiz is at `/`, the layout lab is at `/lesson2.html`, and the kids guide is at `/kids-guide.html`.

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

## Lesson 2 — Layout lab

Open `lesson2.html` (or use **Lesson 2 · Layout practice** on the start screen). The lab has sixteen mini layouts:

1. Center the card — `display: flex`, `justify-content`, `align-items`
2. Spread the row — `justify-content: space-between`
3. Sidebar + content — `flex: 0 0 120px` and `flex: 1`
4. Three equal columns — `repeat(3, 1fr)` and `gap`
5. Feature + two — `grid-column: span 2`
6. Page shell — spanning header/footer with a nav + main row
7. Wrap the gallery — `flex-wrap: wrap` and `flex: 1 1 90px`
8. Pin the footer — column flex with `margin-top: auto`
9. Reverse the order — `row-reverse` or `order`
10. Split the nav — `margin-left: auto` or `space-between`
11. Auto-fit gallery — `repeat(auto-fit, minmax(90px, 1fr))`
12. Grid center — `place-items: center` plus percentage sizing
13. Name the areas — `grid-template-areas`
14. Tall feature — `grid-row: span 2`
15. Clamp the sidebar — `minmax(80px, 40%)`
16. Build the dashboard — explicit grid-line placement

Each challenge shows a target preview and a live preview of your own CSS. Type in the editor, then **Check layout** to run geometry-based checks against the target. Hints, a revealable solution, reset, progress tracking and per-challenge drafts are included. `Ctrl`/`⌘` + `Enter` runs the checks; `Tab` inserts two spaces in the editor.

## Kids Coding Guide (Age 6)

Open `kids-guide.html` (or use **Kids Coding Guide** in the site tabs). A play-first guide for introducing a six-year-old to computers and coding:

- **Core approach** — play-based learning, visual logic, and creating interactive stories instead of typing syntax.
- **Step 1: Basic computer familiarity** — mouse and trackpad skills, keyboard basics, and healthy screen-time habits.
- **Step 2: Unplugged coding logic** — sequence and debugging through “human robot” games, loops with physical actions, and if–then conditions.
- **Step 3: Block-based coding** — snapping visual blocks together, building stories and mini-games, and solving problems collaboratively.
- **Recommended references** — ScratchJr, Code.org Course A / Pre-reader Express, Lightbot, Hello Ruby, and CS Unplugged.
- **A four-week starting plan** — one gentle theme per week.

The guide is static HTML and CSS, with no JavaScript required. Every page shares the same site-tab bar and design tokens.

## Project structure

```
.
├── index.html          # Quiz: start, quiz, results, submit dialog
├── lesson2.html        # Lesson 2: layout lab
├── kids-guide.html     # Kids Coding Guide (Age 6)
├── css/
│   ├── styles.css      # Design system, site tabs, layout, dark mode, responsive rules
│   ├── lesson2.css     # Layout lab screens, previews and editor
│   └── kids-guide.css  # Guide sections, cards, references and responsive rules
├── js/
│   ├── questions.js    # Question bank (40 items with answers + explanations)
│   ├── app.js          # Quiz engine, timer, scoring, persistence, review
│   └── lesson2.js      # Layout challenges, live preview and checks
├── todo.md             # Current status, completed work and next ideas
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
