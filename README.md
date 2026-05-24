# SEO Reporting Apps Script

This is the first pilot automation for pulling Bergen Design monthly GA4 and Google Search Console data into a Google Sheet.

## Pilot Config

```txt
client_id: bergen_design
domain: bergendesign.co
gsc_property: sc-domain:bergendesign.co
gtm_container: GTM-NB98LQXQ
ga4_property_id: 421478232
ga4_measurement_id: G-Y9RC0009GD
```

## Setup

1. Create a new Google Sheet for the SEO reporting master workbook.
2. Open `Extensions -> Apps Script`.
3. Paste `Code.gs` into the Apps Script editor.
4. In Apps Script project settings, enable "Show appsscript.json manifest file in editor".
5. Replace the manifest with `appsscript.json`.
6. Make sure these APIs are enabled for the Apps Script Google Cloud project:
   - Google Analytics Data API
   - Google Search Console API
7. Run `setupWorkbook()`.
8. Approve the requested permissions.
9. Run `runMonthlyReportForBergenDesign()`.

## Monthly Automation

The script uses the last complete calendar month automatically.

Example: if the script runs any day in June 2026, it reports on `2026-05-01` through `2026-05-31`.

After the manual test works:

1. Open Apps Script `Triggers`.
2. Add a trigger for `runMonthlyReportForAllClients`.
3. Use a month timer, ideally early in the month after GA4/GSC have settled.

## Historical Backfill

For the Bergen Design demo, run:

```txt
backfillBergenDesignLast6Months
```

This pulls the last six complete calendar months, oldest to newest. If today is in May 2026, it pulls November 2025 through April 2026.

For future onboarding, after a new active client row is added to `clients`, run:

```txt
backfillAllActiveClientsLast6Months
```

The metric tabs are safe to rerun because each client/month is replaced before new rows are written. The `report_runs` tab keeps each attempt as an audit log.

## Tabs Created

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
```

## Drive Folders

`setupWorkbook()` also creates a root folder named `SEO Reporting System`, then creates client folders and stores their folder IDs in the `clients` tab.

For Bergen Design it creates:

```txt
SEO Reporting System/
  Bergen Design/
    Reports/
    Source Exports/
    Assets/
```

## Notes

- GTM is recorded in the client row, but the data pull reads from GA4 and GSC directly.
- GSC indexing issue emails are intentionally not handled in this first version.
- SEO Space imports are intentionally left open-ended for now.
- If `keyEvents` is not available for a GA4 property, the GA4 summary request retries without it.
