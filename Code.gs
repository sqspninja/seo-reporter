const CONFIG = {
  rootFolderName: 'SEO Reporting System',
  publicPayloadSpreadsheetId: '1AQwv7QiNf_0Azx9MxJbrOPhfYrU8iRpnvSxlIzrO_qk',
  defaultClient: {
    client_id: 'bergen_design',
    client_name: 'Bergen Design',
    domain: 'bergendesign.co',
    ga4_property_id: '421478232',
    ga4_measurement_id: 'G-Y9RC0009GD',
    gsc_property: 'sc-domain:bergendesign.co',
    gtm_container_id: 'GTM-NB98LQXQ',
    squarespace_url: 'https://www.bergendesign.co',
    status: 'active'
  },
  tabs: {
    clients: [
      'client_id',
      'client_name',
      'domain',
      'ga4_property_id',
      'ga4_measurement_id',
      'gsc_property',
      'gtm_container_id',
      'squarespace_url',
      'drive_folder_id',
      'reports_folder_id',
      'exports_folder_id',
      'assets_folder_id',
      'status',
      'notes'
    ],
    report_runs: [
      'run_id',
      'client_id',
      'report_month',
      'start_date',
      'end_date',
      'started_at',
      'finished_at',
      'status',
      'message'
    ],
    ga4_monthly_summary: [
      'client_id',
      'report_month',
      'start_date',
      'end_date',
      'sessions',
      'total_users',
      'active_users',
      'engaged_sessions',
      'engagement_rate',
      'bounce_rate',
      'avg_session_duration',
      'event_count',
      'key_events',
      'new_users'
    ],
    ga4_landing_pages: [
      'client_id',
      'report_month',
      'landing_page',
      'sessions',
      'active_users',
      'engagement_rate',
      'avg_session_duration',
      'event_count'
    ],
    ga4_traffic_sources: [
      'client_id',
      'report_month',
      'session_source_medium',
      'sessions',
      'active_users',
      'engagement_rate',
      'event_count',
      'new_users'
    ],
    gsc_monthly_summary: [
      'client_id',
      'report_month',
      'start_date',
      'end_date',
      'clicks',
      'impressions',
      'ctr',
      'position'
    ],
    gsc_pages: [
      'client_id',
      'report_month',
      'page',
      'clicks',
      'impressions',
      'ctr',
      'position'
    ],
    gsc_queries: [
      'client_id',
      'report_month',
      'query',
      'clicks',
      'impressions',
      'ctr',
      'position'
    ],
    tasks: [
      'client_id',
      'report_month',
      'task_title',
      'status',
      'source',
      'severity',
      'url',
      'notes',
      'completed_date'
    ],
    dashboard_payloads: [
      'client_id',
      'report_month',
      'updated_at',
      'payload_json'
    ]
  }
};

function setupWorkbook() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(CONFIG.tabs).forEach((sheetName) => ensureSheetWithHeaders_(ss, sheetName, CONFIG.tabs[sheetName]));
  seedDefaultClient_();
  setupClientFolders();
}

function setupClientFolders() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('clients');
  const rows = getRows_(sheet);
  const root = getOrCreateRootFolder_();
  const headers = CONFIG.tabs.clients;

  rows.forEach((row, index) => {
    if (!row.client_id || !isActiveClient_(row)) return;

    const clientFolder = row.drive_folder_id
      ? DriveApp.getFolderById(row.drive_folder_id)
      : getOrCreateChildFolder_(root, row.client_name || row.client_id);

    const reportsFolder = row.reports_folder_id
      ? DriveApp.getFolderById(row.reports_folder_id)
      : getOrCreateChildFolder_(clientFolder, 'Reports');

    const exportsFolder = row.exports_folder_id
      ? DriveApp.getFolderById(row.exports_folder_id)
      : getOrCreateChildFolder_(clientFolder, 'Source Exports');

    const assetsFolder = row.assets_folder_id
      ? DriveApp.getFolderById(row.assets_folder_id)
      : getOrCreateChildFolder_(clientFolder, 'Assets');

    const sheetRow = index + 2;
    setCellByHeader_(sheet, headers, sheetRow, 'drive_folder_id', clientFolder.getId());
    setCellByHeader_(sheet, headers, sheetRow, 'reports_folder_id', reportsFolder.getId());
    setCellByHeader_(sheet, headers, sheetRow, 'exports_folder_id', exportsFolder.getId());
    setCellByHeader_(sheet, headers, sheetRow, 'assets_folder_id', assetsFolder.getId());
  });
}

