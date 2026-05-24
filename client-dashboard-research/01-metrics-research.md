# Monthly Client Dashboard — Metrics & Content Research

**Audience:** non-technical small-business owners (Squarespace clients on an ongoing site-care + SEO + content retainer)
**Data sources:** Google Analytics 4 (GA4), Google Search Console (GSC), SEO Space
**Use case:** monthly performance dashboard embedded inside the client's Squarespace site, with MoM and YoY comparison
**Research date:** May 2026

---

## 0. Executive summary for the design team

Small-business clients do not want analytics — they want answers to three questions:

1. **Did more of the right people find me?** (visibility + traffic quality)
2. **What did they do when they got here?** (engagement + key events)
3. **What are you doing about it next month?** (action plan)

Every metric we ship has to map to one of those three questions. Anything that doesn't is a vanity number and gets cut or buried. The dashboard should read top-to-bottom like a short story — headline number → where it came from → what they did → what's next — not like a spreadsheet.

Two non-obvious 2025/2026 calibration points the design team needs to bake in:

- **AI Overviews have crushed CTRs.** Position 1 CTR fell roughly 32% YoY in 2025; some studies show a 58% CTR drop on top-ranked pages when AIOs are present. A client whose impressions are up and clicks are flat is *probably winning* — we have to design for explaining that, not papering over it.
- **GA4 "Engagement Rate" replaces Bounce Rate.** Higher engagement rate = good (opposite of bounce rate). Many clients will have seen old bounce-rate language in past reports; the dashboard glossary must explicitly call this out.

---

## 1. Top metrics that actually matter

Each tier corresponds to a section of the dashboard. Within each source, metrics are ranked by how much they actually answer a small-business owner's questions.

### 1A. From GA4 (the "what's happening on your site" layer)

| Rank | Metric | Plain-English one-liner | Why a non-technical client cares | "Good" looks like | Best display | Action? |
|---|---|---|---|---|---|---|
| 1 | **Key Events (conversions)** | The number of times someone did something valuable on your site — booked a call, filled a form, signed up. | This is the only GA4 number directly tied to revenue. Everything else feeds this. | Trending up MoM/YoY; any non-zero number on a small site is a win. Set a per-client target. | Big number + MoM/YoY delta + 12-month trend line | **Actionable** — drives next-month CTAs |
| 2 | **Total Users (with returning-user split)** | How many different people visited your site this month, and how many had been here before. | Tells them whether the audience is growing AND whether people are coming back. | New users growth >0% MoM; returning users 20-40% of total is healthy for service sites. | Single number + split donut + trend line | Informational, but powers narrative |
| 3 | **Sessions** | How many separate visits happened this month (one person can visit multiple times). | Volume signal. Pairs with users to show "are we getting more people, or the same people more often?" | Roughly 1.2-1.5x of users on service sites. | Trend line with MoM/YoY | Informational |
| 4 | **Engagement Rate** | The % of visits where someone actually paid attention (stayed >10s, viewed more than one page, or triggered an event). | Replaces the old "bounce rate." Tells them whether the traffic is the *right* traffic. | 50-60%+ for SMB service sites. B2B median ~63%, B2C ~71%. Below 40% = traffic/content mismatch. | Single % + benchmark bar + trend | **Actionable** — flags content fit |
| 5 | **Traffic by Channel** (Organic, Direct, Referral, Social, Email) | Where your visitors came from — Google search, typing your URL, another website, social media, or an email. | Tells them which marketing channel is paying off. Single most useful slide for "should we invest more in X?" | Organic 40-60% of traffic for established SMB sites; high "Direct" can mean brand strength OR tracking issues. | Stacked bar (this month) + small-multiples by month | **Actionable** — drives channel mix |
| 6 | **Top Landing Pages by Sessions + Engagement** | The pages people land on first when they arrive — and how interested they were. | Tells them which pages are the front door, and whether those pages are working. | Top 5 pages = >50% of traffic is typical; a service page in the top 3 is a great sign. | Sortable table (page, sessions, engagement rate, key events) | **Actionable** — flags pages to improve |
| 7 | **Average Engagement Time per Session** | How long the average person spent actively using your site. | Sanity-check on content quality. Long enough to read = content works. | 45 seconds to 2 minutes for service sites. >3 minutes on a blog = great. | Single number + trend | Informational |
| 8 | **Conversion Rate by Channel** | Of the people who came from each source, what % completed a key event. | Tells them which channels send buyers vs. which send tire-kickers. | Highly variable; trend matters more than absolute. Aim for organic CR ≥ site average. | Bar chart per channel | **Actionable** |

