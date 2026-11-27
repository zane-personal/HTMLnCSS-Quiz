/* ============================================================
   Question bank — 40 intermediate HTML & CSS questions
   Categories: HTML, CSS, Flexbox, Grid
   `backticks` in strings are rendered as inline code by the app.
   ============================================================ */

const QUESTIONS = [
  /* ---------------- HTML ---------------- */
  {
    id: "html-nav",
    category: "HTML",
    question: "Which element is the most semantically appropriate wrapper for a page's primary navigation links?",
    options: ["`<div class=\"nav\">`", "`<nav>`", "`<menu>`", "`<header>`"],
    answer: 1,
    explanation:
      "`<nav>` marks a major block of navigation links, and assistive technology can jump straight to it. A generic `<div>` carries no such meaning, while `<menu>` is intended for a list of commands.",
  },
  {
    id: "html-alt",
    category: "HTML",
    question: "Which attribute supplies the text alternative for an `<img>` element?",
    options: ["`src`", "`title`", "`alt`", "`aria-label`"],
    answer: 2,
    explanation:
      "`alt` is the standard text alternative. Screen readers announce it, and browsers display it when the image fails to load. `title` is only a supplementary tooltip.",
  },
  {
    id: "html-range",
    category: "HTML",
    question: "Which input type renders a slider for choosing a value from a range?",
    options: ["`type=\"number\"`", "`type=\"slider\"`", "`type=\"range\"`", "`type=\"scale\"`"],
    answer: 2,
    explanation:
      "`<input type=\"range\">` renders a slider. Pair it with `min`, `max` and `step` to control the allowed values.",
  },
  {
    id: "html-label",
    category: "HTML",
    question: "How do you correctly associate a `<label>` with a text input?",
    options: [
      "The label's `for` attribute matches the input's `id`",
      "The label's `name` attribute matches the input's `id`",
      "The label's `id` matches the input's `name`",
      "Labels are associated automatically by document order",
    ],
    answer: 0,
    explanation:
      "The `for` attribute must reference the form control's `id`. Clicking the label then focuses the input, and screen readers announce the label with the field.",
  },
  {
    id: "html-figcaption",
    category: "HTML",
    question: "Which element provides a caption for a `<figure>`?",
    options: ["`<caption>`", "`<figcaption>`", "`<legend>`", "`<summary>`"],
    answer: 1,
    explanation:
      "`<figcaption>` is the caption element for `<figure>`. `<caption>` belongs to tables, `<legend>` to fieldsets, and `<summary>` to `<details>`.",
  },
  {
    id: "html-main",
    category: "HTML",
    question: "Which statement about the `<main>` element is correct?",
    options: [
      "It can appear once for every section on the page",
      "It should be used once per page for the dominant content",
      "It must always be the first child of `<body>`",
      "It automatically includes the site header and footer",
    ],
    answer: 1,
    explanation:
      "There should be one visible `<main>` per page, wrapping the content that is unique to that page. It must not be nested inside `<header>`, `<footer>`, `<nav>`, `<aside>` or `<article>`.",
  },
  {
    id: "html-required",
    category: "HTML",
    question: "Which attribute makes a form control mandatory before the form can be submitted?",
    options: ["`validate`", "`required`", "`mandatory`", "`needed`"],
    answer: 1,
    explanation:
      "`required` enables native constraint validation. The browser blocks submission and shows a message while the field is empty.",
  },
  {
    id: "html-article",
    category: "HTML",
    question: "Which element is best for a self-contained blog post that could be syndicated on its own?",
    options: ["`<section>`", "`<article>`", "`<aside>`", "`<div>`"],
    answer: 1,
    explanation:
      "`<article>` represents a self-contained composition that would make sense independently — a blog post, news story or forum entry. `<section>` is a thematic grouping, not necessarily standalone.",
  },
  {
    id: "html-legend",
    category: "HTML",
    question: "Which child element gives a `<fieldset>` its caption?",
    options: ["`<label>`", "`<legend>`", "`<caption>`", "`<title>`"],
    answer: 1,
    explanation:
      "`<legend>` must be the first child of `<fieldset>` and names the group of related controls, which is announced by screen readers.",
  },
  {
    id: "html-datalist",
    category: "HTML",
    question: "How is a `<datalist>` connected to an `<input>`?",
    options: [
      "The input's `list` attribute matches the datalist's `id`",
      "The datalist's `for` attribute matches the input's `id`",
      "The input must be wrapped inside the datalist",
      "The input's `form` attribute matches the datalist's `name`",
    ],
    answer: 0,
    explanation:
      "Set the input's `list` attribute to the `id` of the `<datalist>`. The browser then offers the datalist's `<option>` values as suggestions while still allowing free text.",
  },
  {
    id: "html-th-scope",
    category: "HTML",
    question: "Which `<th>` attribute explicitly tells assistive technology whether a header applies to a column or a row?",
    options: ["`headers`", "`scope`", "`axis`", "`role`"],
    answer: 1,
    explanation:
      "`scope=\"col\"` or `scope=\"row\"` defines what a table header covers. It makes complex tables much easier to navigate with a screen reader.",
  },
  {
    id: "html-viewport",
    category: "HTML",
    question: "What does `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` primarily do?",
    options: [
      "Locks the page zoom so users cannot pinch to zoom",
      "Sets the layout viewport to the device width and the initial zoom to 100%",
      "Forces every element to scale down on small screens",
      "Loads a separate stylesheet for mobile devices",
    ],
    answer: 1,
    explanation:
      "The viewport meta tag tells mobile browsers to use the device width as the layout viewport and start at 100% zoom, so media queries and responsive layouts behave as intended.",
  },

  /* ---------------- CSS ---------------- */
  {
    id: "css-specificity",
    category: "CSS",
    question: "What is the specificity of the selector `#nav .item a:hover`?",
    options: ["(1,1,2)", "(1,2,1)", "(2,1,1)", "(1,2,2)"],
    answer: 1,
    explanation:
      "One ID (`#nav`), two class-level selectors (`.item` and the `:hover` pseudo-class), and one element (`a`) give a specificity of (1,2,1).",
  },
  {
    id: "css-box-model",
    category: "CSS",
    question: "An element has `width: 200px`, `padding: 20px`, `border: 5px solid`, and the default `box-sizing: content-box`. How wide is its border box?",
    options: ["200px", "230px", "250px", "270px"],
    answer: 2,
    explanation:
      "With `content-box`, padding and borders are added outside the declared width: 200 + (2 × 20) + (2 × 5) = 250px.",
  },
  {
    id: "css-absolute",
    category: "CSS",
    question: "A `position: absolute` element is positioned relative to what?",
    options: [
      "Its nearest parent, whatever its position value",
      "Its nearest positioned ancestor, or the initial containing block if none exists",
      "The viewport at all times",
      "The previous sibling in normal flow",
    ],
    answer: 1,
    explanation:
      "An absolutely positioned element is taken out of flow and placed relative to the nearest ancestor with a position other than `static`. Without one, it uses the initial containing block.",
  },
  {
    id: "css-z-index",
    category: "CSS",
    question: "For `z-index` to take effect, what is generally required?",
    options: [
      "The element must have `display: block`",
      "The element must be positioned (not `static`) or be a flex/grid item",
      "The element must have `overflow: hidden`",
      "The element must be floated",
    ],
    answer: 1,
    explanation:
      "`z-index` applies to positioned elements and to flex/grid items. It only orders elements within the same stacking context, so a parent with `opacity` below 1 or a `transform` can trap a child's z-index.",
  },
  {
    id: "css-rem",
    category: "CSS",
    question: "What is `1rem` relative to?",
    options: [
      "The parent element's font size",
      "The root (`<html>`) font size",
      "The current element's font size",
      "The viewport width",
    ],
    answer: 1,
    explanation:
      "`rem` means root em: it is relative to the root element's font size. `em`, by contrast, is relative to the element's own (or inherited) font size.",
  },
  {
    id: "css-border-box",
    category: "CSS",
    question: "What does `box-sizing: border-box` change?",
    options: [
      "The declared width and height include padding and border",
      "Borders are drawn inside the content area only",
      "Margins are included in the element's width",
      "The element's children are clipped to its padding box",
    ],
    answer: 0,
    explanation:
      "With `border-box`, `width` and `height` describe the border box, so padding and borders eat into the declared size instead of expanding it. This makes layout maths far more predictable.",
  },
  {
    id: "css-margin-collapse",
    category: "CSS",
    question: "Two stacked block elements have `margin-bottom: 20px` and `margin-top: 30px`. With no flex, grid or floats involved, how much vertical space separates them?",
    options: ["10px", "20px", "30px", "50px"],
    answer: 2,
    explanation:
      "Adjacent vertical margins collapse: the larger margin wins, so the gap is 30px, not 50px. Margins do not collapse in flex or grid containers.",
  },
  {
    id: "css-display-none",
    category: "CSS",
    question: "How does `display: none` differ from `visibility: hidden`?",
    options: [
      "`display: none` removes the element from layout and the accessibility tree",
      "`display: none` keeps the element's space but hides it visually",
      "`visibility: hidden` removes the element from layout entirely",
      "They behave identically in every browser",
    ],
    answer: 0,
    explanation:
      "`display: none` removes the element and its children from layout and from assistive technology. `visibility: hidden` hides it but reserves its space.",
  },
  {
    id: "css-sticky",
    category: "CSS",
    question: "What does `position: sticky` do?",
    options: [
      "Fixes the element to the viewport at all times",
      "Behaves like relative until a scroll threshold is met, then sticks within its containing block",
      "Removes the element from normal flow",
      "Positions the element relative to the nearest positioned ancestor",
    ],
    answer: 1,
    explanation:
      "A sticky element scrolls like a normal element until it reaches the specified offset, then stays pinned inside its nearest scrolling ancestor — but never outside its containing block.",
  },
  {
    id: "css-where",
    category: "CSS",
    question: "What is the specificity of `:where(.card, #hero)`?",
    options: ["(0,1,0)", "(1,0,0)", "(0,0,0)", "(0,2,0)"],
    answer: 2,
    explanation:
      "`:where()` and everything inside it contribute zero specificity. That makes it ideal for resets and default styles that should be easy to override.",
  },
  {
    id: "css-clamp",
    category: "CSS",
    question: "What does `clamp(1rem, 2.5vw, 2rem)` produce?",
    options: [
      "Always exactly `2.5vw`",
      "A value between `1rem` and `2rem`, preferring `2.5vw` when possible",
      "The smaller of `1rem` and `2rem`",
      "A value that ignores the viewport width",
    ],
    answer: 1,
    explanation:
      "`clamp(min, preferred, max)` keeps the computed value between the lower and upper bounds. Here the font size scales with the viewport but never drops below 1rem or exceeds 2rem.",
  },

  /* ---------------- Flexbox ---------------- */
  {
    id: "flex-display",
    category: "Flexbox",
    question: "What does `display: flex` do to an element?",
    options: [
      "Turns it into a flex container, and its direct children become flex items",
      "Turns every child into a block element",
      "Adds a border around the element",
      "Makes the element scrollable",
    ],
    answer: 0,
    explanation:
      "`display: flex` enables the Flexbox layout model. The element becomes a flex container and its direct children are laid out as flex items along a main axis.",
  },
  {
    id: "flex-direction-default",
    category: "Flexbox",
    question: "What is the default value of `flex-direction` on a flex container?",
    options: ["`row`", "`column`", "`row-reverse`", "`column-reverse`"],
    answer: 0,
    explanation:
      "By default, flex items line up horizontally in a row. Use `flex-direction: column` to stack them vertically instead.",
  },
  {
    id: "flex-justify-center",
    category: "Flexbox",
    question: "In a row flex container, which declaration centers items along the main (horizontal) axis?",
    options: [
      "`justify-content: center;`",
      "`align-items: center;`",
      "`text-align: center;`",
      "`place-self: center;`",
    ],
    answer: 0,
    explanation:
      "`justify-content` aligns items along the main axis. In a row, the main axis is horizontal.",
  },
  {
    id: "flex-align-center",
    category: "Flexbox",
    question: "In a row flex container, which declaration centers items vertically?",
    options: [
      "`align-items: center;`",
      "`justify-content: center;`",
      "`flex-wrap: center;`",
      "`align-content: center;`",
    ],
    answer: 0,
    explanation:
      "`align-items` aligns items along the cross axis. In a row, the cross axis is vertical, so this centers items vertically.",
  },
  {
    id: "flex-column",
    category: "Flexbox",
    question: "What does `flex-direction: column` do?",
    options: [
      "Stacks items vertically from top to bottom",
      "Lays items out in a horizontal row",
      "Reverses the order of the items",
      "Wraps items onto new lines",
    ],
    answer: 0,
    explanation:
      "`column` makes the main axis vertical, so flex items stack from top to bottom.",
  },
  {
    id: "flex-wrap",
    category: "Flexbox",
    question: "What does `flex-wrap: wrap` allow flex items to do?",
    options: [
      "Move onto a new line when there is not enough room",
      "Shrink until they disappear",
      "Overlap each other",
      "Stay on one line no matter what",
    ],
    answer: 0,
    explanation:
      "With wrapping enabled, items flow onto additional lines instead of shrinking indefinitely or overflowing the container.",
  },
  {
    id: "flex-gap",
    category: "Flexbox",
    question: "Which property adds space between flex items?",
    options: ["`gap`", "`padding`", "`margin: auto`", "`spacing`"],
    answer: 0,
    explanation:
      "`gap` adds space between flex items without needing a margin on each one. It accepts one value for both axes or separate row and column values.",
  },
  {
    id: "flex-grow-one",
    category: "Flexbox",
    question: "What does `flex: 1` do to a flex item?",
    options: [
      "Lets it grow to share the available space equally with other `flex: 1` items",
      "Makes it exactly 1 pixel wide",
      "Pins it to the left edge",
      "Removes it from the flex container",
    ],
    answer: 0,
    explanation:
      "`flex: 1` allows an item to grow and shrink as needed. Several items with `flex: 1` split the free space evenly.",
  },
  {
    id: "flex-space-between",
    category: "Flexbox",
    question: "What does `justify-content: space-between` do in a row?",
    options: [
      "Pushes the first item to the start and the last to the end, with equal space between",
      "Centers all items in the middle",
      "Adds space only before the first item",
      "Stacks the items vertically",
    ],
    answer: 0,
    explanation:
      "`space-between` places the first item at the start, the last item at the end, and spreads the remaining space evenly between the items.",
  },

  /* ---------------- Grid ---------------- */
  {
    id: "grid-display",
    category: "Grid",
    question: "What does `display: grid` do to an element?",
    options: [
      "Turns it into a grid container, and its direct children become grid items",
      "Turns it into a flex container",
      "Adds a visible grid border",
      "Makes all children inline",
    ],
    answer: 0,
    explanation:
      "`display: grid` enables Grid layout. The element becomes a grid container and its direct children are placed into rows and columns.",
  },
  {
    id: "grid-three-columns",
    category: "Grid",
    question: "What does `grid-template-columns: 1fr 1fr 1fr` create?",
    options: [
      "Three equal-width columns",
      "Three equal-height rows",
      "One column that is three times wider",
      "Three columns that are each 1 pixel wide",
    ],
    answer: 0,
    explanation:
      "Each `1fr` track takes one equal share of the available width, producing three equal columns.",
  },
  {
    id: "grid-fr",
    category: "Grid",
    question: "What does the `fr` unit mean in CSS Grid?",
    options: [
      "A fraction of the available space",
      "A fixed number of pixels",
      "A font-relative unit",
      "A percentage of the viewport height",
    ],
    answer: 0,
    explanation:
      "`fr` stands for fraction. Grid tracks share the available space according to their fraction values.",
  },
  {
    id: "grid-gap",
    category: "Grid",
    question: "Which property adds space between grid rows and columns?",
    options: ["`gap`", "`margin`", "`padding`", "`border-spacing`"],
    answer: 0,
    explanation:
      "`gap` adds space between tracks in a grid. One value sets both row and column gaps; two values set them separately.",
  },
  {
    id: "grid-fixed-columns",
    category: "Grid",
    question: "What does `grid-template-columns: 100px 200px` create?",
    options: [
      "A 100px first column and a 200px second column",
      "Two columns that each grow to between 100px and 200px",
      "One column that is 300px wide",
      "Two rows of 100px and 200px",
    ],
    answer: 0,
    explanation:
      "Fixed lengths create fixed-size tracks: the first column is 100px and the second is 200px.",
  },
  {
    id: "grid-span-two",
    category: "Grid",
    question: "How do you make a grid item span two columns?",
    options: [
      "`grid-column: span 2;`",
      "`grid-row: span 2;`",
      "`grid-gap: 2;`",
      "`column-count: 2;`",
    ],
    answer: 0,
    explanation:
      "`grid-column: span 2` tells the item to cover two column tracks. `grid-row: span 2` would span two rows instead.",
  },
  {
    id: "grid-template-rows",
    category: "Grid",
    question: "What does `grid-template-rows` define?",
    options: [
      "The height of each row in the grid",
      "The width of each column",
      "The space between items",
      "The order of the grid items",
    ],
    answer: 0,
    explanation:
      "`grid-template-rows` sets the row tracks and their heights. `grid-template-columns` sets the column tracks and their widths.",
  },
  {
    id: "grid-place-items",
    category: "Grid",
    question: "Which declaration centers every grid item inside its own cell?",
    options: [
      "`place-items: center;`",
      "`justify-content: center;`",
      "`text-align: center;`",
      "`grid-auto-flow: center;`",
    ],
    answer: 0,
    explanation:
      "`place-items: center` is shorthand for centering items on both axes within their grid areas. `justify-content` would move the whole grid instead.",
  },
];

window.QUESTIONS = QUESTIONS;