function runMonthlyReportForAllClients() {
  const ss = SpreadsheetApp.getActive();
  const clients = getRows_(ss.getSheetByName('clients')).filter((client) => client.client_id && isActiveClient_(client));
  const period = getLastCompleteMonth_();

  clients.forEach((client) => runMonthlyReportForClient_(client, period));
}

function runMonthlyReportForBergenDesign() {
  const ss = SpreadsheetApp.getActive();
  const client = getRows_(ss.getSheetByName('clients')).find((row) => row.client_id === 'bergen_design');
  if (!client) throw new Error('No bergen_design row found. Run setupWorkbook() first.');
  runMonthlyReportForClient_(client, getLastCompleteMonth_());
}

function backfillBergenDesignLast6Months() {
  const ss = SpreadsheetApp.getActive();
  const client = getRows_(ss.getSheetByName('clients')).find((row) => row.client_id === 'bergen_design');
  if (!client) throw new Error('No bergen_design row found. Run setupWorkbook() first.');
  backfillMonthlyReportsForClient_(client, 6);
}

function backfillAllActiveClientsLast6Months() {
  const ss = SpreadsheetApp.getActive();
  const clients = getRows_(ss.getSheetByName('clients')).filter((client) => client.client_id && isActiveClient_(client));
  clients.forEach((client) => backfillMonthlyReportsForClient_(client, 6));
}

function backfillMonthlyReportsForClient_(client, monthCount) {
  getCompleteMonthPeriodsBack_(monthCount).forEach((period) => runMonthlyReportForClient_(client, period));
}

function runMonthlyReportForClient_(client, period) {
  const startedAt = new Date();
  const runId = [client.client_id, period.reportMonth, startedAt.getTime()].join('_');
  appendRows_('report_runs', [[runId, client.client_id, period.reportMonth, period.startDate, period.endDate, startedAt, '', 'running', '']]);

  try {
    const ga4 = fetchGa4Reports_(client.ga4_property_id, period);
    const gsc = fetchGscReports_(client.gsc_property, period);

    replaceRowsForClientMonth_('ga4_monthly_summary', client.client_id, period.reportMonth, [ga4.summaryRow(client, period)]);
    replaceRowsForClientMonth_('ga4_landing_pages', client.client_id, period.reportMonth, ga4.landingPageRows(client, period));
    replaceRowsForClientMonth_('ga4_traffic_sources', client.client_id, period.reportMonth, ga4.trafficSourceRows(client, period));
    replaceRowsForClientMonth_('gsc_monthly_summary', client.client_id, period.reportMonth, [gsc.summaryRow(client, period)]);
    replaceRowsForClientMonth_('gsc_pages', client.client_id, period.reportMonth, gsc.pageRows(client, period));
    replaceRowsForClientMonth_('gsc_queries', client.client_id, period.reportMonth, gsc.queryRows(client, period));
    refreshDashboardPayloadForClient_(client.client_id);

    finishReportRun_(runId, 'complete', 'Monthly data pull completed.');
  } catch (error) {
    finishReportRun_(runId, 'error', error && error.message ? error.message : String(error));
    throw error;
  }
}

function refreshDashboardPayloadsForActiveClients() {
  const ss = SpreadsheetApp.getActive();
  const payloadSs = getPayloadSpreadsheet_();
  ensureSheetWithHeaders_(payloadSs, 'dashboard_payloads', CONFIG.tabs.dashboard_payloads);
  const clients = getRows_(ss.getSheetByName('clients')).filter((client) => client.client_id && isActiveClient_(client));
  clients.forEach((client) => refreshDashboardPayloadForClient_(client.client_id));
}

