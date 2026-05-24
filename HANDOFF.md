# New Client Service Handoff

This folder is the working project for the client reporting automation.

Current location is this repository folder.

## Original Service Goal

Build an automated monthly reporting/SEO ops system for an inexpensive, low-touch service for existing Squarespace clients.

The system should:

- Pull relevant client data from Google Search Console once a month.
- Pull relevant client data from Google Analytics 4 once a month.
- Leave SEO Space data open-ended for now, because the import/export/email workflow is not known yet.
- Produce a nice monthly report/dashboard.
- Optionally include basic AI analysis, reviewed before publishing.
- Be as repeatable/automated as possible for onboarding multiple clients.
- Support light monthly fixes like changing SEO descriptions, replacing images, updating banners, and similar small Squarespace edits.

## User Context And Decisions

- This is an internal/light agency service, not a self-serve SaaS.
- The first clients are existing clients.
- Pilot size is small: fewer than 10 clients, maybe fewer than 5.
- All sites are Squarespace.
- Billing stays elsewhere.
- The user is comfortable asking clients for whatever access is necessary.
- SEO Space will be under the user's account.
- Reports are for business owners, not technical SEO people.
- Dashboard/report should mostly be read-only.
- A completed-tasks list is likely valuable.
- AI recommendations/analysis should be drafted for review before anything is published.
- Dashboard design is not the current bottleneck.
- First priority is reliable automation into a Sheet.

## Ownership / Access Model

Preferred agency-style setup:

- Each client owns their own GA4 property.
- Each client owns their own Search Console property.
- Each client owns their own GTM container.
- The user is added as admin/owner where needed.
- If a client leaves, they keep their historical data.

Pilot automation can run under the user's Google account, reading all GA4/GSC properties the user has access to.

Recommended access during onboarding:

- Squarespace: full admin/contributor access.
- GSC: Owner or Full user.
- GA4: Admin/Editor during setup; Viewer may be enough for reporting later.
- GTM: Admin/Publish.

## GTM / Analytics Direction

Use GTM as the cookie-cutter install path.

GTM is the collection layer:

```txt
Squarespace site -> GTM container -> GA4 tag -> GA4 property -> Apps Script pulls GA4 API data
```

Use separate GTM containers per client, not one shared container across all clients.

Generic event tracking to consider:

- form submissions
- phone link clicks
- booking/contact button clicks
- newsletter signup submissions
- ecommerce purchases, if applicable

Email clicks are intentionally excluded for now.

Third-party tracking can be left alone for now.

## Data Source Direction

Start with Google Sheets.

Keep the Sheet database-shaped so it can move to Airtable, Supabase, or another database later.

Use one master workbook with table-like tabs and `client_id` columns, not one tab per client.

Potential tabs:

```txt
clients
report_runs
ga4_monthly_summary
ga4_landing_pages
ga4_traffic_sources
gsc_monthly_summary
gsc_pages
gsc_queries
tasks
seo_health_items
report_publications
```

## Client Folder Direction

Create per-client Drive folders to keep exports and report artifacts organized.

Suggested structure:

```txt
SEO Reporting System/
  Bergen Design/
    Reports/
    Source Exports/
    Assets/
```

Store folder IDs in the `clients` tab.

## GSC Indexing / Site Health Notes

GSC performance data is straightforward through the Search Analytics API:

- clicks
- impressions
- CTR
- average position
- top pages
- top queries

GSC indexing reasons, like "Crawled - currently not indexed" or "Discovered - currently not indexed", are not available through a clean bulk API endpoint.

Possible later approaches:

- Treat GSC indexing emails as alerts that create review tasks.
- Use URL Inspection API only for selected/priority URLs.
- Use SEO Space exports/emails for site-health issues.
- Use a crawler/audit tool later if necessary.

For now, leave indexing emails and SEO Space imports open-ended.

## Dashboard Direction

Eventually, the Squarespace dashboard snippet should not contain raw Sheet URLs.

Preferred future snippet shape:

```html
<div data-seo-dashboard data-client-id="client_abc123"></div>
<script src="https://cdn.yourdomain.com/seo-dashboard.js"></script>
```

For version 1, dashboard design can wait. The user has experience loading CSVs into front-end snippets.

The first dashboard should be internal/private for the user.

Historical month selection is desirable later, but not needed for the first automation test.

## Pilot Client Config

```txt
client_id: bergen_design
client_name: Bergen Design
domain: bergendesign.co
gsc_property: sc-domain:bergendesign.co
gtm_container_id: GTM-NB98LQXQ
ga4_property_id: 421478232
ga4_measurement_id: G-Y9RC0009GD
squarespace_url: https://www.bergendesign.co
```

## Current Apps Script Prototype

The current root folder contains:

```txt
Code.gs
appsscript.json
README.md
```

It currently does the following:

- Creates workbook tabs and headers.
- Seeds Bergen Design as the first client.
- Creates Drive folders for the client.
- Pulls last complete calendar month from GA4 property `421478232`.
- Pulls last complete calendar month from GSC property `sc-domain:bergendesign.co`.
- Writes summary, landing page/source, page/query data into separate tabs.
- Logs runs in `report_runs`.

Local syntax check passed by copying `Code.gs` to `/tmp/client-reporting-Code.js` and running:

```txt
node --check /tmp/client-reporting-Code.js
```

The real API pull has not been tested yet because it must run inside Apps Script with the user's Google permissions.

## Repo Files

Current project files:

```txt
.gitignore
README.md
HANDOFF.md
Code.gs
appsscript.json
```

Suggested `.gitignore`:

```txt
.DS_Store
node_modules/
.env
.env.*
!.env.example
dist/
build/
tmp/
```

## Suggested Next Steps

1. Make an initial commit.
2. Create the Google Sheet and test `setupWorkbook()`.
3. Test `runMonthlyReportForBergenDesign()`.
4. Adjust metric/dimension names based on real Apps Script/API errors.
