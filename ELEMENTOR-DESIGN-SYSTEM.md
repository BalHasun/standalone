# Altenburg Foundation — Elementor design-system handover (round 1)

Everything below mirrors exactly what is now live in the static HTML in this
folder. Apply it in WordPress at **Elementor → hamburger menu → Site Settings**.

---

## 1. Global Colors

`Site Settings → Global Colors`

| Elementor name   | Value     | Used for                                             |
| ---------------- | --------- | ---------------------------------------------------- |
| Primary          | `#082244` | Headings (h1–h4), header/footer background           |
| Secondary        | `#17385e` | **Body text** — the dark-blue body colour            |
| Text             | `#4a6483` | Meta text, captions, small labels                    |
| Accent           | `#17658f` | Links, text-link hover, Grants accents, blue buttons |
| Fellowship       | `#237b6d` | Fellowship section labels and buttons                |
| Fellowship light | `#57bda9` | Fellowship rules, light accents                      |
| Grants light     | `#51ade5` | Grants light accents                                 |
| Background       | `#fbfaf6` | Page background (paper)                              |
| Surface          | `#ffffff` | Cards, form fields                                   |
| Warm             | `#f1eee7` | Alternating section background                       |
| Border           | `#d9ddd8` | Rules and dividers                                   |

**Do not** set body text to `#17658f`. That value is the link/accent colour —
using it for body text makes text links indistinguishable from surrounding copy
(WCAG 1.4.1 failure).

Contrast on the `#fbfaf6` page background:

| Colour             | Ratio  | AA (4.5) | AAA (7.0) |
| ------------------ | ------ | -------- | --------- |
| `#082244` headings | 15.2:1 | pass     | pass      |
| `#17385e` body     | 11.4:1 | pass     | pass      |
| `#4a6483` meta     | 5.8:1  | pass     | fail      |
| `#17658f` links    | 6.1:1  | pass     | fail      |

---

## 2. Global Fonts

`Site Settings → Global Fonts`

Families: **Fraunces** (display/headings, serif) and **Public Sans** (body,
sans-serif).

Eight sizes, nothing else. The four large ones are fluid — paste the `clamp()`
into the size field's custom value, or set the desktop/tablet/mobile values
shown.

| Token    | Elementor name | Value                            | Desktop | Mobile | Used for                                        |
| -------- | -------------- | -------------------------------- | ------- | ------ | ----------------------------------------------- |
| `--fs-1` | Label          | `0.75rem`                        | 12px    | 12px   | Eyebrows, section labels, captions, form labels |
| `--fs-2` | Small          | `0.875rem`                       | 14px    | 14px   | Small copy, nav, buttons, meta                  |
| `--fs-3` | Body           | `1rem`                           | 16px    | 16px   | Body text                                       |
| `--fs-4` | Lead           | `1.125rem`                       | 18px    | 18px   | Intro / lead paragraphs                         |
| `--fs-5` | H4             | `clamp(1.15rem, 1.5vw, 1.45rem)` | 21.6px  | 18.4px | Small headings                                  |
| `--fs-6` | H3             | `clamp(1.4rem, 2vw, 1.9rem)`     | 28.8px  | 22.4px | Card titles                                     |
| `--fs-7` | H2             | `clamp(1.9rem, 3vw, 2.9rem)`     | 43.2px  | 30.4px | Section headings                                |
| `--fs-8` | H1             | `clamp(3.75rem, 5vw, 4.5rem)`    | 72px    | 60px   | Hero / display                                  |

**Minimum rendered text is 12px.** The old build went down to 8.5px.

---

## 3. Global spacing

| Token       | Value                      | Desktop | Notes                           |
| ----------- | -------------------------- | ------- | ------------------------------- |
| `--section` | `clamp(4rem, 6vw, 6.5rem)` | 86px    | Section padding, top and bottom |
| `--page`    | `min(100% - 6rem, 1280px)` | —       | Page container                  |
| `--narrow`  | `min(100% - 6rem, 1040px)` | —       | Narrow container                |