function refreshDashboardPayloadForBergenDesign() {
  refreshDashboardPayloadForClient_('bergen_design');
}

function refreshDashboardPayloadForClient_(clientId) {
  const payloadSs = getPayloadSpreadsheet_();
  ensureSheetWithHeaders_(payloadSs, 'dashboard_payloads', CONFIG.tabs.dashboard_payloads);
  const payload = getClientDashboardData_(clientId);
  replaceRowsForClientInSpreadsheet_(payloadSs, 'dashboard_payloads', clientId, [[
    clientId,
    payload.reportMonth || '',
    new Date(),
    JSON.stringify(payload)
  ]]);
}

function publishPayloadWorkbookForWeb() {
  const file = DriveApp.getFileById(CONFIG.publicPayloadSpreadsheetId);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
}

function getPayloadSpreadsheet_() {
  return CONFIG.publicPayloadSpreadsheetId
    ? SpreadsheetApp.openById(CONFIG.publicPayloadSpreadsheetId)
    : SpreadsheetApp.getActive();
}

function fetchGa4Reports_(propertyId, period) {
  const summary = runGa4Report_(propertyId, period, [], [
    'sessions',
    'totalUsers',
    'newUsers',
    'activeUsers',
    'engagedSessions',
    'engagementRate',
    'bounceRate',
    'averageSessionDuration',
    'eventCount',
    'keyEvents'
  ]);

  const landingPages = runGa4Report_(propertyId, period, ['landingPagePlusQueryString'], [
    'sessions',
    'activeUsers',
    'engagementRate',
    'averageSessionDuration',
    'eventCount'
  ], 25);

  const trafficSources = runGa4Report_(propertyId, period, ['sessionSourceMedium'], [
    'sessions',
    'activeUsers',
    'engagementRate',
    'eventCount',
    'newUsers'
  ], 25);

  return {
    summaryRow(client, range) {
      const metrics = summary.rows.length ? summary.rows[0].metrics : {};
      return [
        client.client_id,
        range.reportMonth,
        range.startDate,
        range.endDate,
        metrics.sessions || '',
        metrics.totalUsers || '',
        metrics.activeUsers || '',
        metrics.engagedSessions || '',
        metrics.engagementRate || '',
        metrics.bounceRate || '',
        metrics.averageSessionDuration || '',
        metrics.eventCount || '',
        metrics.keyEvents || '',
        metrics.newUsers || ''
      ];
    },
    landingPageRows(client, range) {
      return landingPages.rows.map((row) => [
        client.client_id,
        range.reportMonth,
        row.dimensions.landingPagePlusQueryString || '',
        row.metrics.sessions || '',
        row.metrics.activeUsers || '',
        row.metrics.engagementRate || '',
        row.metrics.averageSessionDuration || '',
        row.metrics.eventCount || ''
      ]);
    },
    trafficSourceRows(client, range) {
      return trafficSources.rows.map((row) => [
        client.client_id,
        range.reportMonth,
        row.dimensions.sessionSourceMedium || '',
        row.metrics.sessions || '',
        row.metrics.activeUsers || '',
        row.metrics.engagementRate || '',
        row.metrics.eventCount || '',
        row.metrics.newUsers || ''
      ]);
    }
  };
}

