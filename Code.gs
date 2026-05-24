const CONFIG = {
  rootFolderName: 'SEO Reporting System',
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
      'key_events'
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
      'event_count'
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

    finishReportRun_(runId, 'complete', 'Monthly data pull completed.');
  } catch (error) {
    finishReportRun_(runId, 'error', error && error.message ? error.message : String(error));
    throw error;
  }
}

function fetchGa4Reports_(propertyId, period) {
  const summary = runGa4Report_(propertyId, period, [], [
    'sessions',
    'totalUsers',
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
    'eventCount'
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
        metrics.keyEvents || ''
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
        row.metrics.eventCount || ''
      ]);
    }
  };
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
