/* ============================================================
   Markup Lab — Lesson 2 · Layout lab
   Sixteen mini layouts, a live preview and geometry-based checks.
   ============================================================ */
(() => {
  "use strict";

  const STORAGE_KEY = "markup-lab-lesson2-v1";
  const STORAGE_PREFIX = "markup-lab-lesson2:";
  const STORE_VERSION = 1;

  const CHECK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  const COMMON_CSS = `
    :root { color-scheme: light; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      padding: 14px;
      background: #ffffff;
      color: #16141f;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .stage {
      height: 100%;
      padding: 14px;
      background: #f5f4fb;
      border: 1px solid #e7e3f3;
      border-radius: 12px;
      overflow: auto;
    }
    .card, .sidebar, .main, .header, .nav, .footer, .tile, .body, .aside {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border: 1px solid #d7d2e8;
      border-radius: 8px;
      background: #ffffff;
      color: #4536e8;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.2;
      text-align: center;
    }
  `;

  /* ---------------- Challenges ---------------- */

  const CHALLENGES = [
    {
      id: "center-card",
      topic: "Flexbox",
      title: "Center the card",
      short: "Center card",
      goal: "Make the card sit dead center of the stage — horizontally and vertically.",
      hints: [
        "Start by making `.stage` a flex container.",
        "`justify-content` controls the horizontal axis in a row.",
        "`align-items` controls the vertical axis.",
      ],
      html: '<div class="stage"><div class="card">Hello!</div></div>',
      baseCss: ".card { width: 110px; height: 70px; }",
      starter: ".stage {\n  display: flex;\n}\n",
      solution:
        ".stage {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n",
      checks: [
        {
          label: "The stage is a flex container",
          test: ({ style }) => style(".stage").display === "flex",
        },
        {
          label: "The card is centered horizontally",
          test: ({ rect, box }) => centered(rect(".card"), box, "x"),
        },
        {
          label: "The card is centered vertically",
          test: ({ rect, box }) => centered(rect(".card"), box, "y"),
        },
      ],
    },
    {
      id: "spread-row",
      topic: "Flexbox",
      title: "Spread the row",
      short: "Spread row",
      goal:
        "Put the three cards in one row. The first should touch the left edge, the last the right edge, with even space between them.",
      hints: [
        "Use `display: flex` on `.stage` to get one row.",
        "`justify-content: space-between` pushes the outer cards to the edges.",
        "`align-items: center` keeps the cards vertically centered.",
      ],
      html:
        '<div class="stage"><div class="card">1</div><div class="card">2</div><div class="card">3</div></div>',
      baseCss: ".card { width: 52px; height: 54px; }",
      starter: ".stage {\n  display: flex;\n}\n",
      solution:
        ".stage {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n",
      checks: [
        {
          label: "The stage is a flex container",
          test: ({ style }) => style(".stage").display === "flex",
        },
        {
          label: "All three cards share one row",
          test: ({ rects }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              Math.max(...cards.map((r) => r.top)) -
                Math.min(...cards.map((r) => r.top)) <=
                2
            );
          },
        },
        {
          label: "The first card touches the left edge",
          test: ({ rects, box }) => {
            const cards = rects(".card");
            return cards.length === 3 && near(cards[0].left, box.left);
          },
        },
        {
          label: "The last card touches the right edge",
          test: ({ rects, box }) => {
            const cards = rects(".card");
            return cards.length === 3 && near(cards[2].right, box.right);
          },
        },
        {
          label: "The gaps between the cards are even",
          test: ({ rects }) => {
            const cards = rects(".card");
            if (cards.length !== 3) return false;
            const gapA = cards[1].left - cards[0].right;
            const gapB = cards[2].left - cards[1].right;
            return gapA > 4 && near(gapA, gapB);
          },
        },
      ],
    },
    {
      id: "sidebar-main",
      topic: "Flexbox",
      title: "Sidebar + content",
      short: "Sidebar",
      goal:
        "Place the sidebar and main area side by side. The sidebar stays 120px wide, the main area fills the rest, and there is a 12px gap.",
      hints: [
        "Make `.stage` a flex row and add `gap: 12px`.",
        "Stop the sidebar from growing or shrinking with `flex: 0 0 120px`.",
        "Let the main area take the rest with `flex: 1`.",
      ],
      html:
        '<div class="stage"><aside class="sidebar">Sidebar</aside><main class="main">Main content</main></div>',
      baseCss: ".sidebar, .main { min-height: 120px; }",
      starter:
        ".stage {\n  display: flex;\n}\n\n.sidebar {\n  /* fixed width */\n}\n\n.main {\n  /* fill the rest */\n}\n",
      solution:
        ".stage {\n  display: flex;\n  gap: 12px;\n}\n\n.sidebar {\n  flex: 0 0 120px;\n}\n\n.main {\n  flex: 1;\n}\n",
      checks: [
        {
          label: "The stage is a flex container",
          test: ({ style }) => style(".stage").display === "flex",
        },
        {
          label: "The sidebar is 120px wide",
          test: ({ rect }) => {
            const sidebar = rect(".sidebar");
            return !!sidebar && near(sidebar.width, 120);
          },
        },
        {
          label: "The two areas sit on the same row",
          test: ({ rect }) => {
            const sidebar = rect(".sidebar");
            const main = rect(".main");
            return !!sidebar && !!main && near(sidebar.top, main.top);
          },
        },
        {
          label: "The sidebar starts at the left edge",
          test: ({ rect, box }) => {
            const sidebar = rect(".sidebar");
            return !!sidebar && near(sidebar.left, box.left);
          },
        },
        {
          label: "The main area reaches the right edge",
          test: ({ rect, box }) => {
            const main = rect(".main");
            return !!main && near(main.right, box.right);
          },
        },
        {
          label: "There is a 12px gap between them",
          test: ({ rect }) => {
            const sidebar = rect(".sidebar");
            const main = rect(".main");
            return !!sidebar && !!main && near(main.left - sidebar.right, 12);
          },
        },
      ],
    },
    {
      id: "three-columns",
      topic: "Grid",
      title: "Three equal columns",
      short: "3 columns",
      goal:
        "Turn the stage into a grid with three equal-width columns and a 12px gap between them.",
      hints: [
        "Start with `display: grid` on `.stage`.",
        "`grid-template-columns: repeat(3, 1fr)` makes three equal tracks.",
        "`gap: 12px` spaces both rows and columns.",
      ],
      html:
        '<div class="stage"><div class="card">One</div><div class="card">Two</div><div class="card">Three</div></div>',
      baseCss: ".card { min-height: 70px; }",
      starter: ".stage {\n  display: grid;\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "All three cards share one row",
          test: ({ rects }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              Math.max(...cards.map((r) => r.top)) -
                Math.min(...cards.map((r) => r.top)) <=
                2
            );
          },
        },
        {
          label: "The three columns are equal width",
          test: ({ rects }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              near(cards[0].width, cards[1].width) &&
              near(cards[1].width, cards[2].width)
            );
          },
        },
        {
          label: "There is a 12px gap between the columns",
          test: ({ rects }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              near(cards[1].left - cards[0].right, 12) &&
              near(cards[2].left - cards[1].right, 12)
            );
          },
        },
        {
          label: "The grid fills the stage edge to edge",
          test: ({ rects, box }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              near(cards[0].left, box.left) &&
              near(cards[2].right, box.right)
            );
          },
        },
      ],
    },
    {
      id: "feature-two",
      topic: "Grid",
      title: "Feature + two",
      short: "Feature + two",
      goal:
        "Use a two-column grid. The feature card spans both columns, with two cards side by side underneath it.",
      hints: [
        "The stage is already a two-column grid with a 12px gap.",
        "Make the feature card span both columns with `grid-column: span 2`.",
        "The remaining two cards will drop into the next row automatically.",
      ],
      html:
        '<div class="stage"><div class="card feature">Feature</div><div class="card">A</div><div class="card">B</div></div>',
      baseCss: ".card { min-height: 54px; }",
      starter:
        ".stage {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n\n.feature {\n  /* span both columns */\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n\n.feature {\n  grid-column: span 2;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The feature card spans the full width",
          test: ({ rect, box }) => {
            const feature = rect(".feature");
            return (
              !!feature &&
              near(feature.left, box.left) &&
              near(feature.right, box.right)
            );
          },
        },
        {
          label: "The two lower cards are equal width",
          test: ({ rects }) => {
            const cards = rects(".card:not(.feature)");
            return cards.length === 2 && near(cards[0].width, cards[1].width);
          },
        },
        {
          label: "The two lower cards sit below the feature",
          test: ({ rect, rects }) => {
            const feature = rect(".feature");
            const cards = rects(".card:not(.feature)");
            return (
              !!feature &&
              cards.length === 2 &&
              cards.every((r) => r.top >= feature.bottom - 1)
            );
          },
        },
        {
          label: "The lower cards fill the row edge to edge",
          test: ({ rects, box }) => {
            const cards = rects(".card:not(.feature)");
            return (
              cards.length === 2 &&
              near(cards[0].left, box.left) &&
              near(cards[1].right, box.right)
            );
          },
        },
      ],
    },
    {
      id: "page-shell",
      topic: "Grid",
      title: "Build the page shell",
      short: "Page shell",
      goal:
        "Create a page shell: a full-width header, a 110px nav beside the main area, and a full-width footer.",
      hints: [
        "The grid columns, rows and gap are already set for you.",
        "Span the header across both columns with `grid-column: 1 / -1`.",
        "Do the same for the footer — nav and main fill the middle row automatically.",
      ],
      html:
        '<div class="stage"><header class="header">Header</header><nav class="nav">Nav</nav><main class="main">Main</main><footer class="footer">Footer</footer></div>',
      baseCss:
        ".header, .nav, .footer { min-height: 38px; }\n.main { min-height: 56px; }",
      starter:
        ".stage {\n  display: grid;\n  grid-template-columns: 110px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 10px;\n}\n\n.header {\n  /* span both columns */\n}\n\n.footer {\n  /* span both columns */\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: 110px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 10px;\n}\n\n.header {\n  grid-column: 1 / -1;\n}\n\n.footer {\n  grid-column: 1 / -1;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The header spans the full width",
          test: ({ rect, box }) => {
            const header = rect(".header");
            return (
              !!header &&
              near(header.left, box.left) &&
              near(header.right, box.right)
            );
          },
        },
        {
          label: "The footer spans the full width",
          test: ({ rect, box }) => {
            const footer = rect(".footer");
            return (
              !!footer &&
              near(footer.left, box.left) &&
              near(footer.right, box.right)
            );
          },
        },
        {
          label: "The nav column is 110px wide",
          test: ({ rect }) => {
            const nav = rect(".nav");
            return !!nav && near(nav.width, 110);
          },
        },
        {
          label: "The main area sits beside the nav",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            return (
              !!nav &&
              !!main &&
              near(main.top, nav.top) &&
              near(main.left, nav.right + 10)
            );
          },
        },
        {
          label: "The footer sits below the middle row",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            const footer = rect(".footer");
            return (
              !!nav &&
              !!main &&
              !!footer &&
              footer.top >= nav.bottom - 1 &&
              footer.top >= main.bottom - 1
            );
          },
        },
      ],
    },
    {
      id: "wrap-gallery",
      topic: "Flexbox",
      title: "Wrap the gallery",
      short: "Wrap gallery",
      goal:
        "Let the six tiles wrap onto multiple rows. Each row should share the width evenly with a 10px gap, and the rows should sit 10px apart.",
      hints: [
        "`display: flex` keeps everything on one line by default.",
        "`flex-wrap: wrap` lets tiles move onto new rows when they run out of room.",
        "`flex: 1 1 90px` lets each tile grow to fill its row.",
        "`align-content: flex-start` keeps the rows together at the top.",
      ],
      html:
        '<div class="stage"><div class="tile">1</div><div class="tile">2</div><div class="tile">3</div><div class="tile">4</div><div class="tile">5</div><div class="tile">6</div></div>',
      baseCss: ".tile { height: 54px; }",
      starter: ".stage {\n  display: flex;\n}\n",
      solution:
        ".stage {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n  gap: 10px;\n}\n\n.tile {\n  flex: 1 1 90px;\n}\n",
      checks: [
        {
          label: "The stage is a flex container",
          test: ({ style }) => style(".stage").display === "flex",
        },
        {
          label: "The tiles are allowed to wrap",
          test: ({ style }) => style(".stage").flexWrap === "wrap",
        },
        {
          label: "The tiles form more than one row",
          test: ({ rects }) => groupRows(rects(".tile")).length > 1,
        },
        {
          label: "The rows are 10px apart",
          test: ({ rects }) => {
            const rows = groupRows(rects(".tile"));
            return (
              rows.length > 1 &&
              rows.every(
                (row, index) =>
                  index === 0 || near(row.top - rows[index - 1].bottom, 10)
              )
            );
          },
        },
        {
          label: "Tiles in each row are equal width",
          test: ({ rects }) => {
            const rows = groupRows(rects(".tile"));
            return rows.every((row) =>
              row.items.every((item) => near(item.width, row.items[0].width))
            );
          },
        },
        {
          label: "Each row fills the stage with 10px gaps",
          test: ({ rects, box }) => {
            const rows = groupRows(rects(".tile"));
            return rows.every((row) => {
              const first = row.items[0];
              const last = row.items[row.items.length - 1];
              const gaps = row.items
                .slice(1)
                .map((item, index) => item.left - row.items[index].right);
              return (
                near(first.left, box.left) &&
                near(last.right, box.right) &&
                gaps.every((gap) => near(gap, 10))
              );
            });
          },
        },
      ],
    },
    {
      id: "pin-footer",
      topic: "Flexbox",
      title: "Pin the footer",
      short: "Pin footer",
      goal:
        "Stack the header, body and footer vertically. The header stays at the top, the footer is pinned to the bottom, and the body sits in between.",
      hints: [
        "Make `.stage` a flex container and set `flex-direction: column`.",
        "Add `gap: 10px` so the blocks do not touch.",
        "`margin-top: auto` on the footer pushes it to the bottom.",
      ],
      html:
        '<div class="stage"><header class="header">Header</header><div class="body">Body</div><footer class="footer">Footer</footer></div>',
      baseCss: ".header, .body, .footer { min-height: 34px; }",
      starter: ".stage {\n  display: flex;\n}\n",
      solution:
        ".stage {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.footer {\n  margin-top: auto;\n}\n",
      checks: [
        {
          label: "The stage is a column flex container",
          test: ({ style }) =>
            style(".stage").display === "flex" &&
            style(".stage").flexDirection === "column",
        },
        {
          label: "The header sits at the top",
          test: ({ rect, box }) => {
            const header = rect(".header");
            return !!header && near(header.top, box.top);
          },
        },
        {
          label: "The footer is pinned to the bottom",
          test: ({ rect, box }) => {
            const footer = rect(".footer");
            return !!footer && near(footer.bottom, box.bottom);
          },
        },
        {
          label: "The body sits 10px below the header",
          test: ({ rect }) => {
            const header = rect(".header");
            const body = rect(".body");
            return !!header && !!body && near(body.top - header.bottom, 10);
          },
        },
        {
          label: "The footer sits below the body",
          test: ({ rect }) => {
            const body = rect(".body");
            const footer = rect(".footer");
            return !!body && !!footer && footer.top >= body.bottom + 9;
          },
        },
        {
          label: "All three blocks span the full width",
          test: ({ rect, box }) => {
            const blocks = [rect(".header"), rect(".body"), rect(".footer")];
            return blocks.every(
              (block) =>
                block &&
                near(block.left, box.left) &&
                near(block.right, box.right)
            );
          },
        },
      ],
    },
    {
      id: "reverse-order",
      topic: "Flexbox",
      title: "Reverse the order",
      short: "Reverse order",
      goal:
        "Show the cards in the order C, B, A without changing the HTML. Keep them on one row, centered, with a 10px gap.",
      hints: [
        "`flex-direction: row-reverse` flips the visual order of the row.",
        "You can also give each card an `order` value instead.",
        "`justify-content: center` keeps the reversed group centered.",
      ],
      html:
        '<div class="stage"><div class="card a">A</div><div class="card b">B</div><div class="card c">C</div></div>',
      baseCss: ".card { width: 60px; height: 54px; }",
      starter: ".stage {\n  display: flex;\n}\n",
      solution:
        ".stage {\n  display: flex;\n  flex-direction: row-reverse;\n  justify-content: center;\n  gap: 10px;\n}\n",
      checks: [
        {
          label: "The stage is a flex container",
          test: ({ style }) => style(".stage").display === "flex",
        },
        {
          label: "All three cards share one row",
          test: ({ rects }) => {
            const cards = rects(".card");
            return (
              cards.length === 3 &&
              Math.max(...cards.map((card) => card.top)) -
                Math.min(...cards.map((card) => card.top)) <=
                2
            );
          },
        },
        {
          label: "The cards read C, B, A from left to right",
          test: ({ rect }) => {
            const a = rect(".a");
            const b = rect(".b");
            const c = rect(".c");
            return !!a && !!b && !!c && c.left < b.left && b.left < a.left;
          },
        },
        {
          label: "There is a 10px gap between the cards",
          test: ({ rect }) => {
            const a = rect(".a");
            const b = rect(".b");
            const c = rect(".c");
            return (
              !!a &&
              !!b &&
              !!c &&
              near(b.left - c.right, 10) &&
              near(a.left - b.right, 10)
            );
          },
        },
        {
          label: "The group is centered in the stage",
          test: ({ rect, box }) => {
            const a = rect(".a");
            const c = rect(".c");
            return (
              !!a &&
              !!c &&
              near(c.left - box.left, box.right - a.right, 3)
            );
          },
        },
      ],
    },
    {
      id: "split-nav",
      topic: "Flexbox",
      title: "Split the nav",
      short: "Split nav",
      goal:
        "Put the logo on the left and the three links on the right of the bar. The logo and links should share one row, with open space between them.",
      hints: [
        "Make `.bar` a flex container with `align-items: center`.",
        "`margin-left: auto` on `.links` pushes the links to the right.",
        "`justify-content: space-between` is another way to split the two groups.",
      ],
      html:
        '<div class="stage"><div class="bar"><span class="brand">Logo</span><nav class="links"><a class="link" href="#">Home</a><a class="link" href="#">Work</a><a class="link" href="#">Contact</a></nav></div></div>',
      baseCss:
        ".bar { padding: 12px; border: 1px solid #d7d2e8; border-radius: 10px; background: #fff; }\n.brand { color: #4536e8; font-size: 12px; font-weight: 800; }\n.links { display: flex; gap: 8px; }\n.link { color: #5b5470; font-size: 11px; font-weight: 700; text-decoration: none; }",
      starter: ".bar {\n  /* make it a flex row */\n}\n\n.links {\n  /* push the links to the right */\n}\n",
      solution:
        ".bar {\n  display: flex;\n  align-items: center;\n}\n\n.links {\n  margin-left: auto;\n}\n",
      checks: [
        {
          label: "The bar is a flex row",
          test: ({ style }) => style(".bar").display === "flex",
        },
        {
          label: "The logo sits at the left edge",
          test: ({ rect, style }) => {
            const bar = rect(".bar");
            const brand = rect(".brand");
            const pad = parseFloat(style(".bar").paddingLeft) || 0;
            return !!bar && !!brand && near(brand.left, bar.left + pad);
          },
        },
        {
          label: "The links sit at the right edge",
          test: ({ rect, style }) => {
            const bar = rect(".bar");
            const links = rect(".links");
            const pad = parseFloat(style(".bar").paddingRight) || 0;
            return !!bar && !!links && near(links.right, bar.right - pad);
          },
        },
        {
          label: "The logo and links share one row",
          test: ({ rect }) => {
            const brand = rect(".brand");
            const links = rect(".links");
            return (
              !!brand &&
              !!links &&
              near(
                brand.top + brand.height / 2,
                links.top + links.height / 2,
                4
              )
            );
          },
        },
        {
          label: "There is open space between the logo and links",
          test: ({ rect }) => {
            const brand = rect(".brand");
            const links = rect(".links");
            return !!brand && !!links && links.left - brand.right > 20;
          },
        },
        {
          label: "The three links sit in a row with an 8px gap",
          test: ({ rects }) => {
            const links = rects(".link");
            return (
              links.length === 3 &&
              near(links[1].left - links[0].right, 8) &&
              near(links[2].left - links[1].right, 8)
            );
          },
        },
      ],
    },
    {
      id: "auto-fit-gallery",
      topic: "Grid",
      title: "Auto-fit gallery",
      short: "Auto-fit grid",
      goal:
        "Build a responsive gallery that creates as many equal columns as fit. Each tile should be at least 90px wide, with a 10px gap.",
      hints: [
        "`repeat(auto-fit, minmax(90px, 1fr))` is the key pattern.",
        "`auto-fit` collapses empty tracks, so the tiles spread across the row.",
        "`align-content: start` keeps the rows at the top instead of stretching them.",
      ],
      html:
        '<div class="stage"><div class="tile">1</div><div class="tile">2</div><div class="tile">3</div><div class="tile">4</div><div class="tile">5</div><div class="tile">6</div></div>',
      baseCss: ".tile { height: 54px; }",
      starter: ".stage {\n  display: grid;\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));\n  align-content: start;\n  gap: 10px;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The gallery creates more than one column",
          test: ({ rects }) => {
            const row = groupRows(rects(".tile"))[0];
            return !!row && row.items.length > 1;
          },
        },
        {
          label: "The gallery wraps onto more than one row",
          test: ({ rects }) => groupRows(rects(".tile")).length > 1,
        },
        {
          label: "Every tile is the same width",
          test: ({ rects }) => {
            const tiles = rects(".tile");
            return (
              tiles.length === 6 &&
              tiles.every((tile) => near(tile.width, tiles[0].width))
            );
          },
        },
        {
          label: "The tiles are at least 90px wide",
          test: ({ rects }) => {
            const tiles = rects(".tile");
            return tiles.length === 6 && tiles.every((tile) => tile.width >= 89);
          },
        },
        {
          label: "The gaps are 10px",
          test: ({ rects }) => {
            const rows = groupRows(rects(".tile"));
            const rowGaps = rows
              .slice(1)
              .map((row, index) => row.top - rows[index].bottom);
            const columnGaps = rows.flatMap((row) =>
              row.items
                .slice(1)
                .map((item, index) => item.left - row.items[index].right)
            );
            return (
              rowGaps.every((gap) => near(gap, 10)) &&
              columnGaps.every((gap) => near(gap, 10))
            );
          },
        },
        {
          label: "The first row fills the stage width",
          test: ({ rects, box }) => {
            const row = groupRows(rects(".tile"))[0];
            if (!row) return false;
            const first = row.items[0];
            const last = row.items[row.items.length - 1];
            return near(first.left, box.left) && near(last.right, box.right);
          },
        },
      ],
    },
    {
      id: "grid-center",
      topic: "Grid",
      title: "Grid center",
      short: "Grid center",
      goal:
        "Center the card with CSS Grid, and size it to 70% of the stage width and 60% of the height.",
      hints: [
        "`display: grid` plus `place-items: center` centers the card on both axes.",
        "Give the grid one column and one row that fill the stage.",
        "Set the card to `width: 70%` and `height: 60%`.",
      ],
      html: '<div class="stage"><div class="card">Center</div></div>',
      baseCss: "",
      starter:
        ".stage {\n  display: grid;\n}\n\n.card {\n  /* size the card */\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr;\n  place-items: center;\n}\n\n.card {\n  width: 70%;\n  height: 60%;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The card is 70% of the stage width",
          test: ({ rect, box }) => {
            const card = rect(".card");
            return !!card && near(card.width, box.width * 0.7, 3);
          },
        },
        {
          label: "The card is 60% of the stage height",
          test: ({ rect, box }) => {
            const card = rect(".card");
            return !!card && near(card.height, box.height * 0.6, 3);
          },
        },
        {
          label: "The card is centered horizontally",
          test: ({ rect, box }) => centered(rect(".card"), box, "x"),
        },
        {
          label: "The card is centered vertically",
          test: ({ rect, box }) => centered(rect(".card"), box, "y"),
        },
      ],
    },
    {
      id: "named-areas",
      topic: "Grid",
      title: "Name the areas",
      short: "Named areas",
      goal:
        "Build a three-column page with named grid areas: a full-width header, a 70px nav, a flexible main area, a 60px aside, and a full-width footer.",
      hints: [
        "Add a `grid-template-areas` map with three rows.",
        "Repeat `header` across all three columns, then `footer` across all three.",
        "Use `grid-area: header` (and so on) to drop each item into its area.",
      ],
      html:
        '<div class="stage"><header class="header">Header</header><nav class="nav">Nav</nav><main class="main">Main</main><aside class="aside">Aside</aside><footer class="footer">Footer</footer></div>',
      baseCss:
        ".header, .footer { min-height: 34px; }\n.nav, .main, .aside { min-height: 50px; }",
      starter:
        ".stage {\n  display: grid;\n  grid-template-columns: 70px 1fr 60px;\n  grid-template-rows: auto 1fr auto;\n  gap: 8px;\n}\n\n/* Add the areas map and place each item. */\n",
      solution:
        '.stage {\n  display: grid;\n  grid-template-columns: 70px 1fr 60px;\n  grid-template-rows: auto 1fr auto;\n  grid-template-areas:\n    "header header header"\n    "nav main aside"\n    "footer footer footer";\n  gap: 8px;\n}\n\n.header { grid-area: header; }\n.nav { grid-area: nav; }\n.main { grid-area: main; }\n.aside { grid-area: aside; }\n.footer { grid-area: footer; }\n',
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The header spans the top edge to edge",
          test: ({ rect, box }) => {
            const header = rect(".header");
            return (
              !!header &&
              near(header.left, box.left) &&
              near(header.right, box.right) &&
              near(header.top, box.top)
            );
          },
        },
        {
          label: "The footer spans the bottom edge to edge",
          test: ({ rect, box }) => {
            const footer = rect(".footer");
            return (
              !!footer &&
              near(footer.left, box.left) &&
              near(footer.right, box.right) &&
              near(footer.bottom, box.bottom)
            );
          },
        },
        {
          label: "The nav, main and aside share the middle row",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            const aside = rect(".aside");
            return (
              !!nav &&
              !!main &&
              !!aside &&
              near(nav.top, main.top) &&
              near(main.top, aside.top)
            );
          },
        },
        {
          label: "The nav column is 70px wide",
          test: ({ rect }) => {
            const nav = rect(".nav");
            return !!nav && near(nav.width, 70);
          },
        },
        {
          label: "The aside column is 60px wide",
          test: ({ rect }) => {
            const aside = rect(".aside");
            return !!aside && near(aside.width, 60);
          },
        },
        {
          label: "The main area fills the space between them",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            const aside = rect(".aside");
            return (
              !!nav &&
              !!main &&
              !!aside &&
              near(main.left, nav.right + 8) &&
              near(aside.left, main.right + 8)
            );
          },
        },
        {
          label: "The middle row fills the height",
          test: ({ rect }) => {
            const header = rect(".header");
            const main = rect(".main");
            return !!header && !!main && main.height > header.height + 20;
          },
        },
      ],
    },
    {
      id: "tall-feature",
      topic: "Grid",
      title: "Tall feature",
      short: "Tall feature",
      goal:
        "Make the feature card span both rows on the left. The two smaller cards stack on the right, each taking half the height.",
      hints: [
        "The stage is already a 2×2 grid with a 10px gap.",
        "Make the feature span both rows with `grid-row: span 2`.",
        "The other two tiles fill the right column automatically.",
      ],
      html:
        '<div class="stage"><div class="tile feature">Feature</div><div class="tile">A</div><div class="tile">B</div></div>',
      baseCss: ".tile { min-height: 40px; }",
      starter:
        ".stage {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n}\n\n.feature {\n  /* span both rows */\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n}\n\n.feature {\n  grid-row: span 2;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The feature spans the full height",
          test: ({ rect, box }) => {
            const feature = rect(".feature");
            return (
              !!feature &&
              near(feature.top, box.top) &&
              near(feature.bottom, box.bottom)
            );
          },
        },
        {
          label: "The feature takes the left half",
          test: ({ rect, box }) => {
            const feature = rect(".feature");
            return (
              !!feature &&
              near(feature.left, box.left) &&
              near(feature.width, (box.width - 10) / 2, 3)
            );
          },
        },
        {
          label: "The two smaller cards take the right half",
          test: ({ rect, rects, box }) => {
            const feature = rect(".feature");
            const cards = rects(".tile:not(.feature)");
            return (
              !!feature &&
              cards.length === 2 &&
              near(cards[0].left, feature.right + 10) &&
              near(cards[1].left, feature.right + 10) &&
              near(cards[0].right, box.right) &&
              near(cards[1].right, box.right)
            );
          },
        },
        {
          label: "The smaller cards stack with a 10px gap",
          test: ({ rects }) => {
            const cards = rects(".tile:not(.feature)");
            return (
              cards.length === 2 && near(cards[1].top - cards[0].bottom, 10)
            );
          },
        },
        {
          label: "The smaller cards are equal height",
          test: ({ rects }) => {
            const cards = rects(".tile:not(.feature)");
            return (
              cards.length === 2 && near(cards[0].height, cards[1].height)
            );
          },
        },
      ],
    },
    {
      id: "clamp-sidebar",
      topic: "Grid",
      title: "Clamp the sidebar",
      short: "Clamp sidebar",
      goal:
        "Make the sidebar 40% of the stage width, but never smaller than 80px. The main area fills the rest, with a 12px gap.",
      hints: [
        "`minmax(80px, 40%)` clamps the sidebar between a minimum and a maximum.",
        "Use `1fr` for the main column so it takes the remaining space.",
        "`gap: 12px` creates the space between the two columns.",
      ],
      html:
        '<div class="stage"><aside class="sidebar">Sidebar</aside><main class="main">Main</main></div>',
      baseCss: ".sidebar, .main { min-height: 100px; }",
      starter: ".stage {\n  display: grid;\n  gap: 12px;\n}\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: minmax(80px, 40%) 1fr;\n  gap: 12px;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The sidebar is clamped between 80px and 40%",
          test: ({ rect, box }) => {
            const sidebar = rect(".sidebar");
            const expected = Math.max(80, box.width * 0.4);
            return !!sidebar && near(sidebar.width, expected, 3);
          },
        },
        {
          label: "The sidebar starts at the left edge",
          test: ({ rect, box }) => {
            const sidebar = rect(".sidebar");
            return !!sidebar && near(sidebar.left, box.left);
          },
        },
        {
          label: "The main area reaches the right edge",
          test: ({ rect, box }) => {
            const main = rect(".main");
            return !!main && near(main.right, box.right);
          },
        },
        {
          label: "The main area fills the rest of the row",
          test: ({ rect, box }) => {
            const sidebar = rect(".sidebar");
            const main = rect(".main");
            return (
              !!sidebar &&
              !!main &&
              near(main.left, sidebar.right + 12) &&
              near(main.width, box.width - sidebar.width - 12, 3)
            );
          },
        },
        {
          label: "The two areas sit on the same row",
          test: ({ rect }) => {
            const sidebar = rect(".sidebar");
            const main = rect(".main");
            return !!sidebar && !!main && near(sidebar.top, main.top);
          },
        },
      ],
    },
    {
      id: "dashboard-shell",
      topic: "Grid",
      title: "Build the dashboard",
      short: "Dashboard",
      goal:
        "Place every item by grid line: a full-width header and footer, a 60px nav on the left, a flexible main area, and a 70px aside on the right.",
      hints: [
        "`grid-column: 1 / -1` spans the header and footer across all columns.",
        "Place the nav, main and aside on row 2 with `grid-row: 2`.",
        "Use `grid-column: 1`, `2` and `3` to put them in the right order.",
      ],
      html:
        '<div class="stage"><header class="header">Header</header><main class="main">Main</main><nav class="nav">Nav</nav><aside class="aside">Aside</aside><footer class="footer">Footer</footer></div>',
      baseCss:
        ".header, .footer { min-height: 34px; }\n.nav, .main, .aside { min-height: 50px; }",
      starter:
        ".stage {\n  display: grid;\n  grid-template-columns: 60px 1fr 70px;\n  grid-template-rows: auto 1fr auto;\n  gap: 8px;\n}\n\n/* Place each item by grid line. */\n",
      solution:
        ".stage {\n  display: grid;\n  grid-template-columns: 60px 1fr 70px;\n  grid-template-rows: auto 1fr auto;\n  gap: 8px;\n}\n\n.header {\n  grid-row: 1;\n  grid-column: 1 / -1;\n}\n\n.nav {\n  grid-row: 2;\n  grid-column: 1;\n}\n\n.main {\n  grid-row: 2;\n  grid-column: 2;\n}\n\n.aside {\n  grid-row: 2;\n  grid-column: 3;\n}\n\n.footer {\n  grid-row: 3;\n  grid-column: 1 / -1;\n}\n",
      checks: [
        {
          label: "The stage is a grid container",
          test: ({ style }) => style(".stage").display === "grid",
        },
        {
          label: "The header spans the top edge to edge",
          test: ({ rect, box }) => {
            const header = rect(".header");
            return (
              !!header &&
              near(header.left, box.left) &&
              near(header.right, box.right) &&
              near(header.top, box.top)
            );
          },
        },
        {
          label: "The footer spans the bottom edge to edge",
          test: ({ rect, box }) => {
            const footer = rect(".footer");
            return (
              !!footer &&
              near(footer.left, box.left) &&
              near(footer.right, box.right) &&
              near(footer.bottom, box.bottom)
            );
          },
        },
        {
          label: "The nav sits on the left and is 60px wide",
          test: ({ rect, box }) => {
            const nav = rect(".nav");
            return (
              !!nav && near(nav.left, box.left) && near(nav.width, 60)
            );
          },
        },
        {
          label: "The aside sits on the right and is 70px wide",
          test: ({ rect, box }) => {
            const aside = rect(".aside");
            return (
              !!aside && near(aside.right, box.right) && near(aside.width, 70)
            );
          },
        },
        {
          label: "The main area fills the space between them",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            const aside = rect(".aside");
            return (
              !!nav &&
              !!main &&
              !!aside &&
              near(main.left, nav.right + 8) &&
              near(aside.left, main.right + 8)
            );
          },
        },
        {
          label: "The three middle items share one row",
          test: ({ rect }) => {
            const nav = rect(".nav");
            const main = rect(".main");
            const aside = rect(".aside");
            return (
              !!nav &&
              !!main &&
              !!aside &&
              near(nav.top, main.top) &&
              near(main.top, aside.top)
            );
          },
        },
        {
          label: "The middle row fills the height",
          test: ({ rect }) => {
            const header = rect(".header");
            const main = rect(".main");
            return !!header && !!main && main.height > header.height + 20;
          },
        },
      ],
    },
  ];

  /* ---------------- DOM ---------------- */

  const $ = (selector, root = document) => root.querySelector(selector);

  const els = {
    tabs: $("#challenge-tabs"),
    topic: $("#challenge-topic"),
    index: $("#challenge-index"),
    title: $("#challenge-title"),
    goal: $("#challenge-goal"),
    hints: $("#challenge-hints"),
    solutionBox: $("#solution-box"),
    solutionCode: $("#solution-code"),
    btnSolution: $("#btn-solution"),
    targetFrame: $("#target-frame"),
    liveFrame: $("#live-frame"),
    liveStatus: $("#live-status"),
    editor: $("#editor"),
    btnReset: $("#btn-reset"),
    btnCheck: $("#btn-check"),
    btnNext: $("#btn-next-challenge"),
    checkPanel: $("#check-panel"),
    checkSummary: $("#check-summary"),
    checkList: $("#check-list"),
    progressCount: $("#progress-count"),
    progressFill: $("#progress-fill"),
    progressCopy: $("#progress-copy"),
    finish: $("#lesson-finish"),
    btnRestart: $("#btn-restart-lesson"),
    live: $("#live-region"),
  };

  let store = loadStore();
  let currentIndex = 0;
  let updateTimer = null;
  let saveTimer = null;
  let checkToken = 0;

  /* ---------------- Utilities ---------------- */

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[ch];
    });
  }

  function formatHint(text) {
    return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function announce(message) {
    els.live.textContent = message;
  }

  function near(a, b, tolerance = 2.5) {
    return (
      Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance
    );
  }

  function centered(rect, box, axis) {
    if (!rect || !box) return false;
    if (axis === "x") {
      return near(rect.left + rect.width / 2, box.left + box.width / 2, 3);
    }
    return near(rect.top + rect.height / 2, box.top + box.height / 2, 3);
  }

  // Group bounding rects into visual rows, sorted top-to-bottom and
  // left-to-right. Useful for flex-wrap and auto-fit gallery checks.
  function groupRows(rects) {
    const rows = [];

    rects
      .slice()
      .sort((a, b) => a.top - b.top || a.left - b.left)
      .forEach((rect) => {
        const row = rows.find((candidate) => near(candidate.top, rect.top, 3));
        if (row) row.items.push(rect);
        else rows.push({ top: rect.top, bottom: rect.bottom, items: [rect] });
      });

    rows.forEach((row) => {
      row.items.sort((a, b) => a.left - b.left);
      row.bottom = Math.max(...row.items.map((item) => item.bottom));
    });

    return rows.sort((a, b) => a.top - b.top);
  }

  function stageBox(doc, win) {
    const stage = doc.querySelector(".stage");
    if (!stage) return null;

    const rect = stage.getBoundingClientRect();
    const style = win.getComputedStyle(stage);
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const padRight = parseFloat(style.paddingRight) || 0;
    const padTop = parseFloat(style.paddingTop) || 0;
    const padBottom = parseFloat(style.paddingBottom) || 0;
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;

    // clientWidth/clientHeight exclude borders and any scrollbar, so the
    // checks stay accurate even when the preview is tight enough to scroll.
    return {
      left: rect.left + borderLeft + padLeft,
      right: rect.left + borderLeft + stage.clientWidth - padRight,
      top: rect.top + borderTop + padTop,
      bottom: rect.top + borderTop + stage.clientHeight - padBottom,
      width: Math.max(0, stage.clientWidth - padLeft - padRight),
      height: Math.max(0, stage.clientHeight - padTop - padBottom),
    };
  }

  function buildContext(doc, win) {
    const box = stageBox(doc, win);
    if (!box) return null;

    const rect = (selector) => {
      const el = doc.querySelector(selector);
      return el ? el.getBoundingClientRect() : null;
    };

    const rects = (selector) =>
      Array.from(doc.querySelectorAll(selector), (el) =>
        el.getBoundingClientRect()
      );

    const style = (selector) => {
      const el = doc.querySelector(selector);
      return el ? win.getComputedStyle(el) : null;
    };

    return { doc, win, box, rect, rects, style };
  }

  /* ---------------- Storage ---------------- */

  function emptyStore() {
    return {
      version: STORE_VERSION,
      current: null,
      completed: {},
      drafts: {},
      savedAt: 0,
    };
  }

  function parseStore(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.version === STORE_VERSION &&
        parsed.completed &&
        typeof parsed.completed === "object" &&
        parsed.drafts &&
        typeof parsed.drafts === "object"
      ) {
        return {
          ...emptyStore(),
          ...parsed,
          completed: { ...parsed.completed },
          drafts: { ...parsed.drafts },
        };
      }
    } catch {
      /* Ignore malformed data. */
    }
    return null;
  }

  function loadStore() {
    const candidates = [];

    try {
      const local = parseStore(localStorage.getItem(STORAGE_KEY));
      if (local) candidates.push(local);
    } catch {
      /* Storage can be unavailable. */
    }

    try {
      if (window.name.startsWith(STORAGE_PREFIX)) {
        const fromWindow = parseStore(window.name.slice(STORAGE_PREFIX.length));
        if (fromWindow) candidates.push(fromWindow);
      }
    } catch {
      /* Ignore. */
    }

    if (candidates.length === 0) return emptyStore();
    candidates.sort(
      (a, b) => (Number(b.savedAt) || 0) - (Number(a.savedAt) || 0)
    );
    return candidates[0];
  }

  function saveStore() {
    store.savedAt = Date.now();
    const raw = JSON.stringify(store);

    try {
      localStorage.setItem(STORAGE_KEY, raw);
    } catch {
      /* Keep working in memory. */
    }

    try {
      // Never clobber the quiz's window.name fallback in the same tab.
      if (!window.name || window.name.startsWith(STORAGE_PREFIX)) {
        window.name = STORAGE_PREFIX + raw;
      }
    } catch {
      /* Ignore. */
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveStore, 350);
  }

  /* ---------------- Preview frames ---------------- */

  function buildDoc(challenge, css) {
    const safeCss = String(css).replace(/<\/style/gi, "<\\/style");
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${COMMON_CSS}\n${challenge.baseCss}\n${safeCss}</style></head><body>${challenge.html}</body></html>`;
  }

  function setFrame(frame, html) {
    return new Promise((resolve) => {
      let settled = false;

      const done = () => {
        if (settled) return;
        settled = true;
        frame.removeEventListener("load", done);
        resolve();
      };

      frame.addEventListener("load", done);
      frame.srcdoc = html;
      setTimeout(done, 1200);
    });
  }

  function renderTarget(challenge) {
    return setFrame(
      els.targetFrame,
      buildDoc(challenge, challenge.solution)
    );
  }

  function renderLive(challenge, css) {
    els.liveStatus.textContent = "updating…";
    return setFrame(els.liveFrame, buildDoc(challenge, css)).then(() => {
      els.liveStatus.textContent = "live";
    });
  }

  /* ---------------- Challenge UI ---------------- */

  function completedCount() {
    return CHALLENGES.filter((challenge) => store.completed[challenge.id])
      .length;
  }

  function renderTabs() {
    els.tabs.innerHTML = CHALLENGES.map((challenge, index) => {
      const done = Boolean(store.completed[challenge.id]);
      const current = index === currentIndex;
      return `
        <button
          class="challenge-chip${done ? " is-complete" : ""}"
          type="button"
          data-index="${index}"
          ${current ? 'aria-current="step"' : ""}
          aria-label="${index + 1} ${escapeHtml(challenge.short)}${
            done ? " (complete)" : ""
          }"
        >
          <span class="chip-num" aria-hidden="true">${
            done ? CHECK_ICON : index + 1
          }</span>
          <span class="chip-title">${escapeHtml(challenge.short)}</span>
        </button>`;
    }).join("");
  }

  function renderProgress() {
    const count = completedCount();
    const total = CHALLENGES.length;

    els.progressCount.textContent = `${count} / ${total}`;
    els.progressFill.style.width = `${(count / total) * 100}%`;

    if (count === 0) {
      els.progressCopy.textContent =
        "Complete a layout to light up its chip.";
    } else if (count < total) {
      els.progressCopy.textContent = `${count} of ${total} layouts matched. Keep going.`;
    } else {
      els.progressCopy.textContent = `All ${total} layouts matched. Those patterns are yours now.`;
    }

    els.finish.hidden = count < total;
  }

  function clearChecks() {
    els.checkPanel.hidden = true;
    els.checkList.innerHTML = "";
    els.checkSummary.textContent = "";
    els.checkSummary.classList.remove("is-success");
  }

  function renderChallenge() {
    const challenge = CHALLENGES[currentIndex];

    els.topic.textContent = challenge.topic;
    els.index.textContent = `Challenge ${currentIndex + 1} of ${
      CHALLENGES.length
    }`;
    els.title.textContent = challenge.title;
    els.goal.textContent = challenge.goal;
    els.hints.innerHTML = challenge.hints
      .map((hint) => `<li>${formatHint(hint)}</li>`)
      .join("");
    els.solutionCode.textContent = challenge.solution;
    els.solutionBox.open = false;

    els.editor.value =
      typeof store.drafts[challenge.id] === "string"
        ? store.drafts[challenge.id]
        : challenge.starter;

    els.btnNext.textContent =
      currentIndex === CHALLENGES.length - 1
        ? "Back to challenge 1"
        : "Next challenge";

    store.current = challenge.id;
    saveStore();
    clearChecks();
    renderTabs();
    renderProgress();

    renderTarget(challenge);
    renderLive(challenge, els.editor.value);
  }

  function goToChallenge(index, { focus = false } = {}) {
    const challenge = CHALLENGES[currentIndex];
    if (challenge) {
      store.drafts[challenge.id] = els.editor.value;
    }

    currentIndex =
      (index + CHALLENGES.length) % CHALLENGES.length;
    checkToken += 1;
    clearTimeout(updateTimer);
    renderChallenge();

    if (focus) {
      els.title.focus({ preventScroll: true });
      document
        .querySelector(".challenge-shell")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }

    announce(
      `Challenge ${currentIndex + 1} of ${CHALLENGES.length}: ${
        CHALLENGES[currentIndex].title
      }.`
    );
  }

  /* ---------------- Checking ---------------- */

  function renderResults(results) {
    const total = results.length;
    const passed = results.filter((result) => result.pass).length;
    const allPassed = passed === total;

    els.checkSummary.textContent = allPassed
      ? `All ${total} checks passed — the layout matches the target.`
      : `${passed} of ${total} checks passed. Adjust your CSS and try again.`;
    els.checkSummary.classList.toggle("is-success", allPassed);

    els.checkList.innerHTML = results
      .map(
        (result) => `
          <li class="check-item ${result.pass ? "is-pass" : "is-fail"}">
            <span class="check-icon" aria-hidden="true">${
              result.pass ? "✓" : "✕"
            }</span>
            <span>${escapeHtml(result.label)}</span>
          </li>`
      )
      .join("");

    els.checkPanel.hidden = false;
    return allPassed;
  }

  function markComplete(challenge) {
    if (store.completed[challenge.id]) return;

    store.completed[challenge.id] = true;
    saveStore();
    renderTabs();
    renderProgress();

    const count = completedCount();
    if (count === CHALLENGES.length) {
      announce(
        `All ${CHALLENGES.length} layouts matched. Lesson 2 complete — scroll down for your summary.`
      );
    } else {
      announce(
        `Challenge complete: ${challenge.title}. ${count} of ${CHALLENGES.length} layouts matched.`
      );
    }
  }

  async function checkLayout() {
    const challenge = CHALLENGES[currentIndex];
    const token = ++checkToken;

    clearTimeout(updateTimer);
    els.btnCheck.disabled = true;
    els.btnCheck.textContent = "Checking…";

    try {
      await renderLive(challenge, els.editor.value);
      if (token !== checkToken) return;

      const doc = els.liveFrame.contentDocument;
      const win = els.liveFrame.contentWindow;
      const context = doc && win ? buildContext(doc, win) : null;

      const results = challenge.checks.map((check) => {
        let pass = false;
        try {
          pass = Boolean(context && check.test(context));
        } catch {
          pass = false;
        }
        return { label: check.label, pass };
      });

      const allPassed = renderResults(results);
      if (allPassed) markComplete(challenge);
      else announce("Not quite yet. Check the results and try again.");
    } finally {
      els.btnCheck.disabled = false;
      els.btnCheck.textContent = "Check layout";
    }
  }

  /* ---------------- Events ---------------- */

  els.tabs.addEventListener("click", (event) => {
    const chip = event.target.closest(".challenge-chip");
    if (!chip) return;
    goToChallenge(Number(chip.dataset.index), { focus: true });
  });

  els.btnNext.addEventListener("click", () => {
    goToChallenge(currentIndex + 1, { focus: true });
  });

  els.editor.addEventListener("input", () => {
    const challenge = CHALLENGES[currentIndex];
    store.drafts[challenge.id] = els.editor.value;
    scheduleSave();

    checkToken += 1;
    clearChecks();
    els.liveStatus.textContent = "updating…";

    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      renderLive(challenge, els.editor.value);
    }, 180);
  });

  els.editor.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = els.editor.selectionStart;
      const end = els.editor.selectionEnd;
      const value = els.editor.value;
      els.editor.value = `${value.slice(0, start)}  ${value.slice(end)}`;
      els.editor.selectionStart = start + 2;
      els.editor.selectionEnd = start + 2;
      els.editor.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      checkLayout();
    }
  });

  els.btnCheck.addEventListener("click", checkLayout);

  els.btnReset.addEventListener("click", () => {
    const challenge = CHALLENGES[currentIndex];
    els.editor.value = challenge.starter;
    delete store.drafts[challenge.id];
    saveStore();
    clearChecks();
    checkToken += 1;
    renderLive(challenge, challenge.starter);
    announce("Editor reset to the starter CSS.");
    els.editor.focus();
  });

  els.btnSolution.addEventListener("click", () => {
    const challenge = CHALLENGES[currentIndex];
    els.editor.value = challenge.solution;
    store.drafts[challenge.id] = challenge.solution;
    saveStore();
    clearChecks();
    checkToken += 1;
    renderLive(challenge, challenge.solution);
    announce("Solution loaded. Run the checks to see it pass.");
    els.editor.focus();
  });

  els.btnRestart.addEventListener("click", () => {
    const ok = window.confirm(
      `Reset all ${CHALLENGES.length} challenges, your drafts and your progress?`
    );
    if (!ok) return;

    store = emptyStore();
    currentIndex = 0;
    saveStore();
    renderChallenge();
    announce("Lesson reset. Challenge 1 is ready.");
    els.title.focus({ preventScroll: true });
  });

  window.addEventListener("pagehide", () => {
    const challenge = CHALLENGES[currentIndex];
    if (challenge) store.drafts[challenge.id] = els.editor.value;
    saveStore();
  });

  /* ---------------- Init ---------------- */

  const savedIndex = CHALLENGES.findIndex(
    (challenge) => challenge.id === store.current
  );
  currentIndex = savedIndex >= 0 ? savedIndex : 0;

  renderChallenge();
})();
