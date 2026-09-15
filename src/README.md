# Readable source

A restructured copy of the 29 pages in the folder above. Same site, same
rendering — the markup is just legible now.

## Layout

    src/
      *.html          29 pages, indented, one element per line
      css/site.css    every style rule, shared by all pages
      js/site.js      the image-carousel behaviour, shared by all pages

Images and fonts still live in `../assets/`; nothing there was touched.

## What changed

| | before | after |
|---|---|---|
| total size | 4.97 MB | 0.46 MB |
| a page, e.g. `index.html` | 171 KB, 2 real lines | 11 KB, 194 lines |
| stylesheet | 157 KB inlined into every page | one 108 KB file |
| script | inlined into every page | one file |
| class names | `_founderStorySection_1x577_160` | `founder-story-section` |

Three things were removed or merged:

- **The duplicated stylesheet.** All 29 copies were byte-identical.
- **Dead rules.** 213 of the 450 classes in the stylesheet belonged to an
  earlier design and no page used them. After removing them, every class that
  a page uses has a rule, and every rule is used.
- **Two spellings of the same script.** The only difference was indentation.

Two components both de-hashed to `fellow-metadata`, so they were named for
their role instead: `fellow-profile-meta` (individual fellow pages) and
`fellow-card-meta` (the listing cards on `fellowship-programme.html`).

## Editing

Edit `css/site.css` once and all 29 pages change — that is the point of the
split. The pages themselves are plain HTML with no build step: open one in a
browser and it works.

## Known issue, inherited

`select-donation.html` links to `usd-donations.html`, which does not exist in
this project. It was already broken before the restructure.
