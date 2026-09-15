# The Altenburg Foundation — static site

29 plain HTML pages. No build step: open `index.html` in a browser and it works.

## Layout

    index.html, mission.html, …   the 29 pages
    css/site.css                  every style rule, shared by all pages
    js/site.js                    the image-carousel behaviour, shared by all pages
    assets/                       images and fonts

Edit `css/site.css` once and all 29 pages change — that is the point of the
split. Class names say what they are: `founder-story-section`, `value-icon`,
`pathway-grid`.

## History

These pages were exported with the stylesheet and script inlined into every
one of them — 4.97 MB total, each page a single unreadable line. Restructuring
brought that to 0.45 MB by removing three kinds of duplication:

- **The repeated stylesheet.** All 29 copies were byte-identical.
- **Dead rules.** 213 of the 450 classes belonged to an earlier design and no
  page used them. Every class a page uses now has a rule, and every rule is
  used.
- **Two spellings of the same script**, differing only in indentation.

Class names were unminified at the same time (`_founderStorySection_1x577_160`
→ `founder-story-section`). Two components both de-hashed to `fellow-metadata`,
so they were named for their role instead: `fellow-profile-meta` (individual
fellow pages) and `fellow-card-meta` (the listing cards on
`fellowship-programme.html`).

The restructure was verified page by page: identical DOM trees, equivalent CSS
rules, and pixel-identical renders at desktop and phone widths.

## Known issue, inherited

`select-donation.html` links to `usd-donations.html`, which does not exist in
this project. It was already broken before the restructure.