**Deliberately excluded from the top layer** (kept as drill-down or removed): Page Views (vanity — see §2), Sessions per User (too abstract), New vs Returning ratio as a standalone metric (folded into #2), Demographics (rarely actionable for SMB service businesses).

### 1B. From Google Search Console (the "are you findable on Google" layer)

| Rank | Metric | Plain-English one-liner | Why a non-technical client cares | "Good" looks like | Best display | Action? |
|---|---|---|---|---|---|---|
| 1 | **Clicks** | How many people clicked through to your site from a Google search result. | Direct measure of SEO paying off in actual visits. | Trend up MoM/YoY. For a new SMB site, single-digits → double-digits → triple-digits is the natural ramp. | Big number + MoM/YoY delta + trend | **Actionable** |
| 2 | **Impressions** | How many times your site showed up in someone's Google search results — whether they clicked or not. | "Visibility." Even without a click, every impression is a brand exposure. *Important 2026 context: AI Overviews can drive impressions up while clicks stay flat — that's not a failure.* | Trend up; should usually grow faster than clicks. | Trend line + MoM/YoY | Informational |
| 3 | **Average Position** | Roughly where your site shows up on the Google results page (1 = top of page 1). | The simplest "are we climbing the rankings?" number. | Position 1-3 = top of page 1 (great). 4-10 = page 1. 11-20 = page 2. <20 means people are unlikely to see you. | Single number + trend (note: **lower is better** — flag this in the UI) | **Actionable** |
| 4 | **CTR (Click-Through Rate)** | Of the people who saw you in Google, what % actually clicked. | Tells them whether their title and description are pulling people in. | Position 1: 35-45% historically, but AI Overviews can drop this dramatically. Position 5: 6-8%. Anything well below position-CTR benchmark = rewrite the page title. | % + trend + benchmark hint | **Actionable** — drives title/description rewrites |
| 5 | **Top Queries** | The actual phrases people are typing into Google when your site shows up. | Goldmine. Shows what the market is actually searching for — often surprises the client. | A healthy mix of branded ("[business name]") and non-branded queries. >50% branded = SEO has more headroom. | Table: query, impressions, clicks, CTR, position | **Actionable** — content + page-title fuel |
| 6 | **Top Pages (GSC view)** | The pages on your site that are bringing in Google traffic. | Pairs with GA4 landing pages to confirm "the pages we optimized are the ones getting search clicks." | Service pages and blog posts in the top 5. | Table: page, impressions, clicks, CTR, position | **Actionable** |
| 7 | **Indexed Pages / Coverage** | How many of your pages Google has actually catalogued and is willing to show. | If a page isn't indexed, it can't get found. Catches "ghost" pages and indexing bugs. | All intentional pages indexed; ≤5% exclusions for legit reasons (tags, thank-you pages). | Single number + warning if it drops MoM | **Actionable** when broken |

**Deliberately excluded from the top layer:** Core Web Vitals as a top-level metric (too technical — surface only when failing), Mobile Usability as separate metric (overlaps with CWV), individual query position fluctuations (noise).

### 1C. From SEO Space (the "what's left to fix" layer)

SEO Space is unique in this stack because it produces a **prescriptive task list**, not just observation data. That's a huge gift for a non-technical client dashboard — it converts directly into "Here's what we're doing next month."

| Rank | Metric | Plain-English one-liner | Why a non-technical client cares | "Good" looks like | Best display | Action? |
|---|---|---|---|---|---|---|
| 1 | **Overall SEO Audit Score** | A single 0-100 score for how well your Squarespace site follows SEO best practices. | One headline number anyone can grasp. Trends are way more useful than the raw value. | 70+ for a maintained site. New sites often start in the 40s. | Big number + trend line + gauge | **Actionable** — score drives task list |
| 2 | **Critical Issues Count** | How many serious SEO problems SEO Space found that we should fix first. | Tells the client what's actively hurting them. | Trending down; ideally 0 critical, ≤5 warnings. | Number with red/yellow/green status + change since last month | **Actionable** — directly populates the next-steps section |
| 3 | **Tracked Keyword Rankings** | The list of phrases we want to rank for, and what position each one is in Google this week. | Shows progress on the specific phrases the client cares about. | Movement *toward* page 1. Average position improving MoM. | Table with sparkline per keyword (this month vs last month vs 90 days ago) | **Actionable** |
| 4 | **Keywords on Page 1 (top 10)** | Of all the phrases we're tracking, how many are now on the first page of Google. | Simple, motivating progress metric. | Number goes up over time. Even 1 → 2 is a real win to celebrate. | Big number + MoM delta | Informational + morale |
| 5 | **Page-Level SEO Scores** | An SEO score for each individual page, so we know which pages need attention next. | Tells the client "your About page is great, but your top service page needs love." | Service pages and homepage 80+. Blog posts 70+. | Sortable table | **Actionable** — feeds the to-do list |
| 6 | **Newly Resolved Issues This Month** | The SEO problems we actually fixed since last month's report. | Tangible proof of work done. **The single best client-retention metric in the entire dashboard.** | Always >0 if we're earning the retainer. | List/checklist | Receipt-of-work — show prominently |

---

## 2. Vanity vs. actionable: what to swap

Each of these "feels good" metrics gets called out *only* because clients have probably seen them in a past report and will ask.

| Vanity metric (cut or demote) | Why it misleads non-technical clients | Swap for |
|---|---|---|
| **Page Views** as a headline | Inflated by single users refreshing; says nothing about whether visits were good. | **Engagement Rate** + **Sessions** |
| **Bounce Rate** (GA4 still surfaces it) | Inverted logic confuses clients (high bounce = bad). Misleading for single-page service sites where the contact info IS the homepage. | **Engagement Rate** (already the GA4 default) |
| **Total Impressions** standalone | Big numbers feel like progress but can grow purely from ranking on irrelevant queries (or AI Overviews showing your snippet without sending clicks). | **Impressions paired with Clicks and CTR**, or **Impressions for branded queries only** |
| **Total Backlinks count** | Quantity-over-quality trap. 200 spam links can hurt; 2 great links can transform rankings. | **Referring domains added/lost this month** + a manual note about quality |
| **Keyword count "ranking for"** | "We rank for 1,400 keywords!" — most are page 50 for things no one searches. | **Keywords on page 1 (top 10)** and **Keywords in top 3** |
| **Average Session Duration** (GA4 legacy) | Includes idle time; doesn't equal attention. | **Average Engagement Time** (only counts active focus) |
| **Time on Page** as engagement proof | Exit-page time is uncounted, skewing numbers. | **Engagement Rate + Key Events on that page** |
| **Domain Authority / spammy "SEO score"** from third-party tools | Not a Google metric. Clients overweight it. | **GSC average position + clicks trend** (the actual Google view) |
| **Social shares / follower count** | Almost zero correlation with website outcomes for service SMBs. | **Social channel sessions + conversion rate from social** |
| **Raw "Direct" traffic** | Often misattributed traffic (dark social, untracked links) reported as a brand win. | **Direct minus known sources** + note about attribution caveats |

---

## 3. Plain-English jargon glossary

These definitions are intended to be displayed *inside* the dashboard as tooltip text or a "What does this mean?" expandable. Each one is two sentences max, written for a small-business owner.

### Traffic & visitors (GA4)

- **Users** — The number of different people who visited your site this month. One person who comes back three times still counts as one user.
- **New users** — People visiting your site for the first time ever (on this device/browser).
- **Returning users** — People who've been here before and came back. A good sign your site or brand stuck with them.
- **Sessions** — A single visit to your site. One person can have several sessions a month — think of it like store visits, not unique customers.
- **Engagement rate** — The percentage of visits where someone actually stuck around — at least 10 seconds, multiple pages, or doing something on the site. Higher is better. *(This replaced the older "bounce rate," which worked the opposite way.)*
- **Bounce rate (legacy)** — The opposite of engagement rate: the % of visits where someone left almost immediately. Lower is better. *(GA4 quietly de-emphasizes this in favor of engagement rate.)*
- **Average engagement time** — How long the typical visitor was actively focused on your site (not just idle in a tab).
- **Key event / conversion** — A specific action you care about — a form submission, a phone tap, a booking, a newsletter signup. The whole point of the site, in metric form.
- **Conversion rate** — Of all the people who visited, what percentage completed a key event. Like a "closing rate" for your website.
- **Landing page** — The first page someone lands on when they arrive at your site. Often *not* the homepage.

### Where visitors come from (GA4 + GSC)

- **Organic search / Organic traffic** — Visitors who found you by searching on Google (or Bing) and clicked a regular, non-ad result. This is what SEO grows.
- **Direct traffic** — Visitors who typed your URL or used a bookmark — or, often, clicked a link from a place we can't track (a text message, a PDF, some apps). Usually a mix of "knows the brand" and "unknown source."
- **Referral traffic** — Visitors who clicked a link to you from another website (not a search engine, not social media).
- **Social traffic** — Visitors who clicked through from Instagram, Facebook, LinkedIn, etc.
- **Email traffic** — Visitors who clicked a link from an email campaign.
- **Channel** — A category of where visitors came from (Organic, Direct, Referral, Social, Email, Paid).

### Search performance (GSC)

- **Impression** — One time your site appeared in a Google search result. Even if no one clicked, it counted as exposure.
- **Click** — Someone saw you in Google and clicked through to your site.
- **Click-through rate (CTR)** — Of the people who saw you in Google, the percentage who actually clicked. (Clicks ÷ impressions.) Like a baseball batting average for your search listing.
- **Average position** — Roughly where your site shows up on the Google results page. **Lower is better** — position 1 is the top result, position 11 means you're on page 2.
- **Query** — The actual words someone typed into Google when your site showed up.
- **Branded query** — A search that includes your business name. These are people who already know you.
- **Non-branded query** — A search that doesn't mention your business name. These are strangers — the audience SEO is trying to reach.
- **Indexed pages** — How many of your pages Google has on file and is willing to show in search results. If a page isn't indexed, it cannot appear in Google.
- **AI Overview** — Google's AI-generated answer that sometimes appears at the top of search results. It can reduce clicks even when you rank well, because the user got their answer without visiting your site.

### SEO health (SEO Space + general)

- **SEO audit score** — A 0-100 grade for how well your site follows search engine best practices. Trend matters more than the absolute number.
- **Critical issue** — A problem flagged by SEO Space that is actively hurting your rankings and should be fixed first.
- **Warning** — A smaller issue worth fixing but not urgent.
- **Tracked keyword** — A specific search phrase we're monitoring to see your ranking on Google week by week.
- **Page 1 ranking** — Your site appears in the top 10 results on Google for that phrase. Most clicks happen on page 1.
- **Backlink** — Another website's link pointing to yours. Google treats good backlinks like recommendations — quality beats quantity.
- **Meta title / meta description** — The clickable headline and short blurb that show up in Google search results. The "shop window" for your page.
- **Alt text** — A short text description attached to an image. Helps Google understand the image *and* helps screen readers for visually impaired visitors.
- **Schema / structured data** — Hidden code that helps Google understand what your page is about (a recipe, a service, a business location, an FAQ).
- **Core Web Vitals** — Google's three measurements of how fast and stable your site feels to visitors. Failing these can hurt rankings.
- **Crawl / index** — "Crawl" is Google reading your site; "index" is Google deciding to remember it. Both are required to show up in search.

### Useful analogies to drop into tooltips

- *Impression = "your shop sign got seen"; click = "someone walked in"; conversion = "someone bought."*
- *Average position is like a leaderboard rank — #1 is best, lower numbers are better.*
- *Engagement rate is like a party: did people stay, mingle, talk to people — or walk in, look around, and leave?*
- *Backlinks are like reviews from other businesses. A few from respected places beats fifty from strangers.*

---

## 4. The narrative — what story should the report tell?

Read top-to-bottom, the dashboard should answer questions in this order. Each section should be one screen-height (or one scroll-snap) so the story stays linear.

### Section 1 — The headline ("How did we do?")
**One sentence**, auto-written or hand-written by the freelancer:
> *"In April, your site reached **X people** and generated **Y inquiries**, up **Z%** from last month."*

Three big-number tiles below it:
- Total visitors (MoM %, YoY %)
- Key events / inquiries (MoM %, YoY %)
- Google clicks (MoM %, YoY %)

### Section 2 — Did more people find you? (visibility)
- Impressions trend (GSC)
- Average position trend (GSC)
- Indexed pages count
- *Callout box:* "AI Overviews context — your impressions went up X% but clicks Y% because…"

### Section 3 — Where did they come from? (acquisition)
- Channel breakdown (this month, donut or stacked bar)
- MoM change per channel
- Top queries table (GSC)
- Top referral sources

### Section 4 — What did they do? (behavior)
- Engagement rate (with benchmark bar)
- Average engagement time
- Top landing pages table with engagement rate and key events
- Conversion rate by channel

### Section 5 — Are we winning the keywords we care about? (SEO progress)
- Tracked keyword table from SEO Space (this month / last month / sparkline)
- Keywords on page 1 (number + delta)
- Page-level SEO scores (top 5 to fix)

### Section 6 — What we fixed this month (receipt of work)
- List of resolved SEO Space issues
- Pages updated / created
- Technical fixes shipped

### Section 7 — What's next (recommendations) — see §5
- Quick wins
- Content opportunities
- SEO fixes
- Site-care items

### Section 8 — Glossary / "What does this mean?" — collapsed by default

Structurally: **Context → Visibility → Acquisition → Behavior → Progress → Receipts → Plan → Reference.** That's a journalism inverted-pyramid for analytics.

---

## 5. Actionable next-steps section

This is the part clients actually read. Every month it should contain 3-7 items, **categorized**, **explained in plain English**, and where possible **mapped back to a metric in the dashboard** so they can see why we recommended it.

Suggested categories (rotate based on what the data surfaces):

### A. Quick Wins (this month, <2 hours of work)
- Rewrite the meta title on `/services` (currently shown for "[query]" at avg. position 6 with low CTR).
- Add alt text to 8 images on the homepage flagged by SEO Space.
- Fix the broken link to [page] reported in last week's crawl.

### B. Content Opportunities (next 1-2 months)
- Write a blog post answering "[non-branded query you ranked for accidentally]" — Google already thinks you're relevant.
- Expand the `/about` page; visitors who land there have above-average engagement but no clear path to inquiry.

### C. SEO Fixes (from SEO Space critical issues)
- Resolve [N] critical issues identified this month.
- Improve page-level SEO score for `/[top-service-page]` from 62 to 80+.

### D. Site Care / Health
- Squarespace platform updates this month
- Plugin or integration checks
- Backup verified
- SSL / domain renewal status if relevant

### E. Tracking / Setup
- New key event set up
- Tag updates
- Goals adjusted

### F. Watch List (things we're monitoring but not acting on yet)
- A keyword that just hit position 12 — likely to hit page 1 next month if we add one more internal link.
- A page that lost 30% impressions; could be seasonal or could be an AI Overview taking the click.

Every recommendation should follow the same shape: **what we'll do → why → expected impact → metric we'll watch.** That keeps the client confident the retainer is buying real work, not opinions.

---

## 6. Recommended Google Sheet column structure

This is designed to fit cleanly into the existing tabs in `Code.gs` (`ga4_monthly_summary`, `ga4_landing_pages`, `ga4_traffic_sources`, `gsc_monthly_summary`, `gsc_pages`, `gsc_queries`, `tasks`) and to add the SEO Space + dashboard-friendly columns the design team will need.

### Common identifier columns (every tab)

| Column | Notes |
|---|---|
| `client_id` | e.g. `bergen_design` |
| `report_month` | `YYYY-MM` of the calendar month being reported |
| `report_period_start` | `YYYY-MM-DD` |
| `report_period_end` | `YYYY-MM-DD` |
| `data_source` | `ga4` / `gsc` / `seospace` / `manual` |
| `last_updated_at` | ISO timestamp the row was last written |

### Tab: `dashboard_headline` (NEW — drives the top of the report)

| Column | Purpose |
|---|---|
| `client_id`, `report_month` | keys |
| `headline_sentence` | manual or templated one-liner |
| `total_users`, `total_users_prev_month`, `total_users_same_month_last_year` | the three time slices |
| `total_users_mom_pct`, `total_users_yoy_pct` | precomputed deltas |
| `key_events`, `key_events_prev_month`, `key_events_same_month_last_year` | |
| `key_events_mom_pct`, `key_events_yoy_pct` | |
| `gsc_clicks`, `gsc_clicks_prev_month`, `gsc_clicks_same_month_last_year` | |
| `gsc_clicks_mom_pct`, `gsc_clicks_yoy_pct` | |
| `notes` | freeform narrative |

### Tab: `ga4_monthly_summary` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `users`, `new_users`, `returning_users` | |
| `sessions`, `engaged_sessions` | |
| `engagement_rate`, `avg_engagement_time_seconds` | |
| `key_events_total` | sum of key events |
| `key_events_breakdown_json` | per-event-name counts |
| `users_prev_month`, `sessions_prev_month`, `engagement_rate_prev_month`, `key_events_prev_month` | MoM |
| `users_same_month_last_year`, `sessions_same_month_last_year`, `engagement_rate_same_month_last_year`, `key_events_same_month_last_year` | YoY |
| `notes` | |

### Tab: `ga4_traffic_sources` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `channel` | Organic, Direct, Referral, Social, Email, Paid, Other |
| `users`, `sessions`, `engaged_sessions`, `engagement_rate`, `key_events`, `conversion_rate` | |
| `users_prev_month`, `users_same_month_last_year` | for in-row deltas |
| `share_of_total_users_pct` | precomputed |
| `notes` | |

### Tab: `ga4_landing_pages` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `landing_page_path` | |
| `landing_page_title` | human-readable |
| `sessions`, `engaged_sessions`, `engagement_rate`, `avg_engagement_time_seconds`, `key_events` | |
| `sessions_prev_month`, `sessions_same_month_last_year` | |
| `rank_this_month` | top N within client/month |
| `notes` | |

### Tab: `gsc_monthly_summary` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `clicks`, `impressions`, `ctr`, `avg_position` | |
| `clicks_prev_month`, `impressions_prev_month`, `ctr_prev_month`, `avg_position_prev_month` | |
| `clicks_same_month_last_year`, `impressions_same_month_last_year`, `ctr_same_month_last_year`, `avg_position_same_month_last_year` | |
| `indexed_pages_count`, `indexed_pages_count_prev_month` | (from Coverage report or manual) |
| `branded_clicks`, `nonbranded_clicks` | requires brand-term regex per client |
| `ai_overview_observed_flag` | manual yes/no per month for the narrative |
| `notes` | |

### Tab: `gsc_queries` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `query` | |
| `clicks`, `impressions`, `ctr`, `avg_position` | |
| `clicks_prev_month`, `impressions_prev_month`, `avg_position_prev_month` | |
| `is_branded` | bool |
| `rank_this_month` | top N |
| `notes` | |

### Tab: `gsc_pages` (extend existing)

| Column | Purpose |
|---|---|
| identifier columns | |
| `page_url` | |
| `clicks`, `impressions`, `ctr`, `avg_position` | |
| `clicks_prev_month`, `avg_position_prev_month` | |
| `clicks_same_month_last_year`, `avg_position_same_month_last_year` | |
| `rank_this_month` | |
| `notes` | |

### Tab: `seospace_audit_summary` (NEW)

| Column | Purpose |
|---|---|
| identifier columns | |
| `overall_score`, `overall_score_prev_month` | |
| `critical_issues_count`, `critical_issues_count_prev_month` | |
| `warning_issues_count`, `warning_issues_count_prev_month` | |
| `passed_checks_count` | |
| `resolved_this_month_count` | for the "receipts" section |
| `notes` | |

### Tab: `seospace_issues` (NEW — drives next-steps + receipts)

| Column | Purpose |
|---|---|
| identifier columns | |
| `issue_id` | stable id from SEO Space if available |
| `issue_title` | e.g. "Missing meta description" |
| `severity` | critical / warning / info |
| `affected_page_url` | |
| `status` | open / in_progress / resolved / wont_fix |
| `first_seen_month`, `resolved_in_month` | |
| `plain_english_summary` | client-facing one-liner |
| `recommended_action` | "What we'll do" |
| `effort_estimate` | quick / medium / project |
| `notes` | |

### Tab: `seospace_keywords` (NEW)

| Column | Purpose |
|---|---|
| identifier columns | |
| `keyword` | |
| `current_position`, `position_prev_month`, `position_90_days_ago` | |
| `is_on_page_1` | bool |
| `is_in_top_3` | bool |
| `tracked_since` | date |
| `target_page_url` | the page we want ranking for it |
| `notes` | |

### Tab: `seospace_page_scores` (NEW)

| Column | Purpose |
|---|---|
| identifier columns | |
| `page_url` | |
| `page_score`, `page_score_prev_month` | |
| `critical_issues_on_page`, `warning_issues_on_page` | |
| `priority_rank` | so the dashboard can grab top-5-to-fix |
| `notes` | |

### Tab: `tasks` (extend existing — drives the next-steps section)

| Column | Purpose |
|---|---|
| `client_id`, `report_month` | keys |
| `task_id` | stable id |
| `category` | quick_win / content / seo_fix / site_care / tracking / watch_list |
| `title` | client-facing |
| `description` | "what we'll do" |
| `why` | "why it matters" |
| `expected_impact` | "metric we'll watch" |
| `linked_metric` | which dashboard metric this maps to |
| `source` | gsc / ga4 / seospace / freelancer |
| `status` | proposed / in_progress / done / deferred |
| `effort_estimate` | quick / medium / project |
| `created_in_month`, `completed_in_month` | for receipts |
| `notes` | |

### Tab: `glossary` (NEW — feeds tooltips so we never re-write the same definitions)

| Column | Purpose |
|---|---|
| `term` | e.g. "Engagement rate" |
| `short_definition` | one sentence |
| `analogy` | optional |
| `related_metric_keys` | comma-separated metric ids that should link to this term |
| `display_order` | |

### Design-team notes on this schema

- **MoM and YoY columns are precomputed in the sheet**, not in the dashboard. The dashboard should be dumb — it reads numbers, it doesn't calculate.
- **`notes` on every tab** is intentional. The freelancer needs an editorial layer to override or explain anything weird (e.g., "huge YoY drop because last year was a viral moment").
- **`linked_metric` in `tasks` is the key to the "why are you recommending this?" UX.** Hovering a recommendation can highlight the metric that triggered it.
- **`headline_sentence` is the single most important field in the whole workbook** — it's the line the client reads first and remembers.

---

## Sources

- [Small Business Guide to Google Analytics 4 (Digital Ceren, 2025)](https://digitalceren.com/2025/09/24/small-business-guide-to-google-analytics-4-track-what-really-matters/)
- [GA4 Reporting for Business Owners: Metrics That Matter in 2026 (TrueFuture Media)](https://www.truefuturemedia.com/articles/ga4-reporting-business-owners-metrics)
- [Key Google Analytics 4 Metrics to Track in 2025 (Swydo)](https://www.swydo.com/blog/google-analytics-4-metrics/)
- [GA4 for Small Businesses (Analytify, 2026)](https://analytify.io/ga4-for-small-businesses/)
- [GA4 Key Events Explained (Analytify, 2025)](https://analytify.io/ga4-key-events/)
- [GA4 Key Events vs Conversions (Google Analytics Help)](https://support.google.com/analytics/answer/13965727?hl=en)
- [What Is a Good Engagement Rate in GA4 (OneUpWeb)](https://www.oneupweb.com/blog/good-engagement-rate-google-analytics-4/)
- [Average GA4 Engagement Rates by Industry (Arvo Digital)](https://arvo.digital/ga4-engagement-rates/)
- [Performance report — Search Console Help](https://support.google.com/webmasters/answer/7576553?hl=en)
- [What are impressions, position, and clicks? — Search Console Help](https://support.google.com/webmasters/answer/7042828?hl=en)
- [Google Search Console 2026: All Reports Explained (IndexCraft)](https://indexcraft.in/blog/tools/google-search-console-guide)
- [Google CTR Benchmarks by Position 2025 (OpenSales)](https://opensales.us/articles/google-ctr-by-rank-2026-benchmarks)
- [Google Search Console Impression Drop Explained (Conversion Marketing, Sept 2025)](https://conversionmarketing.co.nz/september-2025-gsc-impression-drop-explained/)
- [SEOSpace — official site](https://www.seospace.co/)
- [Honest SEOSpace Review 2026 (The Square Genius)](https://www.thesquaregenius.com/squarespace-tips/my-honest-seospace-review)
- [Is SEOSpace the Best Squarespace SEO Tool in 2026? (Red 11 Media)](https://www.red11media.com/blog/seospace-squarespace-seo-tool)
- [Vanity Metrics vs. Actionable Insights (AgencyAnalytics)](https://agencyanalytics.com/blog/vanity-metrics)
- [Vanity Metrics: How to Stop Using Them (Improvado)](https://improvado.io/blog/what-is-a-vanity-metric)
- [The SEO Monthly Reporting Format Clients Love (MetricsWatch)](https://www.metricswatch.com/blog/seo-monthly-reporting-format)
- [SEO Storytelling: Communicate Data, Wins & Insights (seoClarity)](https://www.seoclarity.net/blog/seo-storytelling-workflow)
- [SEO Monthly Report Template (Reportr, 2026)](https://reportr.agency/blog/seo-monthly-report-template)
- [Period-over-period Comparison (Holistics docs)](https://docs.holistics.io/docs/period-comparison)
- [SEO Jargon Glossary in Plain English (Respona)](https://respona.com/blog/seo-jargon/)
- [Modern SEO Glossary (Laura Jawad Marketing)](https://www.laurajawadmarketing.com/blog/seo-glossary/)
