# Dashboard Design Spec — Synthesis

This is the single source of truth for the wireframe in `dashboard-wireframe.html`. It merges the metrics research (`01-metrics-research.md`) and the UX research (`02-ux-research.md`) into one plan.

If you only read one document, read this one.

---

## The thesis in one paragraph

A non-technical small-business client wants three answers, in this order: **(1) did more of the right people find me, (2) what did they do when they got here, and (3) what are you doing about it next month?** Everything else is supporting evidence. The dashboard reads top-to-bottom like a short news story — headline first, supporting detail in the middle, "what to do next" at the bottom, reference material at the very bottom. Every number is paired with a one-sentence plain-English caption. Every comparison is labelled with the actual period being compared ("vs April 2025"), never a naked "+12%".

---

## Section order (top to bottom)

| # | Section | Plain-language question it answers | Source |
|---|---|---|---|
| 1 | Header | "Which month am I looking at?" | meta |
| 2 | Executive summary | "In one sentence — how did we do?" | hand-written |
| 3 | Headline KPI row (4 tiles) | "What are the four numbers I should care about?" | GA4 + GSC |
| 4 | Visibility on Google | "Are more people seeing us in search?" | GSC |
| 5 | Where visitors came from | "How are people finding the site?" | GA4 channels |
| 6 | What visitors did | "Did they stick around or leave?" | GA4 engagement |
| 7 | Inquiries & conversions | "Did any of this turn into business?" | GA4 key events |
| 8 | Keywords we're tracking | "Are we climbing for the searches that matter?" | SEO Space + GSC |
| 9 | SEO site health | "Is the site itself in good shape?" | SEO Space audit |
| 10 | What I worked on this month | "What did you actually do?" | freelancer log |
| 11 | What we should do next | "So what now?" | freelancer recs |
| 12 | Trends over the last 12 months | "How does this fit the bigger picture?" | rolled-up history |
| 13 | Previous monthly reports | "Where do I find older reports?" | archive links |
| 14 | What these words mean (glossary) | "What does this term mean?" | glossary |

Sections 12–14 are collapsed by default (`<details>`).

---

## Display rules that apply everywhere

1. **Every number has a caption.** Directly under the number, in plain English. Never make the client hover to learn what something is.
2. **Every comparison has a label.** Show "+12% vs April 2025", not "+12%". Spell out the period.
3. **Three redundant cues for change.** Arrow icon (▲/▼/—) + signed percentage (+/−) + color. Never color alone. Caption clarifies when "down is good" (e.g., average search position).
4. **One-sentence interpretation under every chart or table.** "Most of your traffic this month came from Google search — a healthy sign for an SEO-focused site."
5. **Jargon gets the dotted-underline treatment** (`<abbr title="…">`) so any unfamiliar term has a tap/hover definition, and the full glossary is at the bottom.
6. **Mobile-first single column.** KPI row stacks under ~600 px. Native HTML semantics throughout (`<section>`, `<details>`, `<dl>`, `<abbr>`).

---

## KPI tile pattern (used in section 3)

Each tile shows:

```
[Metric name]
[Big number]
[One-sentence plain caption]
▲ +12% vs April 2025  (YoY)
▲ +4%  vs last month   (MoM)
[12-month sparkline placeholder]
```

Four tiles: **Visitors**, **Inquiries**, **Google clicks**, **SEO Health Score**.

These four cover all three core questions in one row.

---

## Two non-obvious 2025/2026 calibrations baked in

- **AI Overviews context.** When impressions go up but clicks go flat, the dashboard must explain *why*. There's a dedicated callout in the Visibility section for the month the freelancer flags `ai_overview_observed_flag = true` in the sheet.
- **Engagement Rate, not Bounce Rate.** GA4 has retired bounce rate. The glossary explicitly calls out the flip ("higher is better, opposite of bounce rate") because clients may have seen the old metric in past reports.

---

## "What we should do next" pattern (section 11)

Two blocks:

- **Quick wins (this month)** — 2–4 cards
- **Bigger plays (next 1–3 months)** — 1–3 cards

Each card has four parts:
- **What** — verb-led one-line action
- **Why** — references a specific number elsewhere in the dashboard
- **Who** — owner badge: `Me` (freelancer), `You` (client), or `Both`
- **Effort** — `S` / `M` / `L`

No checkboxes. This is a report, not a task tracker.

---

## Historical data — three layers

1. **Always-on 12-month sparkline** inside each KPI tile (glance)
2. **Trends-over-time section** with one mini chart per top KPI (scan)
3. **Collapsible archive list** of past monthly report URLs (drill)

---

## Data layer (Google Sheet tabs)

Full column definitions are in `01-metrics-research.md` §6. New / extended tabs:

- `dashboard_headline` *(NEW)* — drives section 2 and the KPI row
- `ga4_monthly_summary` (extend) — sections 5–7
- `ga4_traffic_sources` (extend) — section 5
- `ga4_landing_pages` (extend) — section 6
- `gsc_monthly_summary` (extend) — section 4
- `gsc_queries` (extend) — section 4
- `gsc_pages` (extend) — section 4
- `seospace_audit_summary` *(NEW)* — section 9
- `seospace_issues` *(NEW)* — sections 9, 10, 11
- `seospace_keywords` *(NEW)* — section 8
- `seospace_page_scores` *(NEW)* — section 9
- `tasks` (extend) — sections 10 and 11
- `glossary` *(NEW)* — section 14 tooltips

**Critical design principle:** every MoM and YoY value is **precomputed in the sheet**, not in the dashboard. The dashboard reads numbers, it never calculates. This keeps the embed lightweight and the data layer auditable.

The single most important field in the whole workbook is `headline_sentence` in `dashboard_headline` — the line the client reads first and remembers.

---

## Anti-patterns to actively avoid

Drawn from §8 of the UX research. Surfaced here because they're easy to slide into when filling content:

1. Data dumps — cap each section's tables at 5–10 rows.
2. Naked numbers — every number gets a sentence.
3. Jargon walls — translate every search/analytics term.
4. Pie charts with >3 slices — use bars.
5. Color-only signals — always pair with icon and sign.
6. Tooltips holding essential info — captions, not tooltips, for primary meaning.
7. No "what now" — every report ends with action.
8. Same boilerplate every month — `headline_sentence` and the next-steps cards must be rewritten each cycle.

---

## Embedded-in-Squarespace notes (practical, not part of the wireframe)

For Jay's later implementation reference, not the wireframe itself:

- Code Block / iframe requires Squarespace **Core plan or higher**.
- Code Block limit: ~400 KB / 300k characters → keep dependencies thin.
- Iframe auto-height is hard. Two cleaner options: host as a regular Squarespace page (best), or use `postMessage` height-sync.
- HTTPS only.
- Mobile-first: design as a normal scrollable page, not a fixed embed.

---

## What the wireframe is and isn't

**Is:** semantic HTML with realistic placeholder data, comments noting which sheet column drives each value, and the full top-to-bottom narrative.

**Isn't:** styled. No CSS framework, no design polish, no JS. It's a structural skeleton for review and for future styling/coding.