Every full-width section uses `--section`. Hero sections keep their own larger
top padding so the content clears the fixed header — do not unify those.

---

## 4. Custom CSS — paste as-is

`Site Settings → Custom CSS`. This enforces the whole system regardless of what
individual Elementor widgets were set to.

```css
:root {
  /* colour */
  --ink: #082244; /* headings */
  --body: #17385e; /* body text  */
  --muted: #4a6483; /* meta text  */
  --link: #17658f; /* links + accents */
  --green-dark: #237b6d;
  --green: #57bda9;
  --blue: #51ade5;
  --paper: #fbfaf6;
  --warm: #f1eee7;
  --line: #d9ddd8;

  /* type scale — eight steps, nothing between them */
  --fs-1: 0.75rem;
  --fs-2: 0.875rem;
  --fs-3: 1rem;
  --fs-4: 1.125rem;
  --fs-5: clamp(1.15rem, 1.5vw, 1.45rem);
  --fs-6: clamp(1.4rem, 2vw, 1.9rem);
  --fs-7: clamp(1.9rem, 3vw, 2.9rem);
  --fs-8: clamp(3.75rem, 5vw, 4.5rem);

  /* spacing */
  --section: clamp(4rem, 6vw, 6.5rem);
}

body {
  color: var(--body);
  background: var(--paper);
  font-family: "Public Sans", Arial, Helvetica, sans-serif;
  font-size: var(--fs-3);
  line-height: 1.65;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--ink);
  font-family: "Fraunces", Georgia, serif;
  text-wrap: balance; /* stops "one stray word" title lines */
  letter-spacing: -0.03em;
}
h1 {
  font-size: var(--fs-8);
}
h2 {
  font-size: var(--fs-7);
}
h3 {
  font-size: var(--fs-6);
}
h4 {
  font-size: var(--fs-5);
}

p,
li,
figcaption,
blockquote {
  color: var(--body);
  text-wrap: pretty; /* stops a single-word last line */
}

small,
.meta,
figcaption,
.elementor-widget-text-editor small {
  color: var(--muted);
  font-size: var(--fs-1);
}

/* links stay visibly different from body text */
p a,
li a {
  color: var(--link);
  text-underline-offset: 0.18em;
}
p a:hover,
li a:hover {
  color: var(--ink);
}

/* uniform section rhythm — opt in by adding the CSS class "sec" to a section
   in Elementor (Advanced → CSS Classes). Do NOT apply this to every section:
   hero sections need their larger top padding to clear the fixed header. */
.sec {
  padding-block: var(--section);
}
```

### On the 12px minimum

Enforce it by using only the eight tokens above — do not add a blanket
`* { font-size: … }` rule. A universal selector overrides normal inheritance and
breaks the relative sizes (`75%`, `80%`, `inherit`) the layout still relies on.
If you want a check rather than a rule, run this in the browser console on any
page:

```js
[...document.querySelectorAll("*")]
  .filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()),
  )
  .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12)
  .map((el) => el.tagName + "." + el.className);
```

It returns an empty array on all 28 static pages today.

---

## 5. Editorial rules applied to content

- **Capitalisation:** sentence case for every heading. Proper nouns keep their
  capitals — _Fellowship Programme_, _Grants Programme_, _Gift Aid_, place
  names, people's names.
- **Full stops:** no heading ends in a full stop. A full stop _inside_ a heading
  that separates two sentences stays (e.g. _Supporting potential. Strengthening
  community impact_).
- **Multi-line headings:** each visual line is treated as a title line, so
  neither line ends in a full stop.

---

## 6. Not applied — waiting on the client

These were requested but cannot be done from the development side:

- **Copy tightening** (reduce repetition, remove the "AI-generated" feel). Brian
  owns copy; development implements the approved text. Nothing was rewritten.
- **Individual Fellow copy** — being personalised by Perry / Mohammad A. /
  Brian.
- **Photography** — needs Brian's "for in-page elements" folder plus the gallery
  folders and their metadata captions.
- **Search-result removal** — needs Google Search Console access, which may
  still sit with the previous provider.