function getClientDashboardData_(clientId) {
  const ss = SpreadsheetApp.getActive();
  const clients = getRows_(ss.getSheetByName('clients'));
  const client = clients.find((row) => row.client_id === clientId);
  if (!client) throw new Error(`No client found for ${clientId}`);

  const ga4SummaryRows = getRows_(ss.getSheetByName('ga4_monthly_summary')).filter((row) => row.client_id === clientId);
  const gscSummaryRows = getRows_(ss.getSheetByName('gsc_monthly_summary')).filter((row) => row.client_id === clientId);
  const currentMonth = getLatestReportMonth_(gscSummaryRows.concat(ga4SummaryRows));
  const previousMonth = getPreviousReportMonth_(gscSummaryRows.concat(ga4SummaryRows), currentMonth);
  const ga4Current = getLastRowForMonth_(ga4SummaryRows, currentMonth);
  const ga4Previous = getLastRowForMonth_(ga4SummaryRows, previousMonth);
  const gscCurrent = getLastRowForMonth_(gscSummaryRows, currentMonth);
  const gscPrevious = getLastRowForMonth_(gscSummaryRows, previousMonth);

  const gscQueries = getRows_(ss.getSheetByName('gsc_queries'))
    .filter((row) => row.client_id === clientId && row.report_month === currentMonth)
    .sort((a, b) => Number(b.clicks || 0) - Number(a.clicks || 0))
    .slice(0, 10);

  const gscPages = getRows_(ss.getSheetByName('gsc_pages'))
    .filter((row) => row.client_id === clientId && row.report_month === currentMonth)
    .sort((a, b) => Number(b.clicks || 0) - Number(a.clicks || 0))
    .slice(0, 10);

  const trafficSources = getRows_(ss.getSheetByName('ga4_traffic_sources'))
    .filter((row) => row.client_id === clientId && row.report_month === currentMonth)
    .sort((a, b) => Number(b.sessions || 0) - Number(a.sessions || 0))
    .slice(0, 6);

  const landingPages = getRows_(ss.getSheetByName('ga4_landing_pages'))
    .filter((row) => row.client_id === clientId && row.report_month === currentMonth);

  return {
    clientName: client.client_name || client.client_id,
    reportMonth: currentMonth,
    reportLabel: formatReportLabel_(currentMonth),
    comparisonLabel: formatReportLabel_(previousMonth),
    lede: `${formatReportLabel_(currentMonth)} search and traffic data for ${client.client_name || client.client_id}.`,
    snapshot: [
      {
        title: 'Search Performance',
        help: 'How many times your site appeared in Google search results, whether or not someone clicked.',
        primary: formatWholeNumber_(gscCurrent.impressions),
        caption: 'Times the site appeared in Google search results.',
        secondary: `${formatWholeNumber_(gscCurrent.clicks)} clicks from Google`,
        change: formatPercentChangeText_(gscCurrent.impressions, gscPrevious.impressions, 'visibility'),
        tone: getChangeTone_(gscCurrent.impressions, gscPrevious.impressions)
      },
      {
        title: 'New Visitors',
        primary: formatWholeNumber_(ga4Current.new_users || ga4Current.total_users),
        caption: ga4Current.new_users ? 'First-time visitors measured by GA4.' : 'Visitors measured by GA4.',
        change: formatPercentChangeText_(ga4Current.new_users || ga4Current.total_users, ga4Previous.new_users || ga4Previous.total_users, 'vs last month'),
        tone: getChangeTone_(ga4Current.new_users || ga4Current.total_users, ga4Previous.new_users || ga4Previous.total_users)
      },
      {
        title: 'Average Google Position',
        help: 'The average spot where your site appeared in Google. Lower numbers are better: 1 is the top result.',
        primary: formatDecimal_(gscCurrent.position, 2),
        caption: 'Average ranking in Google. Lower is better.',
        secondary: `Previous month: ${formatDecimal_(gscPrevious.position, 2)}`,
        change: formatPositionChangeText_(gscCurrent.position, gscPrevious.position),
        tone: Number(gscCurrent.position || 0) <= Number(gscPrevious.position || 0) ? 'good' : 'bad'
      }
    ],
    keywords: gscQueries.map((row) => ({
      keyword: row.query,
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: formatPercent_(row.ctr),
      position: formatDecimal_(row.position, 2)
    })),
    pages: gscPages.map((row) => ({
      path: toDisplayPath_(row.page, client.domain),
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: formatPercent_(row.ctr),
      position: formatDecimal_(row.position, 2)
    })),
    trafficSources: trafficSources.map((row) => ({
      source: formatSourceMedium_(row.session_source_medium),
      users: Number(row.active_users || 0),
      newUsers: row.new_users ? Number(row.new_users) : '',
      engagement: formatPercent_(row.engagement_rate)
    })),
    keyActions: [
      { label: 'Key events', value: Number(ga4Current.key_events || 0) },
      { label: 'Total events', value: Number(ga4Current.event_count || 0) }
    ],
    history: getUniqueMonthRows_(gscSummaryRows).slice(-6).map((row) => ({
      month: formatShortMonth_(row.report_month),
      impressions: formatWholeNumber_(row.impressions),
      clicks: Number(row.clicks || 0)
    })),
    opportunities: buildPlaceholderOpportunities_(gscQueries, gscPages, landingPages),
    nextSteps: [
      { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' },
      { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' },
      { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' }
    ]
  };
}

function getLatestReportMonth_(rows) {
  return [...new Set(rows.map((row) => row.report_month).filter(Boolean))].sort().pop() || '';
}

function getPreviousReportMonth_(rows, currentMonth) {
  const months = [...new Set(rows.map((row) => row.report_month).filter(Boolean))].sort();
  const currentIndex = months.indexOf(currentMonth);
  return currentIndex > 0 ? months[currentIndex - 1] : '';
}

function getLastRowForMonth_(rows, reportMonth) {
  const matches = rows.filter((row) => row.report_month === reportMonth);
  return matches.length ? matches[matches.length - 1] : {};
}

function getUniqueMonthRows_(rows) {
  const byMonth = {};
  rows.forEach((row) => {
    if (row.report_month) byMonth[row.report_month] = row;
  });
  return Object.keys(byMonth).sort().map((month) => byMonth[month]);
}

function formatWholeNumber_(value) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatDecimal_(value, places) {
  return Number(value || 0).toFixed(places);
}

function formatPercent_(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}

function formatPercentChangeText_(current, previous, label) {
  const currentNumber = Number(current || 0);
  const previousNumber = Number(previous || 0);
  if (!previousNumber) return 'No previous month comparison';
  const change = ((currentNumber - previousNumber) / previousNumber) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}% ${label}`;
}

function formatPositionChangeText_(current, previous) {
  const currentNumber = Number(current || 0);
  const previousNumber = Number(previous || 0);
  if (!previousNumber) return 'No previous month comparison';
  const change = previousNumber - currentNumber;
  return change >= 0 ? `Improved ${change.toFixed(2)} spots` : `Moved down ${Math.abs(change).toFixed(2)} spots`;
}

function getChangeTone_(current, previous) {
  return Number(current || 0) >= Number(previous || 0) ? 'good' : 'bad';
}

function formatReportLabel_(reportMonth) {
  if (!reportMonth) return '';
  const parts = reportMonth.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMMM yyyy');
}

function formatShortMonth_(reportMonth) {
  if (!reportMonth) return '';
  const parts = reportMonth.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMM');
}

function toDisplayPath_(url, domain) {
  const text = String(url || '');
  return text
    .replace(`https://www.${domain}`, '')
    .replace(`https://${domain}`, '') || '/';
}

function formatSourceMedium_(value) {
  const text = String(value || '');
  if (text === 'google / organic' || text === 'bing / organic') return 'Organic Search';
  if (text === '(direct) / (none)') return 'Direct';
  if (text.indexOf('/ referral') !== -1) return 'Referral';
  if (text.indexOf('facebook') !== -1 || text.indexOf('instagram') !== -1) return 'Social';
  return text;
}

function buildPlaceholderOpportunities_(queries, pages, landingPages) {
  const lowCtrQueries = queries
    .filter((row) => Number(row.impressions || 0) > 50 && Number(row.ctr || 0) < 0.01)
    .slice(0, 3)
    .map((row) => `${row.query}: ${formatWholeNumber_(row.impressions)} impressions, ${formatPercent_(row.ctr)} CTR`);

  const closeRanks = queries
    .filter((row) => Number(row.position || 0) >= 8 && Number(row.position || 0) <= 20)
    .slice(0, 3)
    .map((row) => `${row.query}: avg position ${formatDecimal_(row.position, 2)}`);

  const weakEngagement = landingPages
    .filter((row) => Number(row.sessions || 0) > 1 && Number(row.engagement_rate || 0) < 0.5)
    .slice(0, 3)
    .map((row) => `${row.landing_page}: ${formatPercent_(row.engagement_rate)} engagement`);

  return [
    {
      title: 'High Impressions, Low Clicks',
      description: 'Search results are showing, but people are not choosing them often enough.',
      items: lowCtrQueries.length ? lowCtrQueries : ['Placeholder item']
    },
    {
      title: 'Close Ranking Opportunities',
      description: 'Searches close enough to improve with focused page updates.',
      items: closeRanks.length ? closeRanks : ['Placeholder item']
    },
    {
      title: 'Popular Pages With Weak Engagement',
      description: 'Pages people visit, but may need clearer next steps.',
      items: weakEngagement.length ? weakEngagement : ['Placeholder item']
    }
  ];
}

function fetchGscReports_(siteUrl, period) {
  const summary = runGscQuery_(siteUrl, period, [], 1);
  const pages = runGscQuery_(siteUrl, period, ['page'], 25);
  const queries = runGscQuery_(siteUrl, period, ['query'], 25);

  return {
    summaryRow(client, range) {
      const row = summary.length ? summary[0] : {};
      return [
        client.client_id,
        range.reportMonth,
        range.startDate,
        range.endDate,
        row.clicks || 0,
        row.impressions || 0,
        row.ctr || 0,
        row.position || 0
      ];
    },
    pageRows(client, range) {
      return pages.map((row) => [
        client.client_id,
        range.reportMonth,
        row.keys && row.keys.length ? row.keys[0] : '',
        row.clicks || 0,
        row.impressions || 0,
        row.ctr || 0,
        row.position || 0
      ]);
    },
    queryRows(client, range) {
      return queries.map((row) => [
        client.client_id,
        range.reportMonth,
        row.keys && row.keys.length ? row.keys[0] : '',
        row.clicks || 0,
        row.impressions || 0,
        row.ctr || 0,
        row.position || 0
      ]);
    }
  };
}

function runGa4Report_(propertyId, period, dimensions, metrics, limit) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const body = {
    dateRanges: [{ startDate: period.startDate, endDate: period.endDate }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit: limit || 1
  };

  if (dimensions.length) {
    body.orderBys = [{ metric: { metricName: metrics[0] }, desc: true }];
  }

  let response = fetchJson_(url, {
    method: 'post',
    payload: JSON.stringify(body)
  });

  if (response.error && metrics.indexOf('keyEvents') !== -1) {
    return runGa4Report_(propertyId, period, dimensions, metrics.filter((metric) => metric !== 'keyEvents'), limit);
  }

  if (response.error) throw new Error(`GA4 API error: ${response.error.message}`);

  return normalizeGa4Report_(response);
}

function runGscQuery_(siteUrl, period, dimensions, rowLimit) {
  const encodedSite = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;
  const body = {
    startDate: period.startDate,
    endDate: period.endDate,
    dimensions,
    rowLimit: rowLimit || 25,
    startRow: 0
  };
  const response = fetchJson_(url, {
    method: 'post',
    payload: JSON.stringify(body)
  });

  if (response.error) throw new Error(`GSC API error: ${response.error.message}`);
  return response.rows || [];
}

function fetchJson_(url, options) {
  const response = UrlFetchApp.fetch(url, Object.assign({
    headers: {
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
      'Content-Type': 'application/json'
    },
    contentType: 'application/json',
    muteHttpExceptions: true
  }, options));

  const text = response.getContentText();
  return text ? JSON.parse(text) : {};
}

function normalizeGa4Report_(report) {
  const dimensionNames = (report.dimensionHeaders || []).map((header) => header.name);
  const metricNames = (report.metricHeaders || []).map((header) => header.name);

  return {
    rows: (report.rows || []).map((row) => {
      const dimensions = {};
      const metrics = {};

      dimensionNames.forEach((name, index) => {
        dimensions[name] = row.dimensionValues[index] ? row.dimensionValues[index].value : '';
      });

      metricNames.forEach((name, index) => {
        metrics[name] = row.metricValues[index] ? row.metricValues[index].value : '';
      });

      return { dimensions, metrics };
    })
  };
}

function ensureSheetWithHeaders_(ss, sheetName, headers) {
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  const currentHeaders = sheet.getLastColumn()
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  if (currentHeaders.join('|') !== headers.join('|')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function seedDefaultClient_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('clients');
  const existing = getRows_(sheet).some((row) => row.client_id === CONFIG.defaultClient.client_id);
  if (existing) return;

  const headers = CONFIG.tabs.clients;
  appendRows_('clients', [headers.map((header) => CONFIG.defaultClient[header] || '')]);
}

function getRows_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  const headers = values.shift();
  return values.map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });
}

