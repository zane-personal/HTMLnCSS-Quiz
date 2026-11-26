/* ============================================================
   Markup Lab — quiz engine
   ============================================================ */
(() => {
  "use strict";

  const QUIZ_SECONDS = 35 * 60;
  const PASS_PERCENT = 70;
  const STORAGE_KEY = "markup-lab-quiz-v1";
  const STORAGE_PREFIX = "markup-lab-quiz:";
  const STATE_VERSION = 1;
  const TOTAL = QUESTIONS.length;

  const CATEGORY_ORDER = ["HTML", "CSS", "Flexbox", "Grid"];

  const CATEGORY_META = {
    HTML: {
      name: "HTML & semantics",
      blurb: "Structure, forms and accessibility",
      icon: '<path d="m8 6-5 6 5 6M16 6l5 6-5 6"/>',
    },
    CSS: {
      name: "CSS fundamentals",
      blurb: "Cascade, box model and units",
      icon: '<path d="M10 3 8 21M16 3l-2 18M4 8h16M3 16h16"/>',
    },
    Flexbox: {
      name: "Flexbox",
      blurb: "Rows, columns and alignment",
      icon: '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
    },
    Grid: {
      name: "Grid",
      blurb: "Columns, rows and spacing",
      icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    },
  };

  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    screens: $$(".screen"),
    timer: $("#timer"),
    timerText: $("#timer-text"),
    start: $("#screen-start"),
    quiz: $("#screen-quiz"),
    result: $("#screen-result"),
    topicList: $("#topic-list"),
    resumeCard: $("#resume-card"),
    resumeText: $("#resume-text"),
    btnStart: $("#btn-start"),
    btnResume: $("#btn-resume"),
    btnDiscard: $("#btn-discard"),
    qCategory: $("#q-category"),
    qCount: $("#q-count"),
    qText: $("#quiz-title"),
    options: $("#options"),
    flag: $("#btn-flag"),
    flagLabel: $("#flag-label"),
    progressFill: $("#progress-fill"),
    answeredLabel: $("#answered-label"),
    progressPercent: $("#progress-percent"),
    btnPrev: $("#btn-prev"),
    btnNext: $("#btn-next"),
    nextLabel: $("#next-label"),
    palette: $("#palette"),
    paletteAnswered: $("#palette-answered"),
    btnSubmit: $("#btn-submit"),
    autosave: $("#autosave"),
    submitDialog: $("#submit-dialog"),
    dialogBody: $("#dialog-body"),
    scoreRing: $("#score-ring"),
    scorePercent: $("#score-percent"),
    scoreFraction: $("#score-fraction"),
    resultEyebrow: $("#result-eyebrow"),
    resultTitle: $("#result-title"),
    resultSummary: $("#result-summary"),
    statCorrect: $("#stat-correct"),
    statIncorrect: $("#stat-incorrect"),
    statUnanswered: $("#stat-unanswered"),
    statTime: $("#stat-time"),
    breakdown: $("#breakdown"),
    reviewList: $("#review-list"),
    filterTabs: $$(".filter-tabs button"),
    btnRetake: $("#btn-retake"),
    btnReview: $("#btn-review"),
    live: $("#live-region"),
  };

  let state = null;
  let timerId = null;
  let resumeTickerId = null;
  let warningStage = 0;
  let reviewFilter = "all";
  let lastResults = null;

  /* ---------------- Utilities ---------------- */

  function formatText(text) {
    const escaped = String(text).replace(/[&<>"']/g, (ch) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
    return escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatClock(totalSeconds) {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function announce(message) {
    els.live.textContent = message;
  }

  function currentQid() {
    return state.order[state.index];
  }

  function countAnswered() {
    return state.order.filter((id) => state.answers[id] !== undefined).length;
  }

  function flashSaved() {
    els.autosave.classList.remove("is-flashing");
    void els.autosave.offsetWidth;
    els.autosave.classList.add("is-flashing");
  }

  /* ---------------- Storage ---------------- */

  function loadState() {
    const candidates = [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) candidates.push(parsed);
      }
    } catch {
      /* Ignore unavailable storage. */
    }

    // Some browsers treat file:// documents as opaque origins, so localStorage
    // is wiped on reload. window.name survives a reload in the same tab, which
    // keeps the resume and results features working for a local file too.
    try {
      const raw = window.name;
      if (typeof raw === "string" && raw.startsWith(STORAGE_PREFIX)) {
        const parsed = JSON.parse(raw.slice(STORAGE_PREFIX.length));
        if (parsed) candidates.push(parsed);
      }
    } catch {
      /* Ignore malformed window.name. */
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => (Number(b && b.savedAt) || 0) - (Number(a && a.savedAt) || 0));
    return candidates[0];
  }

  function saveState() {
    if (!state) return;
    state.savedAt = Date.now();
    const raw = JSON.stringify(state);

    try {
      localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      /* Storage can fail in private mode — the quiz still works in memory. */
    }

    try {
      window.name = STORAGE_PREFIX + raw;
    } catch {
      /* Ignore. */
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Ignore. */
    }

    try {
      if (window.name.startsWith(STORAGE_PREFIX)) window.name = "";
    } catch {
      /* Ignore. */
    }
  }

  function isValidState(candidate) {
    return Boolean(
      candidate &&
        candidate.version === STATE_VERSION &&
        Array.isArray(candidate.order) &&
        candidate.order.length === TOTAL &&
        candidate.order.every((id) => byId.has(id)) &&
        candidate.optionOrder &&
        typeof candidate.deadline === "number" &&
        typeof candidate.startedAt === "number"
    );
  }

  /* ---------------- Screens ---------------- */

  function showScreen(name) {
    els.screens.forEach((screen) => {
      screen.hidden = screen.id !== `screen-${name}`;
    });
    els.timer.hidden = name !== "quiz";
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------------- Start screen ---------------- */

  function renderTopics() {
    els.topicList.innerHTML = CATEGORY_ORDER.map((category) => {
      const meta = CATEGORY_META[category];
      const count = QUESTIONS.filter((q) => q.category === category).length;
      return `
        <li class="topic-item">
          <span class="topic-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${meta.icon}</svg>
          </span>
          <span class="topic-copy">
            <strong>${meta.name}</strong>
            <span>${meta.blurb}</span>
          </span>
          <span class="topic-count">${count}</span>
        </li>`;
    }).join("");
  }

  function showResume(saved) {
    els.resumeCard.hidden = false;
    els.btnStart.hidden = true;
    refreshResume();
    startResumeTicker();
  }

  function hideResume() {
    stopResumeTicker();
    els.resumeCard.hidden = true;
    els.btnStart.hidden = false;
  }

  function refreshResume() {
    if (!state) return;
    const remaining = state.deadline - Date.now();

    if (remaining <= 0) {
      finalizeExpiredAttempt();
      return;
    }

    const answered = state.order.filter((id) => state.answers[id] !== undefined).length;
    els.resumeText.innerHTML = `You have <strong>${formatClock(remaining / 1000)}</strong> left and <strong>${answered} of ${TOTAL}</strong> questions answered.`;
  }

  function finalizeExpiredAttempt() {
    if (!state) return;
    state.submitted = true;
    state.timedOut = true;
    state.finishedAt = state.deadline;
    stopResumeTicker();
    saveState();
    renderResults();
    showScreen("result");
    els.resultTitle.focus({ preventScroll: true });
    announce("Time is up. Your saved attempt has been submitted.");
  }

  function startResumeTicker() {
    stopResumeTicker();
    resumeTickerId = window.setInterval(refreshResume, 1000);
  }

  function stopResumeTicker() {
    if (resumeTickerId !== null) {
      window.clearInterval(resumeTickerId);
      resumeTickerId = null;
    }
  }

  /* ---------------- Quiz flow ---------------- */

  function startNewQuiz() {
    const order = shuffle(QUESTIONS.map((q) => q.id));
    const optionOrder = {};
    order.forEach((id) => {
      const question = byId.get(id);
      optionOrder[id] = shuffle(question.options.map((_, index) => index));
    });

    const now = Date.now();
    state = {
      version: STATE_VERSION,
      order,
      optionOrder,
      answers: {},
      flags: [],
      index: 0,
      startedAt: now,
      deadline: now + QUIZ_SECONDS * 1000,
      submitted: false,
      finishedAt: null,
      timedOut: false,
    };

    saveState();
    hideResume();
    showScreen("quiz");
    renderQuiz({ focus: true });
    startTimer();
  }

  function resumeQuiz() {
    if (!state) return;
    stopResumeTicker();
    showScreen("quiz");
    renderQuiz({ focus: true });
    startTimer();
  }

  function renderQuiz({ focus = false } = {}) {
    if (!state) return;
    renderQuestion({ focus });
    renderProgress();
    renderPalette();
    syncFlag();
  }

  function renderQuestion({ focus = false } = {}) {
    const qid = currentQid();
    const question = byId.get(qid);
    const chosen = state.answers[qid];
    const order = state.optionOrder[qid];

    els.qCategory.textContent = question.category;
    els.qCount.textContent = `Question ${state.index + 1} of ${TOTAL}`;
    els.qText.innerHTML = formatText(question.question);

    els.options.innerHTML = order
      .map((originalIndex, displayIndex) => {
        const letter = String.fromCharCode(65 + displayIndex);
        const selected = chosen === originalIndex;
        return `
          <label class="option${selected ? " is-selected" : ""}">
            <input type="radio" name="answer" value="${originalIndex}"${selected ? " checked" : ""} />
            <span class="option-letter" aria-hidden="true">${letter}</span>
            <span class="option-text">${formatText(question.options[originalIndex])}</span>
          </label>`;
      })
      .join("");

    if (focus) {
      els.qText.focus({ preventScroll: true });
    }
  }

  function renderProgress() {
    const answered = countAnswered();
    const percent = Math.round((answered / TOTAL) * 100);
    els.progressFill.style.width = `${percent}%`;
    els.answeredLabel.textContent = `${answered} of ${TOTAL} answered`;
    els.progressPercent.textContent = `${percent}%`;
    els.paletteAnswered.textContent = `${answered}/${TOTAL}`;
  }

  function renderPalette() {
    els.palette.innerHTML = state.order
      .map((qid, index) => {
        const answered = state.answers[qid] !== undefined;
        const flagged = state.flags.includes(qid);
        const current = index === state.index;
        const classes = ["palette-btn"];
        if (answered) classes.push("is-answered");
        if (flagged) classes.push("is-flagged");
        if (current) classes.push("is-current");

        const label = [
          `Question ${index + 1}`,
          answered ? "answered" : "unanswered",
          flagged ? "flagged" : "",
          current ? "current" : "",
        ]
          .filter(Boolean)
          .join(", ");

        return `<button type="button" class="${classes.join(" ")}" data-index="${index}" aria-label="${label}"${current ? ' aria-current="true"' : ""}>${index + 1}</button>`;
      })
      .join("");

    els.btnPrev.disabled = state.index === 0;
    const onLastQuestion = state.index === state.order.length - 1;
    els.nextLabel.textContent = onLastQuestion ? "Submit quiz" : "Next";
    els.btnNext.setAttribute("aria-label", onLastQuestion ? "Submit quiz" : "Next question");
  }

  function syncFlag() {
    const flagged = state.flags.includes(currentQid());
    els.flag.classList.toggle("is-active", flagged);
    els.flag.setAttribute("aria-pressed", String(flagged));
    els.flagLabel.textContent = flagged ? "Flagged" : "Flag";
  }

  function goTo(index, { focus = true } = {}) {
    if (!state || index < 0 || index >= state.order.length || index === state.index) return;
    state.index = index;
    saveState();
    renderQuiz({ focus });
  }

  function toggleFlag() {
    if (!state) return;
    const qid = currentQid();
    const position = state.flags.indexOf(qid);
    if (position >= 0) {
      state.flags.splice(position, 1);
    } else {
      state.flags.push(qid);
    }
    saveState();
    syncFlag();
    renderPalette();
  }

  function chooseByDisplayIndex(displayIndex) {
    const qid = currentQid();
    const originalIndex = state.optionOrder[qid][displayIndex];
    if (originalIndex === undefined) return;
    const input = els.options.querySelector(`input[value="${originalIndex}"]`);
    if (!input) return;
    if (!input.checked) {
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /* ---------------- Timer ---------------- */

  function startTimer() {
    stopTimer();
    warningStage = 0;
    renderTimer(state.deadline - Date.now());

    timerId = window.setInterval(() => {
      if (!state || state.submitted) {
        stopTimer();
        return;
      }
      const remaining = state.deadline - Date.now();
      renderTimer(remaining);
      if (remaining <= 0) {
        stopTimer();
        submitQuiz({ timedOut: true });
      }
    }, 250);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function renderTimer(remainingMs) {
    const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
    els.timerText.textContent = formatClock(seconds);

    const danger = seconds <= 60;
    const warning = !danger && seconds <= 300;
    els.timer.classList.toggle("is-warning", warning);
    els.timer.classList.toggle("is-danger", danger);
    els.timer.setAttribute("aria-label", `Time remaining ${formatClock(seconds)}`);

    const stage = seconds <= 60 ? 3 : seconds <= 300 ? 2 : seconds <= 600 ? 1 : 0;
    if (stage > warningStage) {
      warningStage = stage;
      announce(stage === 3 ? "One minute remaining." : stage === 2 ? "Five minutes remaining." : "Ten minutes remaining.");
    }
  }

  /* ---------------- Submitting ---------------- */

  function openSubmitDialog() {
    if (!state || state.submitted) return;
    const unanswered = TOTAL - countAnswered();
    els.dialogBody.innerHTML =
      unanswered === 0
        ? `All <strong>${TOTAL}</strong> questions are answered. You can submit now or keep reviewing your flags.`
        : `<strong>${unanswered}</strong> question${unanswered === 1 ? " is" : "s are"} still unanswered. Unanswered questions are marked incorrect, but you can keep working.`;
    els.submitDialog.showModal();
  }

  function submitQuiz({ timedOut = false } = {}) {
    if (!state || state.submitted) return;
    state.submitted = true;
    state.timedOut = timedOut;
    state.finishedAt = Date.now();
    stopTimer();
    stopResumeTicker();
    saveState();

    if (els.submitDialog.open) {
      els.submitDialog.close("submitted");
    }

    renderResults();
    showScreen("result");
    els.resultTitle.focus({ preventScroll: true });
    announce(timedOut ? "Time is up. Your quiz has been submitted." : "Quiz submitted. Your results are ready.");
  }

  /* ---------------- Results ---------------- */

  function computeResults() {
    const rows = state.order.map((qid, index) => {
      const question = byId.get(qid);
      const chosen = state.answers[qid];
      const answered = chosen !== undefined;
      return {
        qid,
        index,
        question,
        chosen: answered ? chosen : null,
        answered,
        correct: answered && chosen === question.answer,
      };
    });

    const correct = rows.filter((row) => row.correct).length;
    const unanswered = rows.filter((row) => !row.answered).length;
    const incorrect = TOTAL - correct - unanswered;
    const percent = Math.round((correct / TOTAL) * 100);
    const timeUsed = Math.max(
      0,
      Math.min(QUIZ_SECONDS, Math.round(((state.finishedAt || Date.now()) - state.startedAt) / 1000))
    );

    const categories = CATEGORY_ORDER.map((category) => {
      const items = rows.filter((row) => row.question.category === category);
      return {
        category,
        total: items.length,
        correct: items.filter((row) => row.correct).length,
      };
    });

    return { rows, correct, incorrect, unanswered, percent, timeUsed, categories };
  }

  function renderResults() {
    lastResults = computeResults();
    const { rows, correct, incorrect, unanswered, percent, timeUsed, categories } = lastResults;
    const passed = percent >= PASS_PERCENT;

    els.scoreRing.style.setProperty("--p", String(percent));
    els.scoreRing.classList.toggle("is-pass", passed);
    els.scoreRing.setAttribute("aria-label", `Score ${percent}%, ${correct} / ${TOTAL} correct`);
    els.scorePercent.textContent = `${percent}%`;
    els.scoreFraction.textContent = `${correct} / ${TOTAL} correct`;

    els.resultEyebrow.textContent = state.timedOut ? "Time's up · auto-submitted" : "Quiz complete";
    els.resultTitle.textContent =
      percent >= 90 ? "Outstanding." : percent >= PASS_PERCENT ? "You passed." : percent >= 50 ? "Almost there." : "Keep building.";

    let summary = "";
    if (state.timedOut) {
      summary += "The timer reached 00:00, so your answers were submitted automatically. ";
    }
    if (percent >= 90) {
      summary += "Your grasp of semantics and modern layout is excellent — scan the review for the last few details.";
    } else if (percent >= PASS_PERCENT) {
      summary += "You cleared the 70% pass mark with solid fundamentals. The topic breakdown shows where to sharpen up next.";
    } else if (percent >= 50) {
      summary += "You are close to the pass mark. The explanations below cover every missed concept — worth a read before retrying.";
    } else {
      summary += "Keep practising. Work through the explanations below, then take another run at it — the timer starts fresh.";
    }
    els.resultSummary.textContent = summary;

    els.statCorrect.textContent = String(correct);
    els.statIncorrect.textContent = String(incorrect);
    els.statUnanswered.textContent = String(unanswered);
    els.statTime.textContent = formatClock(timeUsed);

    els.breakdown.innerHTML = categories
      .map(({ category, total, correct: catCorrect }) => {
        const catPercent = total ? Math.round((catCorrect / total) * 100) : 0;
        return `
          <div class="breakdown-row">
            <div class="breakdown-label">
              <strong>${CATEGORY_META[category].name}</strong>
              <span>${catCorrect} of ${total} correct</span>
            </div>
            <div class="bar" aria-hidden="true"><span style="width:${catPercent}%"></span></div>
            <span class="breakdown-pct">${catPercent}%</span>
          </div>`;
      })
      .join("");

    reviewFilter = "all";
    els.filterTabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.filter === "all")));
    renderReview();
  }

  function displayLetter(qid, originalIndex) {
    const position = state.optionOrder[qid].indexOf(originalIndex);
    return String.fromCharCode(65 + Math.max(0, position));
  }

  function renderReview() {
    if (!lastResults) return;
    const { rows } = lastResults;

    const visible = rows.filter((row) => {
      if (reviewFilter === "incorrect") return !row.correct;
      if (reviewFilter === "flagged") return state.flags.includes(row.qid);
      return true;
    });

    if (visible.length === 0) {
      const message =
        reviewFilter === "incorrect"
          ? "No incorrect answers — a clean sweep."
          : reviewFilter === "flagged"
            ? "You did not flag any questions."
            : "There is nothing to review.";
      els.reviewList.innerHTML = `<p class="review-empty">${message}</p>`;
      return;
    }

    els.reviewList.innerHTML = visible
      .map((row) => {
        const { question, qid, chosen, answered, correct } = row;
        const status = correct ? "Correct" : answered ? "Incorrect" : "Not answered";
        const stateClass = correct ? "is-correct" : answered ? "is-incorrect" : "is-unanswered";
        const yourAnswer = answered
          ? `${displayLetter(qid, chosen)}. ${formatText(question.options[chosen])}`
          : "Not answered";
        const correctAnswer = `${displayLetter(qid, question.answer)}. ${formatText(question.options[question.answer])}`;

        return `
          <article class="review-item ${stateClass}">
            <div class="review-top">
              <span class="review-num">${String(row.index + 1).padStart(2, "0")}</span>
              <span class="pill">${question.category}</span>
              <span class="review-status">${status}</span>
            </div>
            <h3>${formatText(question.question)}</h3>
            <p class="review-answer"><span class="review-label">Your answer</span>${yourAnswer}</p>
            ${
              correct
                ? ""
                : `<p class="review-answer is-correct-answer"><span class="review-label">Correct answer</span>${correctAnswer}</p>`
            }
            <p class="review-explanation">${formatText(question.explanation)}</p>
          </article>`;
      })
      .join("");
  }

  /* ---------------- Events ---------------- */

  function attachEvents() {
    els.btnStart.addEventListener("click", startNewQuiz);
    els.btnResume.addEventListener("click", resumeQuiz);
    els.btnDiscard.addEventListener("click", () => {
      clearState();
      state = null;
      hideResume();
      startNewQuiz();
    });

    els.btnPrev.addEventListener("click", () => goTo(state.index - 1));
    els.btnNext.addEventListener("click", () => {
      if (!state) return;
      if (state.index === state.order.length - 1) {
        openSubmitDialog();
      } else {
        goTo(state.index + 1);
      }
    });
    els.flag.addEventListener("click", toggleFlag);
    els.btnSubmit.addEventListener("click", openSubmitDialog);

    els.palette.addEventListener("click", (event) => {
      const button = event.target.closest(".palette-btn");
      if (!button) return;
      goTo(Number(button.dataset.index));
    });

    els.options.addEventListener("change", (event) => {
      const input = event.target.closest('input[type="radio"]');
      if (!input || !state || state.submitted) return;
      state.answers[currentQid()] = Number(input.value);
      saveState();
      $$(".option", els.options).forEach((label) => {
        const radio = $("input", label);
        label.classList.toggle("is-selected", Boolean(radio && radio.checked));
      });
      renderProgress();
      renderPalette();
      flashSaved();
    });

    const submitForm = els.submitDialog.querySelector("form");
    submitForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const action = event.submitter ? event.submitter.value : "cancel";
      els.submitDialog.close(action);
      if (action === "confirm") {
        submitQuiz();
      }
    });

    els.submitDialog.addEventListener("click", (event) => {
      if (event.target === els.submitDialog) {
        els.submitDialog.close("cancel");
      }
    });

    els.filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        reviewFilter = tab.dataset.filter;
        els.filterTabs.forEach((item) => item.setAttribute("aria-pressed", String(item === tab)));
        renderReview();
      });
    });

    els.btnReview.addEventListener("click", () => {
      $("#review").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    els.btnRetake.addEventListener("click", () => {
      clearState();
      state = null;
      lastResults = null;
      startNewQuiz();
    });

    document.addEventListener("keydown", (event) => {
      if (!state || state.submitted || els.quiz.hidden) return;
      if (els.submitDialog.open) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target;
      if (target.matches('input[type="radio"]') && event.key.startsWith("Arrow")) {
        return; // Let native radio-group arrow navigation work.
      }

      const key = event.key.toLowerCase();
      const letterIndex = ["a", "b", "c", "d"].indexOf(key);
      const numberIndex = ["1", "2", "3", "4"].indexOf(key);

      if (letterIndex >= 0) {
        event.preventDefault();
        chooseByDisplayIndex(letterIndex);
      } else if (numberIndex >= 0) {
        event.preventDefault();
        chooseByDisplayIndex(numberIndex);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(state.index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(state.index - 1);
      } else if (key === "f") {
        event.preventDefault();
        toggleFlag();
      }
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    renderTopics();
    attachEvents();
    els.resultTitle.setAttribute("tabindex", "-1");

    const saved = loadState();

    if (saved && isValidState(saved)) {
      state = saved;

      if (saved.submitted) {
        renderResults();
        showScreen("result");
        els.resultTitle.focus({ preventScroll: true });
        return;
      }

      if (saved.deadline > Date.now()) {
        showResume(saved);
        showScreen("start");
        return;
      }

      // The attempt ran out while the page was closed: finalize it instead of
      // throwing the answers away, so the user still sees their result.
      finalizeExpiredAttempt();
      return;
    } else if (saved) {
      clearState();
    }

    showScreen("start");
  }

  init();
})();
