# SEO Fixer Report

Scanned 48 component/html files.

## Summary
- Files with low word count (<800): 36 (listed below).
- Files with duplicate anchor texts: 1 (notably `src/app/home/home.component.html`).
- H1 content suggestions: none (static H1s were present; no auto-insert needed except where H1 words weren't found).

## Low word-count files (examples)
- src/app/Allcalculators/algebra-calculator/algebra-calculator.component.html — 455 words
- src/app/Allcalculators/gst-calculator/gst-calculator.component.html — 647 words
- src/app/Allcalculators/sip-calculator/sip-calculator.component.html — 604 words
- src/app/home/home.component.html — 701 words
- src/app/Allcalculators/bmi-calculator/bmi-calculator.html — 381 words
- src/app/blog/blog.component.html — 2 words
- src/app/financial/financial.component.html — 3 words
- src/app/header/header.component.html — 6 words

(Full list is in `tools/seo-report.json`.)

## Duplicate anchors
- `src/app/home/home.component.html` contains repeated anchor texts (e.g. "🏠 mortgage", "🧾 gst", many entries using `use {{ card.title }}` repeated). These should be made unique or consolidated into a single anchor per target.

## Recommended actions
1. Review and expand page content to ~800 words on key calculator pages where useful (add explanatory paragraphs, examples, usage tips). Avoid adding thin or repetitive filler.
2. Replace repeated anchor texts in `src/app/home/home.component.html` with unique, descriptive anchor text or use `aria-label` for accessibility while keeping visible text unique.
3. Optionally run the automated fix with `npm run fix-seo` to insert short H1-related sentences where H1 words are not found (review changes before commit).

## Files
The machine report was written to `tools/seo-report.json` for precise per-file details.

---

Run the fixer in dry-run to re-check after edits:

```bash
npm run fix-seo:dry
```

Apply suggested edits (writes files):

```bash
npm run fix-seo
```