function appendRows_(sheetName, rows) {
  if (!rows.length) return;
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function replaceRowsForClientMonth_(sheetName, clientId, reportMonth, rows) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    appendRows_(sheetName, rows);
    return;
  }

  const kept = [values[0]].concat(values.slice(1).filter((row) => {
    return !(row[0] === clientId && row[1] === reportMonth);
  }));

  sheet.clearContents();
  sheet.getRange(1, 1, kept.length, kept[0].length).setValues(kept);
  if (rows.length) appendRows_(sheetName, rows);
}

function replaceRowsForClient_(sheetName, clientId, rows) {
  replaceRowsForClientInSpreadsheet_(SpreadsheetApp.getActive(), sheetName, clientId, rows);
}

function replaceRowsForClientInSpreadsheet_(ss, sheetName, clientId, rows) {
  const sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    appendRowsToSpreadsheet_(ss, sheetName, rows);
    return;
  }

  const kept = [values[0]].concat(values.slice(1).filter((row) => row[0] !== clientId));
  sheet.clearContents();
  sheet.getRange(1, 1, kept.length, kept[0].length).setValues(kept);
  if (rows.length) appendRowsToSpreadsheet_(ss, sheetName, rows);
}

function appendRowsToSpreadsheet_(ss, sheetName, rows) {
  if (!rows.length) return;
  const sheet = ss.getSheetByName(sheetName);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function finishReportRun_(runId, status, message) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('report_runs');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('run_id');
  const finishedIndex = headers.indexOf('finished_at');
  const statusIndex = headers.indexOf('status');
  const messageIndex = headers.indexOf('message');

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === runId) {
      sheet.getRange(i + 1, finishedIndex + 1).setValue(new Date());
      sheet.getRange(i + 1, statusIndex + 1).setValue(status);
      sheet.getRange(i + 1, messageIndex + 1).setValue(message);
      return;
    }
  }
}

