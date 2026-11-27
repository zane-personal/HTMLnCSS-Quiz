# Markup Lab — TODO

## Current status

- Lesson 2 has **16 challenges**: 7 Flexbox and 9 Grid.
- Every solution passes its checks at **1004px**, **1366px** and **390px** widths.
- Starter CSS fails as intended, so each challenge has real work to do.
- The site has a shared three-tab bar: **Quiz**, **Layout Lab**, and **Kids Coding Guide**.
- Lighthouse on the lesson and guide pages: **100 Accessibility · 100 Best Practices · 100 SEO**.
- No console errors, no page-level horizontal overflow.

## Completed

- [x] Add the **Kids Coding Guide (Age 6)** page with core approach, three steps, references and a four-week plan.
- [x] Add the shared site-tab bar to the quiz, layout lab and guide, with `aria-current` state.
- [x] Add the guide to the quiz start screen, results screen and lesson finish panel.
- [x] Add challenges 7–16:
  - [x] Wrap the gallery — `flex-wrap` + `flex: 1 1 90px`
  - [x] Pin the footer — column flex + `margin-top: auto`
  - [x] Reverse the order — `row-reverse` / `order`
  - [x] Split the nav — `margin-left: auto` / `space-between`
  - [x] Auto-fit gallery — `repeat(auto-fit, minmax(90px, 1fr))`
  - [x] Grid center — `place-items: center` + percentage sizing
  - [x] Name the areas — `grid-template-areas`
  - [x] Tall feature — `grid-row: span 2`
  - [x] Clamp the sidebar — `minmax(80px, 40%)`
  - [x] Build the dashboard — explicit grid-line placement
- [x] Add hints, starters, solutions and geometry-based checks for every new challenge.
- [x] Wrap the challenge chips so all 16 are visible.
- [x] Compact the chips to numbered circles on phones.
- [x] Give mobile previews enough height for the wrapped galleries.
- [x] Update the lesson intro, progress labels, finish panel, footer and README.
- [x] Fix the challenge-chip accessible names for Lighthouse.
- [x] Remove temporary test pages and stop the local preview server.

## Optional next steps

- [ ] Add a **printable one-page version** of the kids guide.
- [ ] Add a **session timer** or checklist for the four-week plan.
- [ ] Add a **Previous challenge** button beside **Next challenge**.
- [ ] Add a **Copy CSS** button to the editor toolbar.
- [ ] Add a Flexbox / Grid filter for the challenge tabs.
- [ ] Add a per-challenge **Reset this layout** action separate from the editor reset.
- [ ] Add a **shuffle challenges** practice mode.
- [ ] Add a small “concept learned” summary after each completed challenge.

## Maintenance notes

- If you add or remove challenges, update the static counts in:
  - `lesson2.html` — intro copy, initial `0 / 16`, initial “Challenge 1 of 16”, footer.
  - `README.md` — feature summary and challenge list.
- Keep `stageBox()` in `js/lesson2.js` using `clientWidth` / `clientHeight`; using `rect.right` reintroduces false failures when a preview scrolls.
- When adding a site section, add its tab to `index.html`, `lesson2.html` and `kids-guide.html`, and mark the current page with `aria-current="page"`.
- The kids guide footer and hero facts contain static counts (`3 steps`, `5 recommended references`); update them if the content changes.
- Re-test at **1004px**, **1366px** and **390px** after layout changes.
- The lesson and guide work from both `file://` and a local HTTP server.
