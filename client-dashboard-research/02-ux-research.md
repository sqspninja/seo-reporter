# UX Research: Monthly Client Dashboard for a Squarespace Freelancer

**Audience:** small-business owners (non-technical).
**Sources:** GA4, Google Search Console, SEO Space.
**Surface:** unstyled HTML embedded inside a Squarespace site (Code Block / iframe).
**Focus of this report:** structure, hierarchy, storytelling, and interaction patterns — *not* visual styling.

---

## 1. Information architecture for non-technical client reports

The pattern that shows up consistently across MetricsWatch, Reportr, AgencyAnalytics, DashThis, Swydo, Hashmeta, and Looker Studio templates is what MetricsWatch calls the **"movie trailer" structure**: open with the headline, then show the supporting scenes, then end with what happens next.

The proven top-to-bottom order for a monthly client report is:

1. **Header / report meta** — client name, reporting period ("April 2026"), comparison period.
2. **Executive summary (BLUF)** — one paragraph: traffic direction + key win + priority for next month. ([MetricsWatch](https://www.metricswatch.com/blog/seo-monthly-reporting-format), [Wikipedia BLUF](https://en.wikipedia.org/wiki/BLUF_(communication)))
3. **Headline KPIs** — 4–6 top-line numbers with MoM and YoY comparison (visibility, traffic, engagement, conversions).
4. **Organic visibility (Search Console)** — are we showing up more in search?
5. **Traffic (GA4)** — are people actually arriving?
6. **Engagement & behavior (GA4)** — what do they do once they're here?
7. **Conversions / goals (GA4)** — is it producing the business outcome?
8. **Rankings & SEO health (SEO Space)** — keyword movement + audit score.
9. **What we did this month** — work log, in plain English.
10. **What to do next** — prioritized recommendations.
11. **Historical access** — link or expander to prior months.
12. **Glossary / footer** — definitions, data sources, "what these numbers mean".

Reportr and MetricsWatch recommend keeping the readable narrative to ~6–8 "screens" of content and pushing deep tables into an expandable appendix. AgencyAnalytics organizes templates *by job-to-be-done* (executive summary template vs. account-manager template vs. specialist template) — the implication is that the **top of the dashboard should serve the executive who only reads the first screen**, and depth is layered below for the curious reader. ([AgencyAnalytics](https://agencyanalytics.com/templates/reports/monthly), [Reportr](https://reportr.agency/blog/seo-monthly-report-template))

DashThis adds two practical hierarchy rules that translate well to HTML:
- **Headers per section** so clients can scan and know what each block is about.
- **Leading metric on the left** — readers scan left-to-right; put the most important number first in every row. ([DashThis](https://dashthis.com/blog/what-to-include-in-your-monthly-marketing-report/))

---

## 2. The narrative arc — section order and the question each section answers

Frame each section as a plain-language question the client would actually ask. This is the storytelling spine for the wireframe:

| # | Section | Question it answers | Source |
|---|---|---|---|
| 1 | Header | "Which month am I looking at?" | — |
| 2 | Executive Summary | "In one sentence — how did we do?" | All |
| 3 | Headline KPIs | "What are the four numbers I should care about?" | GA4 + GSC + SEO Space |
| 4 | Visibility | "Are more people seeing us in Google?" | GSC |
| 5 | Traffic | "Are more people coming to the site?" | GA4 |
| 6 | Engagement | "Are visitors paying attention or bouncing?" | GA4 |
| 7 | Conversions | "Is any of this turning into business?" | GA4 |
| 8 | Rankings | "Are we moving up for the searches that matter?" | SEO Space + GSC |
| 9 | SEO Health | "Is the site itself in good shape?" | SEO Space |
| 10 | What we did | "What did you actually work on this month?" | Freelancer log |
| 11 | What to do next | "So what should we do now?" | Freelancer recommendations |
| 12 | History | "How does this compare to past months?" | Archive |

The arc is **outcome → cause → action**: start with the result the owner cares about (leads, sales, traffic), then explain what produced it, then say what to do next. The Animalz BLUF guidance and Reportr's template both reinforce this inverted-pyramid logic — a busy reader can stop at any point and still walk away with something useful. ([Animalz](https://www.animalz.co/blog/bottom-line-up-front), [Reportr](https://reportr.agency/blog/seo-monthly-report-format))

A second principle from agencyanalytics: **every number needs a one-sentence interpretation**. Raw numbers are noise; insights are the product. The narrative arc is enforced *inside each section* by always pairing a number with a sentence that tells the reader what it means. ([AgencyAnalytics](https://agencyanalytics.com/blog/client-reporting-data-overload))

---

## 3. Patterns for explaining jargon inline

Searches across UX Design World, UXPin, NN/g, and PatternFly converge on a clear principle: **if the user needs the information to understand the page, do not hide it behind a hover.** Tooltips are for supplementary, non-essential detail; jargon definitions on a dashboard are essential.

Patterns ranked best-to-worst for this audience:

1. **Plain-language caption directly under the number** ("Impressions — how many times your site appeared in Google search results"). Always visible. Zero interaction cost. Works on mobile. Works for screen readers. This is the strongest pattern for a non-technical audience.
2. **Dotted-underline term with hover/tap popover** (PatternFly's "contextual help" pattern, used by Wikipedia, Document360, many design systems). Good for *secondary* terms inside a paragraph where a caption would feel heavy. Requires a tap-friendly fallback on mobile.
3. **"What this means →" expand toggle** (`<details>`/`<summary>`). Progressive disclosure — clean default view, full definition one click away. Great for accessibility because native `<details>` is keyboard- and screen-reader-friendly out of the box.
4. **Inline parenthetical** ("CTR (the % of people who saw you in Google and clicked)"). Cheap, but clutters the headline.
5. **Glossary at the bottom of the page** as a definition list. Useful as a fallback, weak as a primary pattern because it requires the reader to leave their place.
6. **Pure tooltip (no inline cue)** — *avoid*. Invisible affordance, breaks on touch, inaccessible to screen readers without ARIA work, and tooltips on mobile frequently cover the very data they describe. ([UXPin](https://www.uxpin.com/studio/blog/what-is-a-tooltip-in-ui-ux/), [Cieden](https://cieden.com/book/atoms/tooltip/tooltip-ux-issues))

**Recommendation: a two-pattern system.**
- **Primary:** plain-language caption under every KPI number and every chart title. Always visible. Mobile-safe. Accessible by default. (See UXPin and Pencil & Paper dashboard guidance.)
- **Fallback for in-paragraph jargon:** dotted-underline term using `<abbr title="...">` or a small `<details>` element. Native HTML, no JavaScript needed, keyboard-accessible, works inside an iframe with no extra dependencies.
- Plus a glossary list pinned at the very bottom for anyone who wants the full reference.

([UX Design World](https://uxdworld.com/tooltip-guidelines/), [PatternFly](https://www.patternfly.org/components/description-list/design-guidelines/), [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/))

---

## 4. MoM and YoY comparison patterns

Hashbuilds, Holistics, InterWorks, and the Smashing Magazine 2025 dashboards piece converge on a small set of patterns. Pros and cons for a non-technical audience:

| Pattern | Pros | Cons | Verdict for this audience |
|---|---|---|---|
| Bare number ("1,240") | Honest | Tells you nothing about change | Insufficient on its own |
| Number + arrow icon (▲ / ▼ / —) | Instant directional read | Direction without magnitude | Good as a *signal*, not the whole story |
| Number + signed % change ("+12%") | Magnitude is explicit | "+12%" of *what?* without context | Strong, needs comparison label |
| Color-coded badge ("+12%" green / "-3%" red) | Pre-attentive — scannable in a glance | Red/green only fails for ~8% of men (color blindness); "down" isn't always bad (e.g., bounce rate dropping is good) | Use color *with* an icon and label, never alone |
| Sparkline | Shows shape of the trend, not just two points | Adds visual complexity; harder for non-technical eye | Optional secondary element |
| Side-by-side bars | Direct comparison | Eats vertical space; overkill for KPI tiles | Reserve for "this month vs same month last year" detail blocks |
| "This month / last month / +12%" three-cell row | Self-documenting; shows the actual numbers and the change | Slightly more space | **Strongest for this audience** |

**Recommendation for the wireframe:**

For each KPI tile, show a **three-line block**:

```
1,240 visits          ← the current number, large
+12% vs April 2025    ← signed delta, with explicit comparison label
+4% vs last month     ← second comparison, smaller
```

- Use an icon (▲ / ▼ / —) *and* a sign (+/−) *and* a color — three redundant cues so no single channel (color, shape, sign) has to carry the meaning alone. (Smashing Magazine 2025, Hashbuilds.)
- **Always spell out the comparison period** ("vs April 2025", "vs last month") — never just a naked "+12%". Hashbuilds calls "missing context" one of the top comparison-dashboard failures.
- For "good vs bad" semantics where down is good (bounce rate, average position in search where lower = better), invert the color logic and **say so in the caption** ("lower is better"). InterWorks and Holistics both flag this as a frequent confusion point. ([Holistics](https://docs.holistics.io/docs/period-comparison), [Hashbuilds](https://www.hashbuilds.com/patterns/what-is-a-comparison-dashboard))

A **sparkline next to the number** showing the last 12 months is a strong secondary element — it lets the reader see the *shape* of the trend without needing a separate chart, and it doubles as the entry point to the "historical data" section (see §5). ([PatternFly Sparkline](https://www.patternfly.org/v3/pattern-library/data-visualization/sparkline/index.html), [Smashing](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/))

---

## 5. Historical data access patterns

The dashboard cannot show every past month at once without becoming a data dump (§8). Common patterns:

| Pattern | Strengths | Weaknesses |
|---|---|---|
| Month dropdown (select another month → reload) | Familiar; clean | Forces a page reload; loses current context |
| Side-by-side comparison ("compare to: April 2025") | Powerful | Doubles the cognitive load |
| Sparkline per KPI (12-month trend inline) | Lightweight; always-on; no interaction | Doesn't expose exact numbers |
| Collapsible "Previous reports" archive list | Out of the way; works in plain HTML; one click to dig in | Each prior month is a separate page-load |
| Single "trends" section at the bottom with one chart per KPI | Concentrates history in one place | Adds another big section to scroll past |

**Recommendation — layered approach, all in plain HTML:**

1. **Always-on 12-month sparkline** inside each KPI tile, with the latest dot accented. Gives the reader a free trend-at-a-glance without any interaction. (Inforiver, PatternFly, Smashing.)
2. **Single "Trends over time" section** near the bottom showing a 12-month bar/line chart per top KPI (visits, conversions, clicks, average position). Plain HTML can do this with `<svg>` or even CSS bars — no library required for the wireframe.
3. **Collapsible "Previous monthly reports" list** at the very bottom — a `<details>` element containing links to past report URLs. Familiar pattern, native HTML, accessible. Squarespace pages can host each past report as its own URL.

This three-layer approach (sparkline → trend chart → archive link) maps cleanly onto progressive disclosure: glance-level, scan-level, drill-level. ([NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [Smashing](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/))

---

## 6. The "what to do next" section

Across Swydo, AgencyHandy, AgencyAnalytics, Dovetail, and FasterCapital, the strongest recurring guidance is:

1. **Separate quick wins from longer-term plays.** Quick win = high impact, low effort, can be done this month. Long-term = bigger lift, multi-month payoff. (Swydo, AgencyHandy.)
2. **Prioritize using an impact × effort matrix** — surface the high-impact / low-effort items first. (FasterCapital.)
3. **Cap the list** — Pareto: the 3–5 things that will move the needle, not a 20-item to-do dump.
4. **Each recommendation has four parts**: what to do, why (tied to a number elsewhere in the report), who owns it, and an estimated impact or timeline.
5. **Tag the owner** — "Freelancer (me)" vs. "Client (you)" vs. "Both". This is the single most useful pattern for an agency-of-one workflow: it makes the dashboard double as a working agreement.
6. **Use a verb-led, specific sentence** — "Optimize your top 5 landing pages for mobile speed", not "improve SEO". (FasterCapital.)

**Recommendation for the wireframe — a two-block "Next steps" section:**

**Block A: Quick wins (this month)** — 2–4 cards, each:
- Action (verb-led, one line)
- Why (one sentence, references a metric)
- Owner badge: `Me` / `You` / `Both`
- Effort: `S / M / L`

**Block B: Bigger plays (next 1–3 months)** — 1–3 cards in the same shape.

Numbered priority order within each block. Avoid checkbox UI in the wireframe — this is a *report*, not a task tracker; the action belongs in the client's tool of choice (which the freelancer can hand off via email or the freelancer's own PM tool).

([Swydo](https://www.swydo.com/blog/client-reporting-best-practices/), [AgencyHandy](https://www.agencyhandy.com/client-reporting-best-practices/), [FasterCapital](https://fastercapital.com/topics/developing-actionable-recommendations.html))

---

## 7. Embedded-in-Squarespace constraints (brief & practical)

Practical constraints from the Squarespace help docs, Squarespace forum, and 2025 embedded-dashboard guides:

- **Plan gate:** iframes are blocked on the Personal plan. Code Block with JS/iframe needs Core or higher. Worth confirming the client tier before committing to an iframe approach. ([Squarespace Embed Blocks](https://support.squarespace.com/hc/en-us/articles/206543617-Embed-blocks))
- **Code Block size limit:** 400 KB / ~300k characters. Comfortable for an HTML dashboard; tight if heavy charting libraries are inlined. Prefer native SVG and CSS over big JS dependencies.
- **iframe height is the perennial pain point.** Iframes don't auto-grow to content height. Either: (a) host the dashboard as a *page* on the parent site (no iframe), (b) hard-code a height that fits worst case + use internal scrolling, or (c) use a `postMessage` height-sync script. For an unstyled wireframe, ignore the iframe problem entirely — design as a single scrollable HTML page and let the embed mechanism be solved separately.
- **HTTPS only.** Squarespace enforces HTTPS, so any iframe source must be HTTPS. ([Bycrawford](https://bycrawford.com/blog/embed-an-iframe-on-squarespace))
- **Mobile:** Smashing Magazine (2025) flags that mobile browsers zoom into iframes and disable momentum scrolling — the dashboard *must* be designed to behave well as a regular scrollable HTML page first, not as a fixed-aspect-ratio embed.
- **Width:** plan for a roughly 700–760 px content column on desktop inside Squarespace's default layouts, full-width on mobile. Build mobile-first single-column; let multi-column KPI rows collapse to stacked cards under ~600 px.
- **Accessibility:** native HTML elements (`<details>`, `<abbr>`, `<dl>`, semantic headings `<h1>`–`<h3>`) give us most of the a11y story for free. Avoid color-only encoding (§4). Ensure tap targets are ≥44 px on mobile.

([Smashing](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/), [Squarespace Forum: responsive iframe](https://forum.squarespace.com/topic/222822-make-iframe-embedded-code-block-responsive/))

---

## 8. Anti-patterns — explicitly avoid

Pulled from Databox, Decision Foundry, FusionCharts, AgencyAnalytics, MetricsWatch, and Pencil & Paper:

1. **Data dump** — 25+ metrics with no interpretation. Working memory tops out at ~4–7 items; more than that and the reader retains nothing. (Databox)
2. **Naked numbers** — every metric needs a one-sentence "what this means" caption. (AgencyAnalytics, MetricsWatch)
3. **Jargon walls** — "SERP positions improved" instead of "you're showing up higher in Google for the searches that matter". (MetricsWatch)
4. **Pie charts of more than 3 slices** — they're hard to compare; use a bar chart instead. (Pencil & Paper)
5. **No comparison context** — "1,240 visits" without telling the reader if that's good, bad, or normal. (Hashbuilds)
6. **Color as the only signal** — red/green-only badges fail for color-blind users and when "down" is good. (Smashing, UXPin)
7. **Tooltips holding essential info** — invisible to mobile, screen readers, and anyone skimming. (UXPin, Cieden)
8. **A wall of charts with no story** — "show what changed, not everything that exists". (Decision Foundry)
9. **No clear next step** — without a "what now" section the report feels like an autopsy. (Swydo)
10. **Identical metrics every month with no narrative** — the executive summary should be rewritten each month, even if the layout doesn't change.

([Databox](https://databox.com/bad-dashboard-examples), [Decision Foundry](https://www.decisionfoundry.com/misc/articles/ten-mistakes-that-kill-dashboard-adoption/), [FusionCharts](https://www.fusioncharts.com/blog/10-dashboard-design-mistakes/), [Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards))

---

## Recommendations summary — what the wireframe should reflect

**Structure (top to bottom):**
1. Header / month being reported
2. Executive summary (BLUF — one paragraph)
3. Headline KPI row (4 tiles: Visibility, Visits, Engagement, Conversions) — each tile shows current number, +/-% vs last month, +/-% vs same month last year, and a 12-month sparkline
4. Visibility section (GSC)
5. Traffic section (GA4)
6. Engagement section (GA4)
7. Conversions section (GA4)
8. Rankings section (SEO Space + GSC)
9. SEO health section (SEO Space audit)
10. "What I did this month" (work log)
11. "What to do next" — Quick wins block + Bigger plays block, each card tagged Me/You/Both
12. Trends over time (12-month charts)
13. Previous monthly reports (`<details>` archive)
14. Glossary (`<dl>` definition list)

**Mechanics:**
- Plain-language caption under *every* number and chart title.
- Three-redundant-cue change indicators: arrow icon + signed % + color, with explicit comparison label.
- `<details>` / `<summary>` for any progressive disclosure (history, glossary, "what this means").
- Native HTML semantics — `<h1>`–`<h3>`, `<abbr>`, `<dl>`, `<details>` — to inherit accessibility for free.
- Mobile-first single-column layout; KPI row collapses to stack under ~600 px.

---

## Sources

- MetricsWatch — [SEO Monthly Reporting Format That Clients Love](https://www.metricswatch.com/blog/seo-monthly-reporting-format)
- MetricsWatch — [SEO Monthly Report Template](https://www.metricswatch.com/blog/seo-monthly-report-template)
- Reportr — [SEO Monthly Report Format: Complete 2026 Template](https://reportr.agency/blog/seo-monthly-report-format)
- Reportr — [SEO Monthly Report Template: Client Retention Guide](https://reportr.agency/blog/seo-monthly-report-template)
- Hashmeta — [SEO Client Reporting: Templates, Metrics, Best Practices](https://hashmeta.com/blog/seo-client-reporting-templates-metrics-and-best-practices/)
- Inspace — [SEO Client Report: What to Include, Structure, KPIs](https://inspace.io/blog/seo-report-for-client)
- AgencyAnalytics — [Customizable Monthly Report Template](https://agencyanalytics.com/templates/reports/monthly)
- AgencyAnalytics — [Client Reporting Data Overload](https://agencyanalytics.com/blog/client-reporting-data-overload)
- AgencyAnalytics — [20 Client Reporting Tips](https://agencyanalytics.com/blog/client-reporting-tips)
- DashThis — [What to Include in Your Monthly Marketing Report](https://dashthis.com/blog/what-to-include-in-your-monthly-marketing-report/)
- DashThis — [Web Analytics Report Template](https://dashthis.com/web-analytics-report-template/)
- Swydo — [Client Reporting Best Practices 2025](https://www.swydo.com/blog/client-reporting-best-practices/)
- AgencyHandy — [10 Best Practices of Client Reporting 2025](https://www.agencyhandy.com/client-reporting-best-practices/)
- Dataclare — [GA4 Looker Studio Template](https://dataclare.com/google-analytics-4-looker-studio-template/)
- Dashboard Design Lab — [6 Free GA4 Looker Studio Templates](https://dashboarddesignlab.com/blog/ga4-report-templates-looker-studio/)
- KP Playbook — [GA4 Engagement Rate Explained](https://kpplaybook.com/resources/ga4-engagement-rate-diagnose-traffic-quality/)
- Boulder SEO Marketing — [GA4 Metrics That Actually Matter for Business Owners](https://boulderseomarketing.com/ga4-metrics-that-actually-matter/)
- Animalz — [BLUF (Bottom Line Up Front)](https://www.animalz.co/blog/bottom-line-up-front)
- Wikipedia — [BLUF (Communication)](https://en.wikipedia.org/wiki/BLUF_(communication))
- UX Design World — [Tooltip Guidelines](https://uxdworld.com/tooltip-guidelines/)
- UXPin — [What Is a Tooltip? Best Practices (2026)](https://www.uxpin.com/studio/blog/what-is-a-tooltip-in-ui-ux/)
- UXPin — [Dashboard Design Principles 2025](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- Cieden — [Tooltip UX Issues](https://cieden.com/book/atoms/tooltip/tooltip-ux-issues)
- PatternFly — [Description List Design Guidelines](https://www.patternfly.org/components/description-list/design-guidelines/)
- PatternFly — [Sparkline Pattern](https://www.patternfly.org/v3/pattern-library/data-visualization/sparkline/index.html)
- Pencil & Paper — [Dashboard Design UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- Smashing Magazine — [UX Strategies for Real-Time Dashboards (2025)](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/)
- NN/g — [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- Hashbuilds — [What Is a Comparison Dashboard?](https://www.hashbuilds.com/patterns/what-is-a-comparison-dashboard)
- Holistics — [Period-over-Period Comparison](https://docs.holistics.io/docs/period-comparison)
- InterWorks — [Year-over-Year Comparisons in Tableau](https://interworks.com/blog/rteufel/2019/07/11/the-ultimate-guide-to-year-over-year-comparisons-in-tableau/)
- FasterCapital — [Developing Actionable Recommendations](https://fastercapital.com/topics/developing-actionable-recommendations.html)
- Dovetail — [Research Report Recommendations Examples](https://dovetail.com/blog/research-report-recommendations-examples/)
- Databox — [Bad Dashboard Examples](https://databox.com/bad-dashboard-examples)
- Decision Foundry — [10 Mistakes That Kill Dashboard Adoption](https://www.decisionfoundry.com/misc/articles/ten-mistakes-that-kill-dashboard-adoption/)
- FusionCharts — [10 Dashboard Design Errors](https://www.fusioncharts.com/blog/10-dashboard-design-mistakes/)
- SEOSpace — [Squarespace SEO Audit Score](https://www.seospace.co/squarespace-seo-audit-score)
- SEOSpace — [Squarespace SEO Plugin and Tools](https://www.seospace.co/)
- Squarespace — [Embed Blocks Help](https://support.squarespace.com/hc/en-us/articles/206543617-Embed-blocks)
- Squarespace Forum — [Responsive Iframe Embedded Code Block](https://forum.squarespace.com/topic/222822-make-iframe-embedded-code-block-responsive/)
- ByCrawford — [Embed an iFrame on Squarespace](https://bycrawford.com/blog/embed-an-iframe-on-squarespace)