function getLastCompleteMonth_() {
  const now = new Date();
  return getCompleteMonthPeriodsBack_(1, now)[0];
}

function getCompleteMonthPeriodsBack_(monthCount, anchorDate) {
  const now = anchorDate || new Date();
  const periods = [];

  for (let offset = monthCount; offset >= 1; offset -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    periods.push(getCalendarMonthPeriod_(start));
  }

  return periods;
}

function getCalendarMonthPeriod_(start) {
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  return {
    reportMonth: Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM'),
    startDate: Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(end, Session.getScriptTimeZone(), 'yyyy-MM-dd')
  };
}

function getOrCreateRootFolder_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('SEO_ROOT_FOLDER_ID');
  if (existingId) return DriveApp.getFolderById(existingId);

  const folder = getOrCreateFolderByName_(CONFIG.rootFolderName);
  props.setProperty('SEO_ROOT_FOLDER_ID', folder.getId());
  return folder;
}

function getOrCreateFolderByName_(name) {
  const matches = DriveApp.getFoldersByName(name);
  return matches.hasNext() ? matches.next() : DriveApp.createFolder(name);
}

function getOrCreateChildFolder_(parent, name) {
  const matches = parent.getFoldersByName(name);
  return matches.hasNext() ? matches.next() : parent.createFolder(name);
}

function setCellByHeader_(sheet, headers, rowNumber, headerName, value) {
  const column = headers.indexOf(headerName) + 1;
  if (column > 0) sheet.getRange(rowNumber, column).setValue(value);
}

function isActiveClient_(client) {
  return String(client.status || '').toLowerCase() !== 'inactive';
}
