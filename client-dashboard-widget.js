(function () {
  const WIDGET_VERSION = '2026-05-25.3';
  const DEFAULT_DASHBOARD_SRC = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRiDP5-SSqPNCk6BI8ujx6OCPfr_WhKyCRk1WDSBwXXSJ1s5U0euzAeflbE-hLHAZ04bindi1yhYg4U/pub?output=csv';

  const state = {};

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        row.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(value);
        if (row.some((cell) => cell !== '')) rows.push(row);
        row = [];
        value = '';
      } else {
        value += char;
      }
    }

    row.push(value);
    if (row.some((cell) => cell !== '')) rows.push(row);
    return rows;
  }

  async function loadCsvData(src, clientId) {
    const response = await fetch(src, { cache: 'reload' });
    const text = await response.text();

    if (!response.ok) throw new Error(`Dashboard CSV request failed: ${response.status}`);

    const rows = parseCsv(text);
    const headers = rows.shift() || [];
    const clientIndex = headers.indexOf('client_id');
    const payloadIndex = headers.indexOf('payload_json');

    if (clientIndex === -1 || payloadIndex === -1) {
      throw new Error(`Dashboard CSV is missing expected headers. Found: ${headers.join(', ') || 'none'}`);
    }

    const match = rows.find((row) => row[clientIndex] === clientId);
    if (!match) throw new Error(`Dashboard CSV has no row for client_id: ${clientId}`);

    return JSON.parse(match[payloadIndex]);
  }

  function injectStyles() {
    if (document.getElementById('client-dashboard-widget-styles')) return;

    const link = document.createElement('link');
    link.id = 'client-dashboard-widget-styles';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/sqspninja/seo-reporter@main/client-dashboard-widget.css?v=2026-05-25-3';
    document.head.appendChild(link);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(value) {
    if (value === '' || value === null || value === undefined) return '—';
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString() : escapeHtml(value);
  }

  function getChangeClass(change) {
    return change && change.tone ? `cd-change cd-change--${escapeHtml(change.tone)}` : 'cd-change';
  }

  function renderChange(change) {
    if (!change || !change.value) return '';
    return `<span class="${getChangeClass(change)}">${escapeHtml(change.value)}</span>`;
  }

  function renderKpiCard(kpi) {
    if (!kpi) return '';
    return `<article class="cd-kpi-card">
      <h2>${escapeHtml(kpi.title)}</h2>
      <div class="cd-kpi-row">
        <span>${escapeHtml(kpi.primaryLabel)}</span>
        <strong>${escapeHtml(kpi.primaryValue)}</strong>
        ${renderChange(kpi.primaryChange)}
      </div>
      <div class="cd-kpi-row cd-kpi-row--secondary">
        <span>${escapeHtml(kpi.secondaryLabel)}</span>
        <strong>${escapeHtml(kpi.secondaryValue)}</strong>
        ${renderChange(kpi.secondaryChange)}
      </div>
    </article>`;
  }

  function renderKpis(kpis) {
    return `<section class="cd-kpis" aria-label="Monthly performance summary">
      ${renderKpiCard(kpis.websiteVisitors)}
      ${renderKpiCard(kpis.searchVisibility)}
      ${renderKpiCard(kpis.visitorEngagement)}
    </section>`;
  }

  function renderTable(rows, columns) {
    const visibleRows = (rows || []).slice(0, 5);
    const body = visibleRows.length
      ? visibleRows.map((row) => `<tr>${columns.map((column) => `
          <td data-label="${escapeHtml(column.label)}" class="${column.key === 'page' ? 'cd-page-cell' : ''}">
            ${column.format ? column.format(row[column.key]) : escapeHtml(row[column.key])}
          </td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columns.length}">No data available for this section.</td></tr>`;

    return `<div class="cd-table-wrap">
      <table>
        <thead><tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
  }

  function renderKeywordPerformance(data) {
    const keywordColumns = [
      { key: 'keyword', label: 'Keyword' },
      { key: 'clicks', label: 'Clicks', format: formatNumber },
      { key: 'impressions', label: 'Impressions', format: formatNumber },
      { key: 'position', label: 'Position' }
    ];

    return `<section class="cd-section cd-search-performance">
      <header class="cd-section-header"><h2>Search Performance</h2></header>
      <div class="cd-table-grid">
        <article class="cd-table-card">
          <h3>Top Keywords by Clicks</h3>
          ${renderTable(data.topKeywordsByClicks, keywordColumns)}
        </article>
        <article class="cd-table-card">
          <h3>Top Keywords by Visibility</h3>
          ${renderTable(data.topKeywordsByVisibility, keywordColumns)}
        </article>
      </div>
    </section>`;
  }

  function renderTabbedTable(id, title, tabs, clientState) {
    const activeTab = clientState[id] || Object.keys(tabs)[0];
    const active = tabs[activeTab];
    const pageColumns = [
      { key: 'page', label: 'Page' },
      { key: 'clicks', label: 'Clicks', format: formatNumber },
      { key: 'impressions', label: 'Impressions', format: formatNumber },
      { key: 'position', label: 'Position' }
    ];

    return `<section class="cd-section">
      <header class="cd-section-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${active.note ? `<p>${escapeHtml(active.note)}</p>` : ''}
        </div>
        <div class="cd-tabs" role="tablist" aria-label="${escapeHtml(title)} views">
          ${Object.keys(tabs).map((key) => `<button type="button" data-cd-tab="${escapeHtml(id)}" data-cd-tab-value="${escapeHtml(key)}" aria-pressed="${key === activeTab}">${escapeHtml(tabs[key].label)}</button>`).join('')}
        </div>
      </header>
      ${renderTable(active.rows, pageColumns)}
    </section>`;
  }

  function renderTrafficSources(rows) {
    const columns = [
      { key: 'source', label: 'Source' },
      { key: 'users', label: 'Users', format: formatNumber },
      { key: 'sessions', label: 'Sessions', format: formatNumber },
      { key: 'engagement', label: 'Engagement' }
    ];

    return `<section class="cd-section">
      <header class="cd-section-header"><h2>Top Traffic Sources</h2></header>
      ${renderTable(rows || [], columns)}
    </section>`;
  }

  function renderSeoOverview(seoOverview) {
    const seo = seoOverview || {};
    const items = seo.items || [];

    return `<section class="cd-section cd-seo-overview">
      <header class="cd-section-header"><h2>SEO Health Overview</h2></header>
      ${seo.status ? `<p>${escapeHtml(seo.status)}</p>` : ''}
      <ul class="cd-list">
        ${items.length ? items.map((item) => `<li><span>${escapeHtml(item.label)}</span>${item.status ? `<small>${escapeHtml(item.status)}</small>` : ''}</li>`).join('') : '<li>No SEO overview items yet.</li>'}
      </ul>
      ${seo.reportUrl ? `<p><a href="${escapeHtml(seo.reportUrl)}">View Full SEO Report</a></p>` : '<p><a href="#">View Full SEO Report</a></p>'}
    </section>`;
  }

  function renderSidebarList(title, items) {
    return `<section class="cd-sidebar-section">
      <h2>${escapeHtml(title)}</h2>
      <ul class="cd-list">${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>No items yet.</li>'}</ul>
    </section>`;
  }

  function renderSidebar(sidebar) {
    const data = sidebar || {};
    const contact = data.contact || {};

    return `<aside class="cd-sidebar">
      ${renderSidebarList('Things You Can Do', data.thingsYouCanDo)}
      ${renderSidebarList('Things I Can Help With', data.thingsICanHelpWith)}
      ${renderSidebarList('Completed This Month', data.completedThisMonth)}
      <section class="cd-sidebar-section">
        <h2>Need Help With This?</h2>
        ${contact.text ? `<p>${escapeHtml(contact.text)}</p>` : ''}
        <p><a href="${escapeHtml(contact.href || '#')}">${escapeHtml(contact.buttonLabel || 'Request Help')}</a></p>
      </section>
    </aside>`;
  }

  function renderDashboard(root, data, clientState) {
    const pageTabs = {
      clicks: { label: 'By Clicks', rows: data.pagesByClicks || [] },
      impressions: { label: 'By Impressions', rows: data.pagesByImpressions || [] }
    };
    const opportunityTabs = {
      highImpressions: {
        label: 'High Impressions',
        rows: data.pageOpportunities ? data.pageOpportunities.highImpressions : [],
        note: 'Pages with visibility that may be worth improving, rewriting, expanding, or optimizing.'
      },
      goodPositionNoClicks: {
        label: 'Good Position, No Clicks',
        rows: data.pageOpportunities ? data.pageOpportunities.goodPositionNoClicks : [],
        note: 'Pages showing up in search but not earning clicks yet.'
      }
    };

    root.classList.add('client-dashboard');
    root.innerHTML = `
      <header class="cd-header">
        <p class="cd-version">Dashboard widget ${escapeHtml(WIDGET_VERSION)} · live csv</p>
        <h1>${escapeHtml(data.clientName || data.websiteName || 'Monthly Website Report')} Monthly Website Report</h1>
        ${data.reportRange ? `<p>${escapeHtml(data.reportRange)}</p>` : ''}
      </header>
      ${renderKpis(data.kpis || {})}
      <div class="cd-layout">
        <main class="cd-main">
          ${renderKeywordPerformance(data)}
          ${renderTabbedTable('pagesView', 'Pages Getting Search Traffic', pageTabs, clientState)}
          ${renderTrafficSources(data.trafficSources)}
          ${renderTabbedTable('opportunitiesView', 'Page Opportunities', opportunityTabs, clientState)}
          ${renderSeoOverview(data.seoOverview)}
        </main>
        ${renderSidebar(data.sidebar)}
      </div>
    `;
  }

  function renderError(root, message) {
    root.classList.add('client-dashboard');
    root.innerHTML = `<section class="cd-section"><h2>Dashboard unavailable</h2><p>${escapeHtml(message)}</p></section>`;
  }

  function mount(root) {
    const clientId = root.getAttribute('data-client-id');
    const src = root.getAttribute('data-dashboard-src') || window.CLIENT_DASHBOARD_SRC || DEFAULT_DASHBOARD_SRC;

    if (!clientId) {
      renderError(root, 'Missing client id.');
      return;
    }

    root.classList.add('client-dashboard');
    root.innerHTML = '<p>Loading dashboard...</p>';

    loadCsvData(src, clientId)
      .then((data) => {
        state[clientId] = state[clientId] || { pagesView: 'clicks', opportunitiesView: 'highImpressions' };
        root.__clientDashboardData = Object.assign({}, data, { __source: 'csv' });
        renderDashboard(root, root.__clientDashboardData, state[clientId]);
      })
      .catch((error) => {
        console.warn('[client-dashboard] Dashboard CSV load failed.', error);
        renderError(root, error.message);
      });

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cd-tab]');
      if (!button) return;
      const tabId = button.getAttribute('data-cd-tab');
      const tabValue = button.getAttribute('data-cd-tab-value');
      const currentData = root.__clientDashboardData;

      if (!currentData) return;
      state[clientId][tabId] = tabValue;
      renderDashboard(root, currentData, state[clientId]);
    });
  }

  function init() {
    injectStyles();
    document.querySelectorAll('[data-client-dashboard]').forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
